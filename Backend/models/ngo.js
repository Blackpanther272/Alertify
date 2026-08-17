const mongoose = require("mongoose");

// FIX: Added trim + maxlength to all string fields to prevent oversized inputs.
// FIX: status enum enforced at DB level.
// FIX: mobile validation for Indian numbers.

const ngoSchema = new mongoose.Schema({

  ngoId: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "NGO ID is required"]
  },

  ngoName: {
    type: String,
    trim: true,
    maxlength: [200, "NGO name too long"],
    default: ""
  },

  ngoType: {
    type: String,
    default: "General",
    trim: true
  },

  volName: {
    type: String,
    trim: true,
    default: ""
  },

  volunteers: [{ name: { type: String, trim: true } }],

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

  landmark1:   { type: String, trim: true, default: "" },
  landmark2:   { type: String, trim: true, default: "" },
  fullAddress: { type: String, trim: true, default: "" },

  mobile: {
    type: String,
    trim: true,
    match: [/^[6-9]\d{9}$/, "Mobile must be a valid 10-digit Indian number"],
    default: ""
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ""
  },

  headName: {
    type: String,
    trim: true,
    default: ""
  },

  password: {
    type: String,
    required: [true, "Password is required"]
  },

  status: {
    type: String,
    default: "Pending",
    enum: {
      values: ["Pending", "Approved", "Rejected"],
      message: "Status must be Pending, Approved or Rejected"
    }
  }

}, { timestamps: true });

// Index for fast admin filter queries
ngoSchema.index({ state: 1, district: 1 });
ngoSchema.index({ status: 1 });

module.exports = mongoose.model("Ngo", ngoSchema);