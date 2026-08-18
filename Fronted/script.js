window.addEventListener("pageshow", function () {
  const token = localStorage.getItem("token");
  if (!token && !window.location.pathname.includes("login") && !window.location.pathname.includes("register")) {
    document.getElementById("dashboard")?.classList.add("hidden");
    document.getElementById("roleSelection")?.classList.remove("hidden");
  }
});
// 🍞 Global Toast Notification Function
function showToast(message, isSuccess = true) {
  var existing = document.getElementById("appGlobalToast");
  if (existing) existing.remove();

  var toast = document.createElement("div");
  toast.id = "appGlobalToast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: ${isSuccess ? "#16a34a" : "#dc2626"};
    color: white;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    z-index: 99999999;
    box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    text-align: center;
    transition: all 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(function() {
    if (toast) toast.remove();
  }, 3000);
}
// ===== BUG FIXES APPLIED =====
// FIX 1: All fetch() calls changed from http://localhost:5000/api/... to /api/... (relative URLs)
// FIX 2: /api/ss typo fixed to /api/sos (SOS was silently failing)
// FIX 3: Complaint ID now comes from server response (not randomly generated client-side)
// =============================
window.ADMIN_NUMBERS = window.ADMIN_NUMBERS || [
  "8260988604",
  "6743176287"
];
let role = localStorage.getItem("userRole") || "";
let contacts = getSavedContacts(); 
// Load contacts from localStorage so they survive page refresh
function getSavedContacts() {
  return JSON.parse(localStorage.getItem("emergencyContacts")) || [];
}


// Sidebar functions
function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("sidebarOverlay").classList.add("show");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarOverlay").classList.remove("show");
}

document.addEventListener("DOMContentLoaded", function () {
  const banner = document.getElementById("installBanner");
  const closeBtn = document.getElementById("closeBanner");
  const installBtn = document.getElementById("installBtn");

  // 1. Handle Close Button (✕)
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      if (banner) banner.classList.add("hidden");
      sessionStorage.setItem("bannerClosed", "true");
    });
  }

  // 2. Handle Browser PWA Install Prompt
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    // Show banner only if the user hasn't closed it in this session
    if (banner && !sessionStorage.getItem("bannerClosed")) {
      banner.classList.remove("hidden");
    }
  });

  // 3. Handle Install Button Click
  if (installBtn) {
    installBtn.addEventListener("click", async function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          if (banner) banner.classList.add("hidden");
        }
        deferredPrompt = null;
      }
    });
  }

  // 4. Hide banner automatically once installed
  window.addEventListener("appinstalled", function () {
    if (banner) banner.classList.add("hidden");
    deferredPrompt = null;
  });
const savedUser = localStorage.getItem("loggedInUser");
  const savedRole = localStorage.getItem("userRole");
  const savedName = localStorage.getItem("userName") || "";
  // Restore avatar on page reload
  if (savedName) {
    updateSidebarUser(savedName);
    var af2 = document.getElementById("avatarFullName");
    if (af2) af2.textContent = savedName;
    var ua2 = document.getElementById("userAvatar");
    if (ua2) ua2.textContent = getInitials(savedName);
    var wm2 = document.getElementById("welcomeMsg");
    if (wm2 && savedUser) wm2.textContent = "Welcome, " + savedName.split(" ")[0] + "! 👋";
  }

  // If logged in as user — show dashboard
 if (savedUser && savedRole === "user") {
    document.getElementById("roleSelection")?.classList.add("hidden");
    document.getElementById("loginPage")?.classList.add("hidden");
    document.getElementById("dashboard")?.classList.remove("hidden");
    var cbtn = document.getElementById("chatbotButton");
    if (cbtn) cbtn.classList.remove("hidden");
    displayContacts();
    loadCitizenBroadcasts(); // ⬅️ ADD THIS LINE
  }
  // Not logged in — show role selection (links to separate pages)
  // roleSelection div is already visible by default in HTML

});

// === ROLE SELECTION ===
function chooseRole(selectedRole) {
  role = selectedRole;
  localStorage.setItem("userRole", role);
  document.getElementById("roleSelection").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
  document.getElementById("loginTitle").textContent =
    selectedRole === "admin" ? "Admin Login" : "User Login";
  const secretField = document.getElementById("secretKey");
  secretField.classList.add("hidden");
  secretField.value = "";
}

// Block admin from opening register form
function showRegisterForm() {
  if (role === "admin") {
    alert("❌ Admin cannot register here.\nAdmin must login using their Admin ID only.");
    return;
  }
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("registerPage").classList.remove("hidden");
  document.getElementById("registerTitle").textContent = "User Register";

  const secretField = document.getElementById("secretKey");
  secretField.style.display = "none";
  secretField.value = "";
}

// === BACK TO LOGIN ===
function backToLogin() {
  document.getElementById("registerPage").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
}

// === SOS BUTTON ===
// === ADVANCED SOS SYSTEM ===
// Wire sidebar buttons
["sidebarComplaintBtn","sidebarComplaintBtn2"].forEach(function(id){
  document.getElementById(id)?.addEventListener("click", function(e){
    e.preventDefault(); closeSidebar();
    document.getElementById("complaintPopup")?.classList.add("active");
  });
});
document.getElementById("sidebarTrackBtn")?.addEventListener("click", function(e){
  e.preventDefault(); closeSidebar();
  document.getElementById("trackPopup")?.classList.add("active");
});
document.getElementById("sidebarDamageBtn")?.addEventListener("click", function(e){
  e.preventDefault(); closeSidebar();
  document.getElementById("damagePopup")?.classList.add("active");
});
document.getElementById("sidebarTrackRptBtn")?.addEventListener("click", function(e){
  e.preventDefault(); closeSidebar(); openTrackReport();
});

// Update sidebar name + avatar when user logs in
function getInitials(name) {
  if (!name || !name.trim()) return "U";
  var words = name.trim().split(" ").filter(function(w){ return w.length > 0; });
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length-1].charAt(0)).toUpperCase();
}

function setUserAvatar(name) {
  var circle = document.getElementById("userAvatar");
  var nameEl = document.getElementById("avatarFullName");
  if (circle) circle.textContent = getInitials(name);
  if (nameEl) nameEl.textContent = name || "User";
}

function updateSidebarUser(name) {
  var sn = document.getElementById("sidebarName");
  var sa = document.getElementById("sidebarAvatar");
  if (sn) sn.textContent = name || "User";
  if (sa) sa.textContent = getInitials(name || "U");
}

// SOS button — opens contact selector popup
document.getElementById("sosButton")?.addEventListener("click", function() {
 openSosSelector();
});

// === CONTACT FORM TOGGLE ===
document.getElementById("addContact")?.addEventListener("click", () => {
  document.getElementById("contactForm").classList.toggle("hidden");
});

// === SAVE CONTACT ===
function saveContact() {
  const name = document.getElementById("contactName").value.trim();
  const number = document.getElementById("contactNumber").value.trim();

  if (!name || !number) {
    showToast("⚠️ Please fill in both Name and Phone Number.", false);
    return;
  }

  contacts.push({ name, number });
  localStorage.setItem("emergencyContacts", JSON.stringify(contacts));

  showToast("📞 Contact Saved! Opening all contacts...", true);

  // Auto redirect to saved-contacts.html after saving
  setTimeout(() => {
    window.location.href = "saved-contacts.html";
  }, 1000);
}

