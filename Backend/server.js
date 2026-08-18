require("dotenv").config();

const os      = require("os");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt  = require("bcrypt");
const jwt     = require("jsonwebtoken");
const cors    = require("cors");
const path    = require("path");
const multer  = require("multer");
const fs      = require("fs");
const axios   = require("axios");
const rateLimit = require("express-rate-limit");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);



const loginLimiter = rateLimit({ windowMs: 15*60*1000, max: 10, message: { message: "Too many login attempts. Try after 15 minutes." }});
const otpLimiter   = rateLimit({ windowMs: 10*60*1000, max: 5,  message: { message: "Too many OTP requests. Try after 10 minutes." }});
const sosLimiter   = rateLimit({ windowMs: 1*60*1000,  max: 5,  message: { message: "Too many SOS requests." }});

const User        = require("./models/user");
const DamageReport = require("./models/Damagereport");
const Ngo         = require("./models/ngo");
const HelpOrder   = require("./models/helpOrder");
const SOS         = require("./models/sos");
const Complaint   = require("./models/complaint");
const Broadcast = require("./models/broadcast");
const Shelter = require("./models/shelter");
const Safety = require("./models/safety");
const app = express();

app.set('trust proxy', 1);

// ===== OTP store — namespaced to prevent user/admin/ngo collision =====
const otpStore = {};
function setOtp(namespace, id, otp) {
  otpStore[namespace + ":" + id] = { otp, verified: false, expires: Date.now() + 5*60*1000 };
}
function getOtp(namespace, id) {
  const entry = otpStore[namespace + ":" + id];
  if (!entry) return null;
  if (Date.now() > entry.expires) { delete otpStore[namespace + ":" + id]; return null; }
  return entry;
}
function deleteOtp(namespace, id) { delete otpStore[namespace + ":" + id]; }

// ===== CREATE UPLOAD FOLDER =====
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== FIX 4: CORS — restrict in production =====
const allowedOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));
















async function getIP() {
  try {
    const res = await axios.get("https://api.ipify.org?format=json");
    return res.data.ip;
  } catch {
    return "unknown";
  }
}

// ===== TOKEN MIDDLEWARE =====
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}

function verifyAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}

function verifyNgo(req, res, next) {
  if (req.user.role !== "ngo") {
    return res.status(403).json({ message: "NGO access only" });
  }
  next();
}

function verifyUser(req, res, next) {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "User access only" });
  }
  next();
}

// ===== FIX 10: MULTER — images only, 5 MB limit =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = require("crypto").randomBytes(16).toString("hex");
    cb(null, Date.now() + "-" + safe + ext);
  }
});

const imageFilter = function (req, file, cb) {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, gif, webp)"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});
app.get("/api/news", async (req, res) => {
  try {
    const response = await axios.get(
     `https://gnews.io/api/v4/search?q=weather%20OR%20disaster&lang=en&token=${process.env.GNEWS_KEY}`
    );

    res.json(response.data);

  } catch (error) {
  console.log("News API error:", error.response?.status);


  res.json({ articles: [] });
}
});

// ===== WEATHER API (ADD THIS BELOW /api/news) =====
app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    // Call OWM Current Weather API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OWM_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (err) {
    console.log("Weather API error:", err.message);
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

// ===== AQI PROXY — OWM key stays on server =====
app.get("/api/aqi", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: "lat and lng required" });
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${process.env.OWM_KEY}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "AQI fetch failed" });
  }
});


// ===== FORECAST PROXY — 5-day/3-hour, OWM key stays on server =====
app.get("/api/forecast", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: "lat and lng required" });
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${process.env.OWM_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Forecast fetch failed" });
  }
});



// ================= ONLINE STATES & DISTRICTS API (Zero Key Needed) =================
let _cachedIndiaData = null;

async function getIndiaLocationData() {
  if (_cachedIndiaData) return _cachedIndiaData;
  const res = await axios.get("https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json");
  _cachedIndiaData = res.data.states;
  return _cachedIndiaData;
}

// 1. Fetch All 36 States & UTs
app.get("/api/states", async (req, res) => {
  try {
    const statesData = await getIndiaLocationData();
    const states = statesData.map(s => ({ name: s.state })).sort((a, b) => a.name.localeCompare(b.name));
    res.json(states);
  } catch (err) {
    console.error("States API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch states" });
  }
});

// 2. Fetch All Districts for Selected State
app.get("/api/districts", async (req, res) => {
  try {
    const { state } = req.query;
    if (!state) return res.status(400).json({ error: "State parameter required" });

    const statesData = await getIndiaLocationData();
    const matched = statesData.find(s => s.state.trim().toLowerCase() === state.trim().toLowerCase());

    if (!matched || !matched.districts) {
      return res.json([]);
    }

    const districts = matched.districts.sort().map(d => ({ name: d }));
    res.json(districts);
  } catch (err) {
    console.error("Districts API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch districts" });
  }
});


