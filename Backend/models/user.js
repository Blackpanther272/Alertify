const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    default: ""
  },
  middleName: {
    type: String,
    trim: true,
    default: ""
  },
  lastName: {
    type: String,
    trim: true,
    default: ""
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    default: ""
  },
  mobile: {
    type: String,
    trim: true,
    default: ""
  },
  state: {
    type: String,
    trim: true,
    default: ""
  },
  district: {
    type: String,
    trim: true,
    default: ""
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "admin"],
      message: "Role must be user or admin"
    }
  },
  adminId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  }
}, { timestamps: true });

// Index for fast login lookup
userSchema.index({ mobile: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);