function displayContacts() {
 const list = document.getElementById("contactList");
if (!list) return;
list.innerHTML = "";
  contacts.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.name} - ${c.number}`;
    list.appendChild(li);
  });
}

// === DEFAULT EMERGENCY CONTACTS ===
const defaultContacts = [
  { name: "🚑 Ambulance", number: "102" },
  { name: "🚓 Police", number: "100" },
  { name: "🔥 Fire Station", number: "101" },
];

// === VIEW CONTACTS ===
document.getElementById("viewContacts")?.addEventListener("click", () => {
  document.getElementById("allContacts").classList.toggle("hidden");
  displayAllContacts();
});

function displayAllContacts() {
const list = document.getElementById("allContactList");
if (!list) return;
list.innerHTML = "";

  defaultContacts.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${c.name}</strong> - ${c.number}`;
    list.appendChild(li);
  });

  contacts.forEach((c, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${c.name}</strong> - ${c.number}</span>
      <button onclick="deleteContact(${index})">❌</button>
    `;
    list.appendChild(li);
  });
}

function deleteContact(index) {
  if (confirm("Are you sure you want to delete this contact?")) {
    contacts.splice(index, 1);
    localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
    displayContacts();
    displayAllContacts();
    alert("🗑️ Contact deleted successfully!");
  }
}

// === OPEN MAP PAGE ===
document.getElementById("liveInfoBtn")?.addEventListener("click", function () {
  window.location.href = "map.html";
});

// === COMPLAINT SYSTEM ===
const complaintPopup = document.getElementById("complaintPopup");
const trackPopup = document.getElementById("trackPopup");
const fileBtn  = document.getElementById("fileComplaintBtn") || document.getElementById("sidebarComplaintBtn") || document.getElementById("sidebarComplaintBtn2");
const trackBtn = document.getElementById("trackStatusBtn") || document.getElementById("sidebarTrackBtn");

fileBtn?.addEventListener("click", () => {
  complaintPopup.classList.add("active");
  trackPopup.classList.remove("active");
});
trackBtn?.addEventListener("click", () => {
  trackPopup.classList.add("active");
  complaintPopup.classList.remove("active");
});

// Close popup when clicked outside
[complaintPopup, trackPopup].forEach(popup => {
  popup?.addEventListener("click", e => {
    if (e.target === popup) popup.classList.remove("active");
  });
});

// === FILE COMPLAINT ===
document.getElementById("submitComplaint")?.addEventListener("click", async () => {

  let text = document.getElementById("complaintText").value.trim();
  if (text === "") {
    alert("Please describe your complaint!");
    return;
  }

  if (!localStorage.getItem("token")) {
    alert("Please login first");
    return;
  }

  const complaint = {
    text,
    date: new Date().toLocaleString()
  };

  try {
    // FIX 1: Changed http://localhost:5000/api/complaint → /api/complaint
   const response = await fetch("https://alertify-backend-r8le.onrender.com/api/complaint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(complaint)
    });

    // FIX 3: Use complaintId from server response
    const data = await response.json();

    if (!response.ok) {
      alert("❌ Failed to submit complaint: " + (data.message || "Server error"));
      return;
    }

    const complaintId = data.complaintId;

    document.getElementById("complaintResult").innerHTML =
      `✅ Complaint submitted successfully!<br>Your ID: <b>${complaintId}</b><br><small>Save this ID to track your complaint.</small>`;

    document.getElementById("complaintText").value = "";
    // Auto-close removed — user must click ✕ to close

  } catch (e) {
    alert("❌ Server not working. Please try again.");
  }
});

// === TRACK COMPLAINT ===
document.getElementById("checkStatus")?.addEventListener("click", async () => {

  let id = document.getElementById("complaintIdInput").value.trim();
  if (id === "") {
    alert("Please enter a Complaint ID!");
    return;
  }

  let res;
  try {
    // FIX 1: Changed http://localhost:5000/api/complaint/ → /api/complaint/
   res = await fetch("https://alertify-backend-r8le.onrender.com/api/complaint/" + id);
  } catch (e) {
    alert("Server not working");
    return;
  }

  if (!res.ok) {
    document.getElementById("statusResult").textContent =
      "❌ Complaint ID not found!";
    return;
  }

  const found = await res.json();
  let statusBox = document.getElementById("statusResult");

  if (found.status === "Resolved") {
    statusBox.innerHTML =
      `✅ <b>Status:</b> ${found.status}<br>
       <b>Reason:</b> ${found.adminReply}`;
  } else if (found.status === "Rejected") {
    statusBox.innerHTML =
      `❌ <b>Status:</b> ${found.status}<br>
       <b>Reason:</b> ${found.adminReply}`;
  } else {
    statusBox.innerHTML = `🕓 <b>Status:</b> ${found.status}`;
  }

  setTimeout(() => {
    trackPopup.classList.remove("active");
  }, 2000);

});



// === USER LOGOUT ===
function logoutUser() {
  if (!confirm("Are you sure you want to logout?")) return;

  role = "";
  localStorage.removeItem("token");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  localStorage.removeItem("chatHistory");
  sessionStorage.removeItem("bannerClosed");

  // Redirect to login page (now a separate page)
  window.location.href = "user-login.html";
}

function showLogoutToast(message) {
  var existing = document.getElementById("logoutToast");
  if (existing) existing.remove();
  var toast = document.createElement("div");
  toast.id = "logoutToast";
  toast.textContent = message;
  toast.style.cssText = "position:fixed;top:24px;left:50%;transform:translateX(-50%);"
    + "background:#16a34a;color:white;padding:14px 28px;border-radius:12px;"
    + "font-size:15px;font-weight:700;z-index:9999999;"
    + "box-shadow:0 8px 24px rgba(0,0,0,0.25);text-align:center;"
    + "animation:fadeInToast 0.3s ease;";
  document.body.appendChild(toast);
  setTimeout(function(){ var el=document.getElementById("logoutToast"); if(el) el.remove(); }, 2500);
}

document.getElementById("userLogoutBtn")?.addEventListener("click", logoutUser);


// register() blocks admin role
async function register() {

  if (role === "admin") {
    alert("❌ Admin cannot register here. Use your Admin ID to login.");
    return;
  }

  if (!role) {
    alert("Please select User role first");
    return;
  }

  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const mobile = document.getElementById("regMobile").value;
  const password = document.getElementById("regPass").value;
  const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (!passwordRegex.test(password)) {
  alert("Password must be minimum 8 characters and include uppercase, lowercase, number and special character.");
  return;
}

let response;
try {
  // FIX 1: Changed http://localhost:5000/api/register → /api/register
 response = await fetch("https://alertify-backend-r8le.onrender.com/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      mobile,
      password,
      role
    })
  });
} catch (e) {
  alert("Server not working");
  return;
}
 if (!response) return;
const data = await response.json();

  if (!response.ok) {
    alert(data.message);
    return;
  }

  alert(data.message);
  backToLogin();
}



// login()
async function login() {

  const loginInput = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value;

  if (!role) {
    alert("Please select role first");
    return;
  }

  if (role === "admin" && loginInput.includes("@")) {
    alert("❌ Admin cannot login with Email. Use Admin ID (starts with ADM).");
    return;
  }

  if (role === "admin" && /^[0-9]{10}$/.test(loginInput)) {
    alert("❌ Admin cannot login with Phone number. Use Admin ID (starts with ADM).");
    return;
  }

  if (role === "admin" && !loginInput.startsWith("ADM")) {
    alert("❌ Admin must login using Admin ID only (starts with ADM).");
    return;
  }

  if (role === "user" && !loginInput.includes("@") && !/^[0-9]{10}$/.test(loginInput)) {
    alert("❌ User must login with Email or 10-digit Phone number.");
    return;
  }

let response;
try {
  // FIX 1: Changed http://localhost:5000/api/login → /api/login
response = await fetch("https://alertify-backend-r8le.onrender.com/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      identifier: loginInput,
      password,
      role
    })
  });
} catch (e) {
  alert("Server not working");
  return;
}

if (!response) return;
const data = await response.json();

  if (!response.ok) {
    alert(data.message || "Login failed. Please try again.");
    return;
  }

  if (!data.user || role !== data.user.role) {
    alert("❌ Wrong role selected. Please choose the correct role.");
    return;
  }

  localStorage.setItem("token", data.token);

  if (data.user.role === "admin") {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    localStorage.setItem("token", data.token);
    localStorage.setItem("adminName", data.user.name);
    localStorage.setItem("loggedInUser", loginInput);
    localStorage.setItem("userRole", "admin");

    window.location.href = "admin.html";

  } else {
   var uname = data.user?.name || "User";
    localStorage.setItem("loggedInUser", loginInput);
    localStorage.setItem("userName", uname);
    localStorage.setItem("userRole", "user");

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    var cb2 = document.getElementById("chatbotButton");
    if (cb2) cb2.classList.remove("hidden");

    updateSidebarUser(uname);
    var wm = document.getElementById("welcomeMsg");
   if (wm) {
  wm.textContent = "Welcome, " + uname.split(" ")[0] + "! 👋";
}
    var af = document.getElementById("avatarFullName");
    if (af) af.textContent = uname || "User";
    var ua = document.getElementById("userAvatar");
    if (ua) ua.textContent = getInitials(uname || "U");
loadCitizenBroadcasts(); // ⬅️ Call broadcast on login


    setTimeout(() => {
  const chatbotMessages = document.getElementById("chatbotMessages");
  if (chatbotMessages) {
    chatbotMessages.innerHTML = "";
    botReply("Hi 👋 Welcome to Disaster Assistant!");

    if (soundEnabled && audioUnlocked) {
      messageSound.currentTime = 0;
      messageSound.play().catch(()=>{});
    }

    showOptions();
  }
}, 500);
  }
}

function forgotPassword() {
  document.getElementById("forgotPopup").classList.add("active");
}
let fpStep = 1;

document.addEventListener("DOMContentLoaded", () => {
  const fpBtn = document.getElementById("fpBtn");

  if (!fpBtn) return;

  fpBtn.addEventListener("click", async () => {
  const mobileInput = document.getElementById("fpMobile").value;
const mobile = mobileInput.trim().replace(/\D/g, '');

console.log("DEBUG MOBILE:", mobile);
    const otp = document.getElementById("fpOtp").value;
    const newPassword = document.getElementById("fpNewPassword").value;

    if (fpStep === 1) {
     if (mobile.length !== 10) {
        alert("Enter valid 10-digit mobile number");
        return;
      }

      let res;
      try {
        // FIX 1: Changed http://localhost:5000/api/request-otp → /api/request-otp
        res = await fetch("https://alertify-backend-r8le.onrender.com/api/request-otp", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ mobile })
        });
      } catch(e) {
        alert("Server not working");
        return;
      }

      if (!res) return;

      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("OTP sent successfully");

      document.getElementById("fpOtp").classList.remove("hidden");
      fpBtn.textContent = "Verify OTP";
      fpStep = 2;
    }

    else if (fpStep === 2) {
      // FIX 1: Changed http://localhost:5000/api/verify-otp → /api/verify-otp
      const res = await fetch("https://alertify-backend-r8le.onrender.com/api/verify-otp", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ mobile, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      document.getElementById("fpNewPassword").classList.remove("hidden");
      fpBtn.textContent = "Reset Password";
      fpStep = 3;
    }

    else {
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(newPassword)) {
        alert("Password must be strong");
        return;
      }
      try {
        // FIX 1: Changed http://localhost:5000/api/reset-password → /api/reset-password
        const res = await fetch("https://alertify-backend-r8le.onrender.com/api/reset-password", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ mobile, newPassword })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message);
          return;
        }

        alert("Password reset successful!");
        document.getElementById("forgotPopup").classList.remove("active");
        fpStep = 1;

      } catch (e) {
        alert("Server not responding");
      }
    }

  });
});



function togglePassword(fieldId, icon) {
  const field = document.getElementById(fieldId);

  if (field.type === "password") {
    field.type = "text";
    icon.textContent = "🙈";
  } else {
    field.type = "password";
    icon.textContent = "👁";
  }
}


// ===== CHATBOT LOGIC =====

const chatbotButton = document.getElementById("chatbotButton");
const chatbotBox = document.getElementById("chatbotBox");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotSend = document.getElementById("chatbotSend");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotMessages = document.getElementById("chatbotMessages");


chatbotButton?.addEventListener("click", function() {
  var box = document.getElementById("chatbotBox");
  if (!box) return;
  box.classList.toggle("hidden");
  if (!box.classList.contains("hidden")) {
    hideDot();
    loadChatHistory();
    setTimeout(function(){ showOptions(); }, 200);
  }
});


chatbotSend?.addEventListener("click", sendMessage);

chatbotInput?.addEventListener("keypress", function(e){
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = chatbotInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  chatbotInput.value = "";

  setTimeout(() => {
    generateReply(message.toLowerCase());
  }, 500);
}

function addMessage(text, sender) {

  const div = document.createElement("div");
  div.className = sender === "user" ? "chatbot-user" : "chatbot-bot";

  const bubble = document.createElement("div");
  bubble.className = "chatbot-bubble " +
    (sender === "user" ? "user-bubble" : "bot-bubble");

  bubble.textContent = text;

  div.appendChild(bubble);
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;


  // SAVE HISTORY
  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  history.push({ text, sender });
  localStorage.setItem("chatHistory", JSON.stringify(history));
}
function botReply(text) {

  showTyping();

  setTimeout(() => {

    removeTyping();
    addMessage(text, "bot");

    if (soundEnabled && audioUnlocked) {
      messageSound.currentTime = 0;
      messageSound.play().catch(()=>{});
    }

    if (chatbotBox.classList.contains("hidden")) {
      showDot();
    }

  }, 800);
}

function showOptions() {

  const optionBox = document.createElement("div");
  optionBox.className = "chatbot-bot";

  optionBox.innerHTML = `
  <button onclick="generateReply('sos')">🚨 SOS Help</button>
  <button onclick="generateReply('complaint')">📋 File Complaint</button>
  <button onclick="generateReply('contacts')">📞 Contacts Help</button>
  <button onclick="generateReply('password')">🔐 Password Help</button>
  `;

  chatbotMessages.appendChild(optionBox);

  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

}

function addOption(text, type) {
  const div = document.createElement("div");
  div.className = "chatbot-bot";

  const btn = document.createElement("button");
  btn.textContent = text;
  btn.style.margin = "5px";
  btn.style.padding = "6px 10px";
  btn.style.borderRadius = "8px";
  btn.style.border = "none";
  btn.style.background = "#1565c0";
  btn.style.color = "white";
  btn.style.cursor = "pointer";

  btn.onclick = () => generateReply(type);

  div.appendChild(btn);
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

}

function generateReply(msg) {

  if (msg === "sos" || msg.includes("sos")) {
    botReply("🚨 Click SOS button.\nIf internet ON → admin gets alert.\nIf OFF → SMS app opens. You must press send manually.");
  }

  else if (msg === "complaint" || msg.includes("complaint")) {
    botReply("📋 Click 'File Complaint' in navbar.\nAfter submit, save your Complaint ID.");
  }

  else if (msg === "contacts" || msg.includes("contact")) {
    botReply("📞 Add emergency contacts.\nDefault: 100 Police, 101 Fire, 102 Ambulance.");
  }

  else if (msg === "password" || msg.includes("password")) {
    botReply("🔐 Click 'Forgot Password'.\nEnter mobile → OTP → New password.");
  }

  else {
    botReply("Sorry 😔 I didn't understand.\nPlease select an option below.");
    showOptions();
  }
}


// ===== SOUND SETUP =====
const messageSound = new Audio("message.mp3");
messageSound.preload = "auto";
let audioUnlocked = false;
document.addEventListener("click", function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  messageSound.volume = 1;
  messageSound.play().then(() => {
    messageSound.pause();
    messageSound.currentTime = 0;
  }).catch(() => {});
  document.removeEventListener("click", unlockAudio);
});

let soundEnabled = localStorage.getItem("sound") !== "off";

const soundBtn = document.getElementById("soundToggle");

if (!soundEnabled && soundBtn) {
  soundBtn.textContent = "🔇";
}

soundBtn?.addEventListener("click", () => {

  soundEnabled = !soundEnabled;

  if (soundEnabled) {
    localStorage.setItem("sound", "on");
    soundBtn.textContent = "🔊";
  } else {
    localStorage.setItem("sound", "off");
    soundBtn.textContent = "🔇";
  }

});
// ===== SHOW NOTIFICATION DOT =====
function showDot() {
  const dot = document.getElementById("chatbotDot");
  dot?.classList.remove("hidden");
}

function hideDot() {
  const dot = document.getElementById("chatbotDot");
  dot?.classList.add("hidden");
}

// ===== TYPING ANIMATION =====
function showTyping() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "chatbot-bot";
  typingDiv.id = "typingIndicator";

  typingDiv.innerHTML = `
    <div class="chatbot-bubble bot-bubble typing">
      <span></span><span></span><span></span>
    </div>
  `;

  chatbotMessages.appendChild(typingDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();
}



function loadChatHistory() {

  chatbotMessages.innerHTML = "";

  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

  history.forEach(msg => {
    const div = document.createElement("div");
    div.className = msg.sender === "user" ? "chatbot-user" : "chatbot-bot";

    const bubble = document.createElement("div");
    bubble.className = "chatbot-bubble " +
      (msg.sender === "user" ? "user-bubble" : "bot-bubble");

    bubble.textContent = msg.text;

    div.appendChild(bubble);
    chatbotMessages.appendChild(div);
  });

  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

 if (history.length === 0) {
  addMessage("Hi 👋 Welcome to Disaster Assistant!", "bot");
}
}


const clearBtn = document.getElementById("clearChat");

clearBtn?.addEventListener("click", () => {

  if (confirm("Clear chat history?")) {

    localStorage.removeItem("chatHistory");
    localStorage.removeItem("optionsVisible");

    chatbotMessages.innerHTML = "";

    botReply("Hi 👋 Welcome to Disaster Assistant!");
    showOptions();

  }

});




// ============================================================
// DAMAGE REPORT SYSTEM
// ============================================================
document.getElementById("damageReportBtn")?.addEventListener("click", () => {
  document.getElementById("damagePopup").classList.add("active");
});

function previewDmgPhoto(input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById("dmgPhotoImg").src = e.target.result;
    document.getElementById("dmgPhotoPreview").style.display = "block";
  };
  reader.readAsDataURL(input.files[0]);
}

async function submitDamageReport() {
  const name    = document.getElementById("dmgName").value.trim();
  const address = document.getElementById("dmgAddress").value.trim();
  const type    = document.getElementById("dmgType").value;
  const desc    = document.getElementById("dmgDescription").value.trim();
  const photoEl = document.getElementById("dmgPhoto");
  const result  = document.getElementById("dmgResult");

  if (!name || !address || !desc) {
    result.style.color = "red";
    result.textContent = "⚠️ Please fill in Name, Address and Description.";
    return;
  }

  // 1. Check if user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    result.style.color = "red";
    result.textContent = "⚠️ Please login first to submit a damage report.";
    return;
  }

  result.style.color = "#2563eb";
  result.textContent = "Submitting...";

  try {
    const formData = new FormData();
    formData.append("name",         name);
    formData.append("address",      address);
    formData.append("disasterType", type);
    formData.append("description",  desc);
    formData.append("mobile",       localStorage.getItem("loggedInUser") || "");
    if (photoEl.files[0]) formData.append("photo", photoEl.files[0]);

    // 2. Pass the Authorization Header containing the Token
    const res = await fetch("https://alertify-backend-r8le.onrender.com/api/damage-report", { 
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: formData 
    });
    
    const data = await res.json();

    if (res.ok) {
      result.style.color = "green";
      result.textContent = "✅ Report submitted! ID: " + data.reportId;
      document.getElementById("dmgName").value = "";
      document.getElementById("dmgAddress").value = "";
      document.getElementById("dmgDescription").value = "";
      document.getElementById("dmgPhotoPreview").style.display = "none";
    } else {
      result.style.color = "red";
      result.textContent = "❌ " + (data.message || "Failed. Try again.");
    }
  } catch(e) {
    result.style.color = "red";
    result.textContent = "❌ Network error. Check connection.";
  }
}
// ============================================================
// DAMAGE REPORT — Open/Close helpers
// ============================================================
function closeDamagePopup() {
  document.getElementById("damagePopup").classList.remove("active");
}

// ============================================================
// TRACK MY DAMAGE REPORT
// ============================================================
function openTrackReport() {
  document.getElementById("trackReportPopup").classList.add("active");
  document.getElementById("trackReportId").value = "";
  document.getElementById("trackReportResult").style.display = "none";
  document.getElementById("trackReportError").style.display  = "none";
}

function closeTrackReport() {
  document.getElementById("trackReportPopup").classList.remove("active");
}

async function checkReportStatus() {
  var id     = document.getElementById("trackReportId").value.trim();
  var result = document.getElementById("trackReportResult");
  var errEl  = document.getElementById("trackReportError");

  result.style.display = "none";
  errEl.style.display  = "none";

  if (!id) {
    errEl.textContent  = "⚠️ Please enter your Report ID.";
    errEl.style.display = "block";
    return;
  }

  try {
    var res  = await fetch("https://alertify-backend-r8le.onrender.com/api/damage-report/" + encodeURIComponent(id));
    var data = await res.json();

    if (!res.ok) {
      errEl.textContent  = "❌ " + (data.message || "Report not found. Check your ID.");
      errEl.style.display = "block";
      return;
    }

    // Status colors and display titles
    var colors = { 
      "Under Progress": "#f59e0b", 
      "Resolved": "#16a34a", 
      "Rejected": "#dc2626" 
    };

    var labels = {
      "Under Progress": "⏳ Under Progress — Admin is reviewing your report",
      "Resolved": "✅ Resolved — Action has been taken",
      "Rejected": "❌ Rejected — Report declined"
    };

    var currentStatus = data.status || "Under Progress";

    // Set Top Badge Banner
    var badge = document.getElementById("trackStatusBadge");
    badge.style.background = colors[currentStatus] || "#f59e0b";
    badge.textContent      = labels[currentStatus] || currentStatus;

    // Fill Details
    document.getElementById("trackRptId").textContent   = data.reportId;
    document.getElementById("trackRptName").textContent = data.name;
    document.getElementById("trackRptType").textContent = data.disasterType;
    document.getElementById("trackRptDate").textContent =
      new Date(data.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

    // Display Admin Note / Reason
    var noteBox = document.getElementById("trackAdminNote");
    var noteText = document.getElementById("trackNoteText");

    if (currentStatus === "Resolved") {
      noteText.textContent = data.adminNote || "The issue reported has been verified and resolved by the disaster management team.";
      noteBox.style.display = "block";
      noteBox.style.borderLeftColor = "#16a34a";
      noteBox.style.background      = "#f0fdf4";
      noteBox.querySelector("p").style.color = "#16a34a";
      noteBox.querySelector("p").textContent = "✅ Resolution Details / Reason:";
    } else if (currentStatus === "Rejected") {
      noteText.textContent = data.adminNote || "No specific reason provided.";
      noteBox.style.display = "block";
      noteBox.style.borderLeftColor = "#dc2626";
      noteBox.style.background      = "#fef2f2";
      noteBox.querySelector("p").style.color = "#dc2626";
      noteBox.querySelector("p").textContent = "❌ Rejection Reason:";
    } else {
      // Under Progress
      if (data.adminNote) {
        noteText.textContent = data.adminNote;
        noteBox.style.display = "block";
        noteBox.style.borderLeftColor = "#f59e0b";
        noteBox.style.background      = "#fffbeb";
        noteBox.querySelector("p").style.color = "#b45309";
        noteBox.querySelector("p").textContent = "ℹ️ Admin Update:";
      } else {
        noteBox.style.display = "none";
      }
    }

    result.style.display = "block";

  } catch(e) {
    errEl.textContent   = "❌ Network error. Check connection.";
    errEl.style.display = "block";
  }
}

// Allow pressing Enter in the track input
document.addEventListener("DOMContentLoaded", function() {
  var inp = document.getElementById("trackReportId");
  if (inp) {
    inp.addEventListener("keypress", function(e) {
      if (e.key === "Enter") checkReportStatus();
    });
  }
});

// ================================================================
// FEATURE 1: PRE-LOGIN & LOGGED-IN UNIFIED SOS SYSTEM
// ================================================================

var _sosLat = null;
var _sosLng = null;
var _sosLink = null;
var _isPreLoginSos = false;

function preLoginSOS() {
  openSosSelector(true);
}

// Step 1: Open popup, start GPS, and confirm
function openSosSelector(isPreLogin = false) {
  _isPreLoginSos = isPreLogin;

  var proceed = confirm("⚠️ EMERGENCY SOS\n\nThis will fetch your location and send emergency alerts.\nMisuse is punishable by law.\n\nContinue?");
  if (!proceed) return;

  var popup = document.getElementById("sosContactPopup");
  if (!popup) return;
  popup.style.display = "flex";

  _sosLat = null; _sosLng = null; _sosLink = null;
  var gpsEl = document.getElementById("sosGpsStatus");
  if (gpsEl) {
    gpsEl.style.background = "#eff6ff";
    gpsEl.style.color = "#2563eb";
    gpsEl.textContent = "📡 Fetching GPS location...";
  }

  buildSosContactList();

  getLocationSmart(function(lat, lng) {
    _sosLat = lat;
    _sosLng = lng;
    if (lat && lng) {
      _sosLink = "https://www.google.com/maps?q=" + lat + "," + lng;
      if (gpsEl) {
        gpsEl.style.background = "#f0fdf4";
        gpsEl.style.color = "#16a34a";
        gpsEl.textContent = "✅ Location Locked: " + lat.toFixed(4) + ", " + lng.toFixed(4);
      }
    } else {
      _sosLink = null;
      if (gpsEl) {
        gpsEl.style.background = "#fef2f2";
        gpsEl.style.color = "#dc2626";
        gpsEl.textContent = "⚠️ Location unavailable. Proceeding with SMS.";
      }
    }
  });
}

// Step 2: Build categorized contact list
function buildSosContactList() {
  var list = document.getElementById("sosContactList");
  if (!list) return;

  var emergency = [
    { name: "🚓 Police Control Room", number: "100" },
    { name: "🚒 Fire Brigade", number: "101" },
    { name: "🚑 Ambulance / Medical", number: "102" },
    { name: "🆘 National Emergency", number: "112" }
  ];

  var saved = getSavedContacts();
  var html = "";

  html += "<p style='font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;margin:8px 0 6px;'>🚨 Emergency Services</p>";
  emergency.forEach(function(c) {
    html += "<label style='display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #f1f5f9;cursor:pointer;'>"
      + "<input type='checkbox' class='sos-contact-cb' value='" + c.number + "' checked style='width:18px;height:18px;accent-color:#dc2626;' />"
      + "<span style='flex:1;'><strong style='font-size:13.5px;color:#1e293b;display:block;'>" + c.name + "</strong>"
      + "<span style='font-size:12px;color:#64748b;'>Direct: " + c.number + "</span></span></label>";
  });

  if (window.ADMIN_NUMBERS && window.ADMIN_NUMBERS.length > 0) {
    html += "<p style='font-size:11px;font-weight:700;color:#94a3b8;margin:12px 0 6px;'>🛡️ Admin Contacts</p>";
    window.ADMIN_NUMBERS.forEach(function(num) {
      if (!num || num.includes("xxx")) return;
      html += "<label style='display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #f1f5f9;cursor:pointer;'>"
        + "<input type='checkbox' class='sos-contact-cb' value='" + num + "' checked style='width:18px;height:18px;accent-color:#dc2626;' />"
        + "<span style='flex:1;'><strong style='font-size:13.5px;color:#1e293b;display:block;'>Admin Authority</strong>"
        + "<span style='font-size:12px;color:#64748b;'>📞 " + num + "</span></span></label>";
    });
  }

  html += "<p style='font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;margin:12px 0 6px;'>👤 Personal Saved Contacts</p>";
  if (saved.length > 0) {
    saved.forEach(function(c) {
      var cleanNum = String(c.number).replace(/\D/g, "");
      html += "<label style='display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #f1f5f9;cursor:pointer;'>"
        + "<input type='checkbox' class='sos-contact-cb' value='" + cleanNum + "' checked style='width:18px;height:18px;accent-color:#dc2626;' />"
        + "<span style='flex:1;'><strong style='font-size:13.5px;color:#1e293b;display:block;'>" + c.name + "</strong>"
        + "<span style='font-size:12px;color:#64748b;'>📞 " + c.number + "</span></span></label>";
    });
  } else {
    html += "<p style='font-size:12px;color:#94a3b8;padding:4px 0;'>No personal contacts saved yet.</p>";
  }

  list.innerHTML = html;
  list.style.display = "block";
  syncSelectAll();
  document.querySelectorAll(".sos-contact-cb").forEach(function(cb) {
    cb.addEventListener("change", syncSelectAll);
  });
}

function syncSelectAll() {
  var all = document.querySelectorAll(".sos-contact-cb");
  var checked = document.querySelectorAll(".sos-contact-cb:checked");
  var allCb = document.getElementById("sosSelectAll");
  if (!allCb) return;
  allCb.checked = checked.length === all.length && all.length > 0;
  allCb.indeterminate = checked.length > 0 && checked.length < all.length;
}

function sosToggleAll(checked) {
  document.querySelectorAll(".sos-contact-cb").forEach(function(cb) {
    cb.checked = checked;
  });
}

function closeSosPopup() {
  var popup = document.getElementById("sosContactPopup");
  if (popup) popup.style.display = "none";
}

// Step 3: Dispatch SOS to Server / Offline Queue + SMS + All-Contacts Call Modal
async function sendSosNow() {
  var selected = [];
  document.querySelectorAll(".sos-contact-cb:checked").forEach(function(cb) {
    if (cb.value && !selected.includes(cb.value)) selected.push(cb.value);
  });

  if (selected.length === 0) {
    showToast("⚠️ Please select at least one contact.", false);
    return;
  }

  var token = localStorage.getItem("token");
  var isPreLogin = _isPreLoginSos || !token;

  var userName = isPreLogin ? "Pre-Login Citizen" : (localStorage.getItem("userName") || "Citizen");
  var mobile = isPreLogin ? "N/A (Pre-Login)" : (localStorage.getItem("loggedInUser") || "");
  var state = "N/A";
  var district = "N/A";

  // Fetch full state/district details if logged in
  if (!isPreLogin && token) {
    try {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const apiUrl = isLocal ? "http://localhost:5000/api/user/profile" : "https://alertify-backend-r8le.onrender.com/api/user/profile";
      const userRes = await fetch(apiUrl, { headers: { Authorization: "Bearer " + token } });
      if (userRes.ok) {
        const u = await userRes.json();
        state = u.state || "N/A";
        district = u.district || "N/A";
      }
    } catch(e) {}
  }

  var locText = _sosLink ? "📍 Location: " + _sosLink : "⚠️ Location Unavailable";
  var msg = "🆘 EMERGENCY SOS ALERT!\n\n"
    + (isPreLogin ? "[PRE-LOGIN CITIZEN ALERT]\n" : "Sender: " + userName + " (" + mobile + ")\nRegion: " + district + ", " + state + "\n")
    + locText + "\n\n"
    + "Urgent assistance required! Please respond.\n(Disaster Management System)";

  var payload = {
    numbers: selected,
    userName: userName,
    mobile: mobile,
    state: state,
    district: district,
    latitude: _sosLat,
    longitude: _sosLng,
    googleMapsLink: _sosLink || "",
    isPreLogin: isPreLogin,
    timestamp: new Date().toISOString()
  };

  // Online / Offline Handling
  if (navigator.onLine) {
    try {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const apiUrl = isLocal ? "http://localhost:5000/api/sos" : "https://alertify-backend-r8le.onrender.com/api/sos";
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      showToast("✅ SOS Alert registered on server!");
    } catch(e) {
      queueOfflineSos(payload);
    }
  } else {
    queueOfflineSos(payload);
    showToast("📴 Offline: SOS saved in queue & will send when online.", false);
  }

  closeSosPopup();

  // Send SMS to Selected Contacts Only
  if (selected.length > 0) {
    window.location.href = "sms:" + selected.join(",") + "?body=" + encodeURIComponent(msg);
  }

  // Open Direct Call Modal for ALL Contacts (Emergency, Admin, Saved)
  setTimeout(function() {
    openAllContactsCallModal();
  }, 900);
}

// Step 4: Offline Queue & Sync
function queueOfflineSos(payload) {
  var queue = JSON.parse(localStorage.getItem("offlineSosQueue")) || [];
  queue.push(payload);
  localStorage.setItem("offlineSosQueue", JSON.stringify(queue));
}

async function processOfflineSosQueue() {
  if (!navigator.onLine) return;
  var queue = JSON.parse(localStorage.getItem("offlineSosQueue")) || [];
  if (queue.length === 0) return;

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const apiUrl = isLocal ? "http://localhost:5000/api/sos" : "https://alertify-backend-r8le.onrender.com/api/sos";

  while (queue.length > 0) {
    var item = queue[0];
    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      queue.shift();
      localStorage.setItem("offlineSosQueue", JSON.stringify(queue));
    } catch(err) {
      break;
    }
  }
}
window.addEventListener("online", processOfflineSosQueue);

// Step 5: Global Call Modal (Shows All Numbers)
function openAllContactsCallModal() {
  var existing = document.getElementById("sosCallModal");
  if (existing) existing.remove();

  var allEmergency = [
    { name: "National Emergency (112)", number: "112", color: "#dc2626" },
    { name: "Police Control Room (100)", number: "100", color: "#1d4ed8" },
    { name: "Ambulance (102 / 108)", number: "102", color: "#16a34a" },
    { name: "Fire Brigade (101)", number: "101", color: "#ea580c" }
  ];

  var saved = getSavedContacts();
  var callButtonsHtml = "";

  allEmergency.forEach(function(item) {
    callButtonsHtml += `<a href="tel:${item.number}" style="display:flex;align-items:center;justify-content:space-between;padding:11px 16px;background:${item.color};color:white;border-radius:10px;text-decoration:none;font-weight:700;font-size:13.5px;margin-bottom:8px;"><span>📞 Call ${item.name}</span><span>Dial →</span></a>`;
  });

  if (window.ADMIN_NUMBERS && window.ADMIN_NUMBERS.length > 0) {
    window.ADMIN_NUMBERS.forEach(function(num) {
      if (!num || num.includes("xxx")) return;
      callButtonsHtml += `<a href="tel:${num}" style="display:flex;align-items:center;justify-content:space-between;padding:11px 16px;background:#475569;color:white;border-radius:10px;text-decoration:none;font-weight:700;font-size:13.5px;margin-bottom:8px;"><span>🛡️ Call Admin (${num})</span><span>Dial →</span></a>`;
    });
  }

  if (saved.length > 0) {
    callButtonsHtml += "<div style='font-size:12px;font-weight:800;color:#64748b;margin:10px 0 6px;text-align:left;text-transform:uppercase;'>Personal Contacts</div>";
    saved.forEach(function(c) {
      var cleanNum = String(c.number).replace(/\D/g, "");
      callButtonsHtml += `<a href="tel:${cleanNum}" style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#f1f5f9;color:#1e293b;border:1px solid #cbd5e1;border-radius:10px;text-decoration:none;font-weight:700;font-size:13px;margin-bottom:6px;"><span>👤 ${c.name} (${c.number})</span><span style="color:#2563eb;">📞 Call</span></a>`;
    });
  }

  var modal = document.createElement("div");
  modal.id = "sosCallModal";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(15,23,42,0.8);backdrop-filter:blur(4px);z-index:99999999;display:flex;align-items:center;justify-content:center;padding:16px;";
  modal.innerHTML = `
    <div style="background:white;border-radius:20px;padding:24px;max-width:400px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.3);text-align:center;">
      <div style="font-size:36px;margin-bottom:6px;">🚨</div>
      <h3 style="color:#dc2626;margin:0 0 4px;font-size:19px;font-weight:800;">SOS Dispatched!</h3>
      <p style="color:#64748b;font-size:13px;margin:0 0 16px;">SMS prepared for selected recipients. Tap below to call directly:</p>
      ${callButtonsHtml}
      <button onclick="document.getElementById('sosCallModal').remove()" style="width:100%;margin-top:12px;padding:12px;background:#f8fafc;color:#64748b;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
}



// On page load — restore name, avatar, sidebar from localStorage
(function() {
  var savedName = localStorage.getItem("userName") || "";
  var token     = localStorage.getItem("token");
  if (savedName && token) {
    updateSidebarUser(savedName);
    var af = document.getElementById("avatarFullName");
    if (af) af.textContent = savedName;
    var wm = document.getElementById("welcomeMsg");
    if (wm) wm.textContent = "Welcome, " + (savedName.split(" ")[0] || "User") + "! 👋";
  }
})();

function toggleAvatarMenu() {
  var menu = document.getElementById("avatarMenu");
  if (!menu) return;
  menu.classList.toggle("hidden");
  document.addEventListener("click", function close(e) {
    if (!e.target.closest(".avatar-wrap")) {
      menu.classList.add("hidden");
      document.removeEventListener("click", close);
    }
  });
}
function getLocationSmart(callback) {

  // ⚡ STEP 1: INSTANT IP LOCATION
  if (navigator.onLine) {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        const lat = data.latitude;
        const lng = data.longitude;

        updateGPSStatus("📡 Fast location ready");

        callback(lat, lng, "ip");
      })
      .catch(() => {});
  }

  // 🔥 STEP 2: GPS (ACCURATE UPDATE)
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

      function(pos) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        updateGPSStatus("✅ Accurate GPS location");

        callback(lat, lng, "gps");
      },

      function() {
        updateGPSStatus("⚠️ Using network location");
      },

      {
        enableHighAccuracy: false,   // 🔥 FAST
        timeout: 5000,               // 🔥 QUICK
        maximumAge: 60000            // 🔥 CACHE
      }
    );

  }
}
function useIPLocation(callback) {

  // ❌ No internet
  if (!navigator.onLine) {
    updateGPSStatus("❌ No internet. Sending without location");
    callback(null, null, "none");
    return;
  }

  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {

      const lat = data.latitude;
      const lng = data.longitude;

      updateGPSStatus("📡 Approx location (not exact)");

      callback(lat, lng, "ip");
    })
    .catch(() => {
      updateGPSStatus("❌ Location unavailable");
      callback(null, null, "none");
    });
}
function updateGPSStatus(msg) {
  const el = document.getElementById("sosGpsStatus");
  if (el) el.textContent = msg;
}





// Hide banner after app installed
window.addEventListener("appinstalled", () => {
  const banner = document.getElementById("installBanner");
  if (banner) banner.classList.add("hidden");
});



// ============================================================
// PROFILE & ACCOUNT MANAGEMENT (TOAST / EDIT / DELETE)
// ============================================================

// Toast Notification System
function showProfileToast(message, isSuccess = true) {
  var existing = document.getElementById("profileToast");
  if (existing) existing.remove();

  var toast = document.createElement("div");
  toast.id = "profileToast";
  toast.textContent = message;
  toast.style.cssText = "position:fixed;top:24px;left:50%;transform:translateX(-50%);"
    + "background:" + (isSuccess ? "#16a34a" : "#dc2626") + ";color:white;padding:14px 28px;border-radius:12px;"
    + "font-size:14px;font-weight:700;z-index:9999999;"
    + "box-shadow:0 8px 24px rgba(0,0,0,0.25);text-align:center;"
    + "animation:fadeInToast 0.3s ease;";
  document.body.appendChild(toast);
  setTimeout(function(){ if (toast) toast.remove(); }, 2500);
}


// Open Profile Modal & Load User Data
// Open Profile Modal Immediately & Load Data
async function openProfileModal() {
  const token = localStorage.getItem("token");
  
  // 1. Close avatar dropdown menu
  const menu = document.getElementById("avatarMenu");
  if (menu) menu.classList.add("hidden");

  // 2. Open the modal immediately so it always displays
  const modal = document.getElementById("profileModal");
  if (!modal) {
    console.error("profileModal element not found in HTML");
    return;
  }
  modal.classList.add("active");
  modal.style.display = "flex";

  if (!token) {
    showToast("⚠️ Please login first", false);
    return;
  }

  // 3. Auto-detect Localhost vs Live Render server
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const apiUrl = isLocal ? "http://localhost:5000/api/user/profile" : "https://alertify-backend-r8le.onrender.com/api/user/profile";

  try {
    const res = await fetch(apiUrl, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) throw new Error("Could not fetch user profile");

    const user = await res.json();

    // Fill inputs with user data
    let first = user.firstName || "";
    let last  = user.lastName || "";
    if (!first && user.name) {
      const parts = user.name.trim().split(" ");
      first = parts[0] || "";
      last  = parts.slice(1).join(" ") || "";
    }

    document.getElementById("profFirstName").value  = first;
    document.getElementById("profMiddleName").value = user.middleName || "";
    document.getElementById("profLastName").value   = last;
    document.getElementById("profMobile").value     = user.mobile || localStorage.getItem("loggedInUser") || "";
    document.getElementById("profEmail").value      = user.email || "";
    document.getElementById("profState").value      = user.state || "";
    document.getElementById("profDistrict").value   = user.district || "";
    document.getElementById("profPassword").value   = "";

  } catch (e) {
    console.warn("Could not load from backend, using local storage fallback:", e);
    // Fallback: fill basic info from localStorage so the user can still edit
    const savedName = localStorage.getItem("userName") || "";
    if (savedName) {
      const parts = savedName.trim().split(" ");
      document.getElementById("profFirstName").value = parts[0] || "";
      document.getElementById("profLastName").value  = parts.slice(1).join(" ") || "";
    }
    document.getElementById("profMobile").value = localStorage.getItem("loggedInUser") || "";
  }
}

function closeProfileModal() {
  const modal = document.getElementById("profileModal");
  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  }
}
// Save Profile Changes
async function saveProfileChanges() {
  const token = localStorage.getItem("token");
  const firstName = document.getElementById("profFirstName").value.trim();
  const middleName = document.getElementById("profMiddleName").value.trim();
  const lastName = document.getElementById("profLastName").value.trim();
  const email = document.getElementById("profEmail").value.trim();
  const state = document.getElementById("profState").value.trim();
  const district = document.getElementById("profDistrict").value.trim();
  const password = document.getElementById("profPassword").value;

  if (!firstName || !lastName) {
    showProfileToast("⚠️ First Name and Last Name are required", false);
    return;
  }

  try {
    const res = await fetch("https://alertify-backend-r8le.onrender.com/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ firstName, middleName, lastName, email, state, district, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("userName", data.name);

      // Update greetings & avatar immediately
      const wm = document.getElementById("welcomeMsg");
      if (wm) wm.textContent = "Welcome, " + firstName + "! 👋";
      updateSidebarUser(data.name);
      setUserAvatar(data.name);

      closeProfileModal();
      showProfileToast("✅ Profile updated successfully!");
    } else {
      showProfileToast("❌ " + (data.message || "Update failed"), false);
    }
  } catch (e) {
    showProfileToast("❌ Server network error", false);
  }
}

// Delete Profile Permanently
async function deleteUserAccount() {
  const menu = document.getElementById("avatarMenu");
  if (menu) menu.classList.add("hidden");

  if (!confirm("⚠️ PERMANENT ACTION:\nAre you sure you want to delete your account? All your data will be erased from the database and you will need to register again.")) {
    return;
  }

  const token = localStorage.getItem("token");
  try {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const apiUrl = isLocal ? "http://localhost:5000/api/user/profile" : "https://alertify-backend-r8le.onrender.com/api/user/profile";

    const res = await fetch(apiUrl, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });

    if (res.ok) {
      alert("✅ Account deleted successfully.");
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "user-register.html";
    } else {
      showProfileToast("❌ Failed to delete account", false);
    }
  } catch (e) {
    showProfileToast("❌ Server network error", false);
  }
}

// ============================================================
// MORE / LESS ACTION CARDS TOGGLE
// ============================================================
function toggleMoreCards() {
  const extraGrid = document.getElementById("extraCardsGrid");
  const icon = document.getElementById("moreCardIcon");
  const label = document.getElementById("moreCardLabel");
  const btn = document.getElementById("toggleMoreCardsBtn");

  if (!extraGrid) return;

  if (extraGrid.style.display === "none" || extraGrid.style.display === "") {
    extraGrid.style.display = "grid";
    icon.textContent = "➖";
    label.textContent = "Less";
    btn.style.background = "linear-gradient(135deg, #64748b, #475569)";
  } else {
    extraGrid.style.display = "none";
    icon.textContent = "➕";
    label.textContent = "More";
    btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
  }
}




// ============================================================
// 📢 CITIZEN EMERGENCY BROADCASTS & 🏠 SHELTER FINDER
// ============================================================

async function loadCitizenBroadcasts() {
  const banner = document.getElementById("userBroadcastBanner");
  if (!banner) return;

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const baseUrl = isLocal ? "http://localhost:5000/api" : "https://alertify-backend-r8le.onrender.com/api";

  try {
    const res = await fetch(`${baseUrl}/broadcasts`);
    const broadcasts = await res.json();

    if (Array.isArray(broadcasts) && broadcasts.length > 0) {
      const topAlert = broadcasts[0];
      const isCritical = topAlert.severity === "Critical";

      banner.style.display = "block";
      banner.style.background = isCritical ? "#fef2f2" : "#fff7ed";
      banner.style.color = isCritical ? "#991b1b" : "#c2410c";
      banner.style.border = `1.5px solid ${isCritical ? "#f87171" : "#fb923c"}`;
      banner.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:18px;">${isCritical ? '🔴' : '⚠️'}</span>
          <div>
            <div style="font-size:14px; font-weight:800;">${topAlert.title} <span style="font-size:11px; background:${isCritical ? '#dc2626' : '#ea580c'}; color:white; padding:2px 8px; border-radius:10px; margin-left:4px;">${topAlert.severity}</span></div>
            <div style="font-size:13px; font-weight:500; margin-top:2px;">${topAlert.message}</div>
          </div>
        </div>
      `;
    } else {
      banner.style.display = "none";
    }
  } catch (err) {
    console.log("Broadcast load error");
  }
}