// ===== FIX 2: MongoDB uses MONGO_URI env variable =====
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Biswajit:8260@cluster0.r7mdymg.mongodb.net/disasterDB"
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// ================= USER REGISTER =================
// ================= USER REGISTER =================
app.post("/api/register", async (req, res) => {
  try {
    const { firstName, middleName, lastName, mobile, email, state, district, password, role } = req.body;
    console.log("Register request body:", req.body);

    if (role === "admin") {
      return res.status(403).json({
        message: "Admin registration is not allowed. Admin must login using their Admin ID."
      });
    }

    if (role !== "user") {
      return res.status(400).json({
        message: "Invalid role. Only 'user' can register here."
      });
    }

    // Check existing by mobile or email
    let existingUser;
    if (email && email.trim() !== "") {
      existingUser = await User.findOne({ $or: [{ mobile }, { email }] });
    } else {
      existingUser = await User.findOne({ mobile });
    }

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this mobile or email."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Build the required full name string
    const computedName = [firstName, middleName, lastName].filter(Boolean).join(" ") || req.body.name || "User";

    const user = new User({
      firstName: (firstName || "").trim(),
      middleName: (middleName || "").trim(),
      lastName: (lastName || "").trim(),
      name: computedName.trim(),
      email: (email || "").trim(),
      mobile: (mobile || "").trim(),
      state: (state || "").trim(),
      district: (district || "").trim(),
      password: hashedPassword,
      role: "user"
    });

    await user.save();
    res.json({ message: "User Registered Successfully" });

  } catch (err) {
    console.error("REGISTER 500 ERROR:", err);
    res.status(500).json({ message: err.message || "Registration failed due to server error" });
  }
});

