const mongoose = require("mongoose");

const DamageSchema = new mongoose.Schema({

  reportId: {
    type: String,
    unique: true,
    trim: true
  },

  name: {
    type: String,
    required: [true, "Reporter name is required"],
    trim: true,
    maxlength: [100, "Name too long"]
  },

  mobile: {
    type: String,
    trim: true,
    // Accepts any 10-digit number or empty string
    validate: {
      validator: function(v) {
        return !v || /^\d{10}$/.test(v);
      },
      message: "Mobile must be a valid 10-digit number"
    },
    default: ""
  },

  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
    maxlength: [500, "Address too long"]
  },

  disasterType: {
    type: String,
    lowercase: true, // Automatically converts "Flood" -> "flood"
    default: "other",
    enum: {
      values: ["flood", "cyclone", "earthquake", "fire", "landslide", "drought", "other"],
      message: "Invalid disaster type"
    }
  },

  description: {
    type: String,
    trim: true,
    maxlength: [2000, "Description too long"],
    default: ""
  },

  // Filename of uploaded photo (stored in uploads/ folder)
  photo: {
    type: String,
    default: ""
  },

  status: {
  type: String,
  enum: {
    values: ["Under Progress", "Resolved", "Rejected"],
    message: "Invalid report status"
  },
  default: "Under Progress"
},

  adminNote: {
    type: String,
    trim: true,
    maxlength: [1000, "Admin note too long"],
    default: ""
  }

}, { timestamps: true });

// Index for admin to fetch by status and date
DamageSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("DamageReport", DamageSchema);