function openSheltersPopup() {
  const popup = document.getElementById("shelterPopup");
  if (popup) {
    popup.classList.add("active");
    popup.style.display = "flex";
  }
  loadCitizenShelters();
}

function closeSheltersPopup() {
  const popup = document.getElementById("shelterPopup");
  if (popup) {
    popup.classList.remove("active");
    popup.style.display = "none";
  }
}
async function loadCitizenShelters() {
  const container = document.getElementById("userShelterList");
  if (!container) return;

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const baseUrl = isLocal ? "http://localhost:5000/api" : "https://alertify-backend-r8le.onrender.com/api";

  try {
    const res = await fetch(`${baseUrl}/shelters`);
    const shelters = await res.json();

    if (!Array.isArray(shelters) || !shelters.length) {
      container.innerHTML = "<p style='color:#64748b; text-align:center; padding:16px;'>No active relief shelters listed at this moment.</p>";
      return;
    }

    container.innerHTML = shelters.map(s => {
      const currentOcc = Number(s.currentOccupancy) || 0;
      const maxCap = Number(s.capacity) || 0;
      const isFull = s.status === "Full" || (maxCap > 0 && currentOcc >= maxCap);
      const available = Math.max(0, maxCap - currentOcc);

      // Build Google Maps turn-by-turn navigation link
      const destination = encodeURIComponent(`${s.name}, ${s.address || ''}, ${s.district || ''}, ${s.state || ''}`);
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

      return `
        <div style="background:#ffffff; border:1.5px solid ${isFull ? '#fecaca' : '#bbf7d0'}; border-left:5px solid ${isFull ? '#dc2626' : '#16a34a'}; border-radius:14px; padding:16px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:6px;">
            <strong style="color:#1e293b; font-size:15px;">🏠 ${s.name}</strong>
            <span style="font-size:11px; font-weight:700; padding:3px 10px; border-radius:12px; background:${isFull ? '#fee2e2' : '#dcfce7'}; color:${isFull ? '#dc2626' : '#16a34a'};">
              ${isFull ? '🔴 FULL' : '🟢 AVAILABLE'}
            </span>
          </div>
          <div style="font-size:13px; color:#334155; margin-bottom:4px;">📍 <strong>Location:</strong> ${s.address ? s.address + ', ' : ''}${s.district}, ${s.state}</div>
          <div style="font-size:12.5px; color:#475569; margin-bottom:6px;">
            👥 <strong>Bed Availability:</strong> ${available} free / ${maxCap} total (${currentOcc} occupied)
          </div>
          ${s.contactPhone ? `<div style="font-size:12px; color:#64748b; margin-bottom:10px;">📞 <strong>Helpline:</strong> <a href="tel:${s.contactPhone}" style="color:#2563eb; text-decoration:none; font-weight:700;">${s.contactPhone}</a></div>` : '<div style="margin-bottom:10px;"></div>'}
          <a href="${directionsUrl}" target="_blank" style="display:inline-flex; align-items:center; justify-content:center; gap:6px; width:100%; padding:9px 14px; background:linear-gradient(135deg,#2563eb,#1d4ed8); color:white; border-radius:8px; text-decoration:none; font-size:13px; font-weight:700; box-sizing:border-box;">
            🗺️ Get Live Directions to Shelter (Google Maps) →
          </a>
        </div>
      `;
    }).join("");
  } catch (err) {
    container.innerHTML = "<p style='color:#dc2626; text-align:center;'>Failed to load shelters.</p>";
  }
}