// ================= USER LOGIN =================
app.post("/api/login", async (req, res) => {
  try {
    const { identifier, password, role } = req.body;
    let user;

  if (role === "admin") {
      user = await User.findOne({
        $or: [{ adminId: identifier }, { email: identifier }, { mobile: identifier }],
        role: "admin"
      });
      if (!user) {
        return res.status(400).json({ message: "Invalid Admin credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Wrong password" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      setOtp("admin-login", user.adminId, otp);

      console.log(`[ADMIN LOGIN OTP] Code for ${user.email} (${user.adminId}) is: ${otp}`);

     // Send email asynchronously in background so login responds instantly
      transporter.sendMail({
        from: `"Alertify Command Center" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "🛡️ Admin 2FA Login Code",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; max-width: 480px;">
            <h2 style="color: #7c3aed; margin-top: 0;">Admin Security Verification</h2>
            <p>Your login OTP for Admin ID <strong>${user.adminId}</strong> is:</p>
            <h1 style="font-size: 32px; letter-spacing: 6px; color: #1e293b; background: #f5f3ff; padding: 12px; border-radius: 8px; text-align: center;">${otp}</h1>
            <p style="color: #64748b; font-size: 13px;">Expires in 5 minutes.</p>
          </div>
        `
      }).catch(err => console.error("Background email error:", err.message));

      const maskedEmail = user.email.replace(/(.{2})(.*)(?=@)/, (g1, g2, g3) => g2 + "*".repeat(g3.length));
      return res.json({
        requires2FA: true,
        adminId: user.adminId,
        email: maskedEmail,
        message: "OTP sent to your registered email address."
      });
    } else if (role === "user") {
      if (identifier.startsWith("ADM")) {
        return res.status(400).json({ message: "Use Admin role for Admin login" });
      }
      user = await User.findOne({ $or: [{ mobile: identifier }, { email: identifier }] });
      if (!user || user.role !== "user") {
        return res.status(400).json({ message: "User not found. Please register first" });
      }
    } else {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN VERIFY LOGIN 2FA OTP =================
app.post("/api/admin/verify-login-otp", async (req, res) => {
  try {
    const { adminId, otp } = req.body;
    const record = getOtp("admin-login", adminId);

    if (!record || Number(otp) !== record.otp) {
      return res.status(400).json({ message: "Invalid or expired verification code." });
    }

    const user = await User.findOne({ adminId, role: "admin" });
    if (!user) return res.status(404).json({ message: "Admin account not found." });

    deleteOtp("admin-login", adminId);

    const token = jwt.sign(
      { id: user._id, role: user.role, adminId: user.adminId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= ADMIN RESEND LOGIN 2FA OTP =================
app.post("/api/admin/resend-login-otp", otpLimiter, async (req, res) => {
  try {
    const { adminId } = req.body;
    const user = await User.findOne({ adminId, role: "admin" });
    if (!user) return res.status(404).json({ message: "Admin not found." });

    const otp = Math.floor(100000 + Math.random() * 900000);
    setOtp("admin-login", user.adminId, otp);

    console.log(`[RESEND OTP] Code for ${user.adminId} is: ${otp}`);
    resend.emails.send({
        from: "Alertify Command Center <onboarding@resend.dev>",
        to: user.email,
        subject: "🛡️ Admin 2FA Login Code",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; max-width: 480px;">
            <h2 style="color: #7c3aed; margin-top: 0;">Admin Security Verification</h2>
            <p>Your login OTP for Admin ID <strong>${user.adminId}</strong> is:</p>
            <h1 style="font-size: 32px; letter-spacing: 6px; color: #1e293b; background: #f5f3ff; padding: 12px; border-radius: 8px; text-align: center;">${otp}</h1>
            <p style="color: #64748b; font-size: 13px;">Expires in 5 minutes.</p>
          </div>
        `
      }).catch(err => console.error("Resend API error:", err.message));

    res.json({ message: "New OTP sent to your registered email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= GET USER PROFILE =================
app.get("/api/user/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UPDATE USER PROFILE =================
app.put("/api/user/profile", verifyToken, async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, state, district, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (firstName) user.firstName = firstName.trim();
    user.middleName = (middleName || "").trim();
    if (lastName) user.lastName = lastName.trim();

    // Construct full name
    const combinedName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ");
    if (combinedName) user.name = combinedName;

    if (email !== undefined) user.email = email.trim();
    if (state !== undefined) user.state = state.trim();
    if (district !== undefined) user.district = district.trim();

    // Only update password if user typed a new one
    if (password && password.trim() !== "") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters with uppercase, lowercase, number and special character." });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "Profile updated successfully", name: user.name });
  } catch (err) {
    res.status(500).json({ message: "Update failed: " + err.message });
  }
});

// ================= DELETE USER ACCOUNT =================
app.delete("/api/user/profile", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Account deletion failed" });
  }
});




// ================= ADMIN EMAIL OTP (Pre-Registration) =================
app.post("/api/admin/send-register-otp", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email address is required." });
    }

    const existing = await User.findOne({ email: email.trim() });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
      setOtp("admin-login", user.adminId, otp);

      console.log(`[ADMIN LOGIN OTP] Code for ${user.email} (${user.adminId}) is: ${otp}`);

      // Send email via Resend API asynchronously in background
      resend.emails.send({
        from: "Alertify Command Center <onboarding@resend.dev>",
        to: user.email,
        subject: "🛡️ Admin 2FA Login Code",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; max-width: 480px;">
            <h2 style="color: #7c3aed; margin-top: 0;">Admin Security Verification</h2>
            <p>Your login OTP for Admin ID <strong>${user.adminId}</strong> is:</p>
            <h1 style="font-size: 32px; letter-spacing: 6px; color: #1e293b; background: #f5f3ff; padding: 12px; border-radius: 8px; text-align: center;">${otp}</h1>
            <p style="color: #64748b; font-size: 13px;">Expires in 5 minutes.</p>
          </div>
        `
      }).catch(err => console.error("Resend API error:", err.message));

    res.json({ message: "Verification code sent to your email." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN REGISTER =================
app.post("/api/admin/register", async (req, res) => {
  try {
    const { name, firstName, middleName, lastName, email, mobile, state, district, address, password, secretKey, otp } = req.body;

    const validSecret = process.env.ADMIN_SECRET_KEY;
    if (!validSecret || secretKey !== validSecret) {
      return res.status(403).json({ message: "Invalid Admin Secret Key. Contact the system owner." });
    }

    if (!email || !mobile || !password || !otp) {
      return res.status(400).json({ message: "All fields including email verification OTP are required." });
    }

    // Verify Register OTP
    const cleanEmail = email.trim().toLowerCase();
    const record = getOtp("admin-reg", cleanEmail);
    if (!record || Number(otp) !== record.otp) {
      return res.status(400).json({ message: "Invalid or expired Email OTP code." });
    }

    const existing = await User.findOne({
      $or: [{ email: cleanEmail }, { mobile: mobile.trim() }]
    });

    if (existing) {
      return res.status(400).json({ 
        message: "An account with this email or mobile already exists.",
        adminId: existing.adminId  
      });
    }

    let adminId;
    let isUnique = false;
    while (!isUnique) {
      adminId = "ADM" + Math.floor(10000 + Math.random() * 90000);
      const clash = await User.findOne({ adminId });
      if (!clash) isUnique = true;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const computedName = name || [firstName, middleName, lastName].filter(Boolean).join(" ").trim() || "Admin";

    const admin = new User({
      name: computedName,
      firstName: (firstName || "").trim(),
      middleName: (middleName || "").trim(),
      lastName: (lastName || "").trim(),
      email: cleanEmail,
      mobile: (mobile || "").trim(),
      state: (state || "").trim(),
      district: (district || "").trim(),
      address: (address || "").trim(),
      password: hashedPassword,
      role: "admin",
      adminId
    });

    await admin.save();
    deleteOtp("admin-reg", cleanEmail);

    res.json({
      message: "Admin account created successfully.",
      adminId
    });

  } catch (err) {
    console.log("ADMIN REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= NGO REGISTER =================
app.post("/api/ngo/register", async (req, res) => {
  try {
    let existingNgo;
    if (req.body.email && req.body.email.trim() !== "") {
      existingNgo = await Ngo.findOne({ $or: [{ mobile: req.body.mobile }, { email: req.body.email }] });
    } else {
      existingNgo = await Ngo.findOne({ mobile: req.body.mobile });
    }

    if (existingNgo) {
      return res.status(400).json({
        message: "NGO already registered with this mobile number",
        ngoId: existingNgo.ngoId
      });
    }

    const ngoId = "NGO" + Math.floor(10000 + Math.random() * 90000);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newNgo = new Ngo({ ...req.body, password: hashedPassword, ngoId });
    await newNgo.save();

    res.json({
      message: "NGO Registered Successfully. Waiting for Admin Approval.",
      ngoId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= NGO LOGIN =================
app.post("/api/ngo/login", loginLimiter, async (req, res) => {
  try {
    const { ngoId, password } = req.body;
    const ngo = await Ngo.findOne({ ngoId });

    if (!ngo) return res.status(400).json({ message: "NGO not found" });
    if (ngo.status !== "Approved") return res.status(400).json({ message: "NGO not approved by admin yet" });

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: ngo._id, role: "ngo", ngoId: ngo.ngoId }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token, ngo });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= CHECK NGO STATUS =================
app.get("/api/ngo/status/:ngoId", async (req, res) => {
  try {
    const ngo = await Ngo.findOne({ ngoId: req.params.ngoId });
    if (!ngo) return res.status(404).json({ message: "Invalid NGO ID" });
    res.json({ ngoName: ngo.ngoName, status: ngo.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= GET ALL NGOs =================
app.get("/api/admin/ngos", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const ngos = await Ngo.find().sort({ createdAt: -1 });
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= APPROVE NGO =================
app.put("/api/admin/approve/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Ngo.findByIdAndUpdate(req.params.id, { status: "Approved" });
    res.json({ message: "NGO Approved Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= REJECT NGO =================
app.put("/api/admin/reject/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Ngo.findByIdAndUpdate(req.params.id, { status: "Rejected" });
    res.json({ message: "NGO Rejected Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= CREATE HELP ORDER =================
app.post("/api/admin/create-order", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { location, note, assignedNgo } = req.body;

    // 🚫 STOP DUPLICATE ORDERS
    const exists = await HelpOrder.findOne({
      location,
      note,
      assignedNgo,
      status: "Pending"
    });

    if (exists) {
      return res.status(400).json({ message: "Order already exists" });
    }

    const order = new HelpOrder(req.body);
    await order.save();

    res.json({ message: "Help order created successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= GET NGO ORDERS =================
// FIX 9: Added verifyNgo — only that NGO can see its own orders
app.get("/api/ngo/orders/:ngoId", verifyToken, verifyNgo, async (req, res) => {
  try {
    // Extra safety: NGO can only read its own orders
    if (req.user.ngoId && req.user.ngoId !== req.params.ngoId) {
      return res.status(403).json({ message: "Access denied: you can only view your own orders" });
    }
    const orders = await HelpOrder.find({ assignedNgo: req.params.ngoId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= ADMIN VIEW ALL ORDERS =================
app.get("/api/admin/orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await HelpOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= NGO UPDATE ORDER =================
app.put("/api/ngo/update-order/:id", verifyToken, verifyNgo, upload.single("photo"), async (req, res) => {
  try {

    // 🚫 REQUIRE BOTH
    if (!req.file || !req.body.workNote) {
      return res.status(400).json({ message: "Photo and work note are required" });
    }

    // 🚫 STOP MULTIPLE COMPLETE
    const order = await HelpOrder.findById(req.params.id);
    if (order.status === "Completed") {
      return res.status(400).json({ message: "Already completed" });
    }

    await HelpOrder.findByIdAndUpdate(req.params.id, {
      status: "Completed",
      workNote: req.body.workNote,
      photo: req.file.filename
    });

    res.json({ message: "Order updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 

// ================= USER SEND SOS =================
// ================= SEND SOS (Logged-in & Pre-Login) =================
app.post("/api/sos", sosLimiter, async (req, res) => {
  try {
    const { numbers, userName, mobile, state, district, latitude, longitude, googleMapsLink, isPreLogin } = req.body;

    if (!numbers || numbers.length === 0) {
      return res.status(400).json({ message: "No numbers selected" });
    }

    const sos = new SOS({
      numbers,
      userName: userName || (isPreLogin ? "Pre-Login Citizen" : "Citizen"),
      mobile: mobile || "N/A",
      state: state || "N/A",
      district: district || "N/A",
      latitude: latitude || null,
      longitude: longitude || null,
      googleMapsLink: googleMapsLink || "",
      isPreLogin: Boolean(isPreLogin)
    });

    await sos.save();
    res.json({ message: "SOS Sent Successfully" });
  } catch (error) {
    console.error("SOS Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});
// ================= ADMIN GET ALL SOS =================
app.get("/api/admin/sos", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const sosList = await SOS.find().sort({ time: -1 });
    res.json(sosList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= ADMIN MARK SOS RESOLVED =================
app.put("/api/admin/sos/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const targetId = req.params.id;
    const query = mongoose.Types.ObjectId.isValid(targetId) ? { _id: targetId } : { id: targetId };

    const updated = await SOS.findOneAndUpdate(query, { status: "Resolved" }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "SOS record not found" });
    }

    res.json({ message: "SOS Marked Resolved", sos: updated });
  } catch (error) {
    console.error("SOS UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// ===== REQUEST OTP (User) =====
app.post("/api/request-otp", otpLimiter, async (req, res) => {

  const { mobile } = req.body;

  // 🔴 CHECK REGISTERED USER
  const user = await User.findOne({ mobile });
  if (!user) {
    return res.status(400).json({
      message: "Mobile number not registered. Please register first."
    });
  }

  // 🔢 GENERATE OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  setOtp("user", mobile, otp);

  // 🟢 TERMINAL OTP (ALWAYS KEEP)
  console.log("OTP for", mobile, "is:", otp);

  // 🔵 SMS OTP (OPTIONAL - CAN REMOVE LATER)
  try {
    await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: process.env.FAST2SMS_KEY,
        route: "q",
        message: `OTP:${otp}`,
        numbers: mobile
      }
    });

    console.log("SMS sent to:", mobile);

  } catch (error) {
  console.log("SMS ERROR:", error.response?.data || error.message);
}

  res.json({ message: "OTP sent successfully" });
});

// ===== VERIFY OTP (User) =====
// FIX 6: Use strict === with Number() conversion, mark as verified
app.post("/api/verify-otp", (req, res) => {
  const { mobile, otp } = req.body;

  const record = getOtp("user", mobile);
  if (!record) {
    return res.status(400).json({ message: "OTP not requested or expired" });
  }

  if (Number(otp) === record.otp) {
    otpStore["user:" + mobile].verified = true;
    res.json({ message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});


// ===== RESET PASSWORD (User) =====
app.post("/api/reset-password", async (req, res) => {
  try {
    const { mobile, newPassword } = req.body;

    const recUser = getOtp("user", mobile);
    if (!recUser || !recUser.verified) {
      return res.status(400).json({ message: "OTP not verified or expired. Please request OTP again." });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if new password matches the previous/old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ 
        message: "New password cannot be the same as your previous password. Please create a new one." 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    deleteOtp("user", mobile);

    res.json({ message: "Password reset successful! Please login with your new password." });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});
// ===== ADMIN REQUEST OTP =====
app.post("/api/admin/request-otp", otpLimiter, async (req, res) => {

  const { adminId } = req.body;

  const admin = await User.findOne({ $or: [{ adminId }, { email: adminId }], role: "admin" });

  if (!admin) {
    return res.status(400).json({ message: "Admin not found" });
  }

  // 🔢 GENERATE OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  setOtp("admin", adminId, otp);

  // 🟢 TERMINAL OTP (KEEP ALWAYS)
  console.log("OTP for ADMIN", adminId, "is:", otp);

  // 🔵 SMS OTP (ADD SAME AS USER)
  try {
    await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: process.env.FAST2SMS_KEY,
        route: "q",
        message: `OTP:${otp}`,
        numbers: admin.mobile
      }
    });

    console.log("Admin SMS sent to:", admin.mobile);

  } catch (error) {
  console.log("SMS ERROR:", error.response?.data || error.message);
}

  res.json({ message: "OTP sent successfully" });
});
// ===== ADMIN VERIFY OTP =====
app.post("/api/admin/verify-otp", (req, res) => {

  const { adminId, otp } = req.body;

  const recAdmin = getOtp("admin", adminId);
  if (!recAdmin) {
    return res.status(400).json({ message: "OTP not requested or expired" });
  }

  if (Number(otp) === recAdmin.otp) {
    otpStore["admin:" + adminId].verified = true;
    res.json({ message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});
// ===== ADMIN RESET PASSWORD =====
app.post("/api/admin/reset-password", async (req, res) => {

  const { adminId, newPassword } = req.body;

  const recAdminReset = getOtp("admin", adminId);
  if (!recAdminReset || !recAdminReset.verified) {
    return res.status(400).json({ message: "OTP not verified" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.updateOne({ adminId }, { password: hashedPassword });

  deleteOtp("admin", adminId);

  res.json({ message: "Admin password reset successful" });
});
// ===== NGO REQUEST OTP =====
app.post("/api/ngo/request-otp", otpLimiter, async (req, res) => {

  const { ngoId } = req.body;

  const ngo = await Ngo.findOne({ ngoId });
  if (!ngo) {
    return res.status(400).json({ message: "NGO not registered" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  setOtp("ngo", ngoId, otp);

  // 🟢 TERMINAL OTP
  console.log("OTP for NGO", ngoId, "is:", otp);

  // 🔵 SMS OTP (OPTIONAL)
  try {
    await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: process.env.FAST2SMS_KEY,
        route: "q",
        message: `OTP:${otp}`,
        numbers: ngo.mobile
      }
    });
  } catch (error) {
    console.log("SMS failed");
  }

  res.json({ message: "OTP sent successfully" });
});




//try {
  //await axios.get(...)
//} catch {}    TO REMOVE SMS LATER:





// ===== NGO VERIFY OTP =====
app.post("/api/ngo/verify-otp", (req, res) => {
  const { ngoId, otp } = req.body;

  const recNgo = getOtp("ngo", ngoId);
  if (!recNgo) {
    return res.status(400).json({ message: "OTP not requested or expired" });
  }

  if (Number(otp) === recNgo.otp) {
    otpStore["ngo:" + ngoId].verified = true;
    res.json({ message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

// ===== NGO RESET PASSWORD =====
app.post("/api/ngo/reset-password", async (req, res) => {
  const { ngoId, newPassword } = req.body;

  const recNgoReset = getOtp("ngo", ngoId);
  if (!recNgoReset || !recNgoReset.verified) {
    return res.status(400).json({ message: "OTP not verified. Please verify OTP first." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await Ngo.updateOne({ ngoId }, { password: hashedPassword });
  deleteOtp("ngo", ngoId);

  res.json({ message: "NGO password reset successful" });
});

// ================= SAVE COMPLAINT =================
// FIX 7: Generate complaint ID server-side and return it
app.post("/api/complaint", async (req, res) => {
  console.log("Complaint route HIT");
  console.log("Body received:", req.body);

  try {
    const complaintId = "CMP" + Date.now();

    const complaint = new Complaint({
      ...req.body,
      id: complaintId
    });

    await complaint.save();
    res.json({ message: "Complaint submitted successfully", complaintId });
  } catch (error) {
    console.log("SAVE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// ================= TRACK COMPLAINT =================
// FIX 8: Query by 'id' string field (now always set server-side)
app.get("/api/complaint/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ message: "Not found" });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADMIN GET ALL COMPLAINTS =================
app.get("/api/admin/complaints", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADMIN UPDATE COMPLAINT =================
app.put("/api/admin/complaint/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const targetId = req.params.id;

    const query = mongoose.Types.ObjectId.isValid(targetId)
      ? { $or: [{ id: targetId }, { _id: targetId }] }
      : { id: targetId };

    const updated = await Complaint.findOneAndUpdate(query, { status, adminReply }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Complaint record not found" });
    }

    res.json({ message: "Complaint updated successfully", complaint: updated });
  } catch (error) {
    console.error("COMPLAINT UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});


// ===== FILTER NGOs =====
app.get("/api/admin/filter-ngos", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { state, district } = req.query;
    let filter = {};
    if (state) filter.state = { $regex: new RegExp("^" + state + "$", "i") };
    if (district) filter.district = { $regex: new RegExp("^" + district + "$", "i") };
    const ngos = await Ngo.find(filter);
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: "Filtering failed" });
  }
});

// ================= DAMAGE REPORT =================
app.post("/api/damage-report", verifyToken, upload.single("photo"), async (req, res) => {
  try {
    const { name, address, disasterType, description, mobile } = req.body;
    if (!name || !address || !description) {
      return res.status(400).json({ message: "Name, address and description are required." });
    }
    const reportId = "RPT" + Date.now();
    const report = new DamageReport({
      reportId,
      name,
      mobile: mobile || "",
      address,
      disasterType: disasterType || "other",
      description,
      photo: req.file ? req.file.filename : ""
    });
    await report.save();
    res.json({ message: "Damage report submitted successfully", reportId });
  } catch (e) {
    res.status(500).json({ message: "Server error: " + e.message });
  }
});

// ===== TRACK DAMAGE REPORT =====
app.get("/api/damage-report/:reportId", async (req, res) => {
  try {
    const report = await DamageReport.findOne({ reportId: req.params.reportId });
    if (!report) return res.status(404).json({ message: "Report not found. Please check the Report ID." });
    res.json(report);
  } catch (e) {
    res.status(500).json({ message: "Server error: " + e.message });
  }
});

// ===== ADMIN GET ALL DAMAGE REPORTS =====
app.get("/api/admin/damage-reports", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reports = await DamageReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===== ADMIN UPDATE DAMAGE REPORT =====
app.put("/api/admin/damage-report/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    await DamageReport.findByIdAndUpdate(req.params.id, { status, adminNote });
    res.json({ message: "Report updated" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});



// ===== LOG SERVER START =====
async function logServerStart() {
  try {
    const ip = await getIP();
    console.log("===== SERVER START =====");
    console.log("Time:", new Date());
    console.log("IP:", ip);
    console.log("========================");
  } catch (e) {
    console.log("Log error (non-fatal):", e.message);
  }
}


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});






// ===== STATIC FILES =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Fronted/index.html"));
});

app.use(express.static(path.join(__dirname, "../Fronted")));
app.use("/uploads", express.static(UPLOADS_DIR));

// ==========================================
// 📢 BROADCAST ADVISORY ENDPOINTS
// ==========================================

// 1. Admin: Create a new Public Emergency Broadcast
app.post("/api/admin/broadcast", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, message, severity, targetState, targetDistrict } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required." });
    }

    const broadcast = new Broadcast({
      title,
      message,
      severity: severity || "Medium",
      targetState: targetState || "All",
      targetDistrict: targetDistrict || "All"
    });

    await broadcast.save();
    res.json({ message: "Emergency Broadcast published successfully!", broadcast });
  } catch (error) {
    console.error("Broadcast creation error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 2. Public / Citizens: Get active Broadcasts (with optional State/District filter)
app.get("/api/broadcasts", async (req, res) => {
  try {
    const { state, district } = req.query;
    let filter = { isActive: true };

    if (state && state !== "All") {
      filter.$or = [
        { targetState: "All" },
        { targetState: new RegExp("^" + state + "$", "i") }
      ];
    }

    const broadcasts = await Broadcast.find(filter).sort({ createdAt: -1 });
    res.json(broadcasts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Admin: Delete or Deactivate a Broadcast
app.delete("/api/admin/broadcast/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Broadcast.findByIdAndDelete(req.params.id);
    res.json({ message: "Broadcast removed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================================
// 🏠 RELIEF SHELTER ENDPOINTS
// ==========================================

// 1. Admin: Add a new Relief Shelter
app.post("/api/admin/shelter", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, address, state, district, capacity, contactPerson, contactPhone, latitude, longitude, facilities } = req.body;
    if (!name || !address || !state || !district || !capacity) {
      return res.status(400).json({ message: "Name, address, state, district, and capacity are required." });
    }

    const shelter = new Shelter({
      name,
      address,
      state,
      district,
      capacity: Number(capacity),
      contactPerson: contactPerson || "",
      contactPhone: contactPhone || "",
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      facilities: Array.isArray(facilities) ? facilities : ["Food", "Water", "First Aid"]
    });

    await shelter.save();
    res.json({ message: "Relief Shelter registered successfully!", shelter });
  } catch (error) {
    console.error("Shelter registration error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 2. Public / Citizens & Admin: Get All Shelters (with location filter)
app.get("/api/shelters", async (req, res) => {
  try {
    const { state, district } = req.query;
    let filter = {};

    if (state && state !== "All") filter.state = new RegExp("^" + state + "$", "i");
    if (district && district !== "All") filter.district = new RegExp("^" + district + "$", "i");

    const shelters = await Shelter.find(filter).sort({ createdAt: -1 });
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Admin: Update Shelter Occupancy & Status
app.put("/api/admin/shelter/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { currentOccupancy, status, capacity } = req.body;
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) return res.status(404).json({ message: "Shelter not found." });

    if (currentOccupancy !== undefined) shelter.currentOccupancy = Number(currentOccupancy);
    if (capacity !== undefined) shelter.capacity = Number(capacity);

    // Auto calculate status if occupancy hits capacity
    if (shelter.currentOccupancy >= shelter.capacity) {
      shelter.status = "Full";
    } else if (status) {
      shelter.status = status;
    }

    await shelter.save();
    res.json({ message: "Shelter details updated successfully!", shelter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Admin: Delete a Relief Shelter
app.delete("/api/admin/shelter/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Shelter.findByIdAndDelete(req.params.id);
    res.json({ message: "Shelter removed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// ==========================================
// 🟢 "I AM SAFE" REGISTRY ENDPOINTS (P2)
// ==========================================

// 1. Citizen checks in as safe
app.post("/api/safety/mark-safe", async (req, res) => {
  try {
    const { name, mobile, state, district, statusNote } = req.body;
    if (!name || !mobile) {
      return res.status(400).json({ message: "Name and Mobile number are required." });
    }

    const checkIn = await Safety.findOneAndUpdate(
      { mobile },
      {
        name,
        mobile,
        state: state || "N/A",
        district: district || "N/A",
        statusNote: statusNote || "I am safe and uninjured.",
        markedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Status updated: You are marked as Safe! 🟢", checkIn });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Search Safety Registry (Public / Families)
app.get("/api/safety/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      const recent = await Safety.find().sort({ markedAt: -1 }).limit(20);
      return res.json(recent);
    }

    const cleanQuery = query.trim();
    const results = await Safety.find({
      $or: [
        { mobile: { $regex: cleanQuery, $options: "i" } },
        { name: { $regex: cleanQuery, $options: "i" } },
        { district: { $regex: cleanQuery, $options: "i" } }
      ]
    }).sort({ markedAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});






// ==========================================
// 🛡️ ADMIN PROFILE & PASSWORD UPDATE ENDPOINT
// ==========================================
app.put("/api/admin/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallbackSecret");

    const { name, mobile, newPassword } = req.body;
    if (!name) return res.status(400).json({ message: "Admin name is required" });

    const updateFields = { name };
    if (mobile) updateFields.mobile = mobile;

   if (newPassword && newPassword.trim().length >= 6) {
  updateFields.password = await bcrypt.hash(newPassword.trim(), 10);
}

    const updatedAdmin = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedAdmin) return res.status(404).json({ message: "Admin account not found" });

    res.json({ message: "Admin Profile updated successfully! ✅", admin: updatedAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= SAFE ZONES ROUTE (Granular Tags + Dynamic Fallback) =================
app.get("/api/safe-zones", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ message: "Latitude and longitude required" });

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  let elements = [];

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // 1. Fetch Registered Shelters from MongoDB
  try {
    if (typeof Shelter !== "undefined") {
      const dbShelters = await Shelter.find({}).lean();
      dbShelters.forEach(s => {
        if (s.latitude && s.longitude) {
          const sLat = parseFloat(s.latitude);
          const sLon = parseFloat(s.longitude);
          const dist = calculateDistance(userLat, userLng, sLat, sLon);
          if (dist <= 10) {
            elements.push({
              lat: sLat,
              lon: sLon,
              distance: dist,
              tags: { name: s.name || "Cyclone Relief Shelter", amenity: "shelter", phone: s.contactPhone || "" }
            });
          }
        }
      });
    }
  } catch (err) {}

  // 2. Query Live OpenStreetMap Overpass (with local clinics, pharmacies, and outposts)
  try {
    const overpassQuery = `
      [out:json][timeout:20];
      (
        node["amenity"~"hospital|clinic|doctors|pharmacy|police|fire_station|shelter"](around:10000,${userLat},${userLng});
        way["amenity"~"hospital|clinic|doctors|pharmacy|police|fire_station|shelter"](around:10000,${userLat},${userLng});
        node["healthcare"~"hospital|clinic|doctor|centre|pharmacy"](around:10000,${userLat},${userLng});
        way["healthcare"~"hospital|clinic|doctor|centre"](around:10000,${userLat},${userLng});
        node["emergency"~"shelter|disaster_help_point|ambulance_station"](around:10000,${userLat},${userLng});
        way["emergency"~"shelter|disaster_help_point"](around:10000,${userLat},${userLng});
      );
      out center;
    `;

    const osmRes = await axios.post("https://overpass-api.de/api/interpreter", overpassQuery, {
      headers: {
        "Content-Type": "text/plain",
        "User-Agent": "DisasterManagementSafeZones/1.0 (contact@disasterapp.org)"
      },
      timeout: 10000
    });

    if (osmRes.data && Array.isArray(osmRes.data.elements)) {
      osmRes.data.elements.forEach(item => {
        const pLat = item.lat || (item.center && item.center.lat);
        const pLon = item.lon || (item.center && item.center.lon);
        if (pLat && pLon) {
          const dist = calculateDistance(userLat, userLng, pLat, pLon);
          if (dist <= 10) {
            const tags = item.tags || {};
            const amenityType = tags.amenity || tags.healthcare || tags.emergency || "shelter";
            const name = tags.name || tags["name:en"] || tags["name:or"] || amenityType.replace(/_/g, " ").toUpperCase();
            
            elements.push({
              lat: pLat,
              lon: pLon,
              distance: dist,
              tags: { name: name, amenity: amenityType }
            });
          }
        }
      });
    }
  } catch (osmErr) {
    console.warn("OSM Overpass timeout, using dynamic Photon backup...");
  }

  // 3. Dynamic Photon Fallback (if Overpass fails)
  if (elements.length === 0) {
    const categories = [
      { q: "hospital", amenity: "hospital" },
      { q: "clinic", amenity: "clinic" },
      { q: "pharmacy", amenity: "pharmacy" },
      { q: "police", amenity: "police" },
      { q: "fire station", amenity: "fire_station" },
      { q: "shelter", amenity: "shelter" }
    ];

    const delta = 0.12;
    const bbox = `${userLng - delta},${userLat + delta},${userLng + delta},${userLat - delta}`;

    await Promise.all(
      categories.map(c =>
        axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(c.q)}&lat=${userLat}&lon=${userLng}&bbox=${bbox}&limit=20`, { timeout: 4000 })
          .then(r => {
            if (r.data && Array.isArray(r.data.features)) {
              r.data.features.forEach(f => {
                if (f.geometry?.coordinates) {
                  const pLon = f.geometry.coordinates[0];
                  const pLat = f.geometry.coordinates[1];
                  const dist = calculateDistance(userLat, userLng, pLat, pLon);
                  if (dist <= 10) {
                    const placeName = f.properties.name || f.properties.street || "";
                    if (placeName) {
                      elements.push({
                        lat: pLat,
                        lon: pLon,
                        distance: dist,
                        tags: { name: placeName, amenity: c.amenity }
                      });
                    }
                  }
                }
              });
            }
          })
          .catch(() => {})
      )
    );
  }

  // 4. De-duplicate coordinates
  const uniqueMap = new Map();
  elements.forEach(item => {
    const key = `${item.lat.toFixed(4)}_${item.lon.toFixed(4)}`;
    if (!uniqueMap.has(key)) uniqueMap.set(key, item);
  });
  elements = Array.from(uniqueMap.values());

  // 5. Sort from nearest (0.1 km) to farthest (10.0 km)
  elements.sort((a, b) => a.distance - b.distance);

  return res.json({ elements });
});
// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("⚡ Server ready on port", PORT);
});
