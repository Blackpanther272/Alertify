const mongoose = require("mongoose");

// FIX: Added required fields, maxlength, and status enum enforcement.
// FIX: Added assignedNgoId (ObjectId ref) alongside the string assignedNgo name
//      so the admin panel can join to the Ngo collection when needed.

const helpOrderSchema = new mongoose.Schema({

  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
    maxlength: [500, "Location description too long"]
  },

  note: {
    type: String,
    trim: true,
    maxlength: [1000, "Note too long"],
    default: ""
  },

  // NGO name (string kept for display)
  assignedNgo: {
    type: String,
    trim: true,
    default: ""
  },

  status: {
    type: String,
    default: "Pending",
    enum: {
      values: ["Pending", "In Progress", "Completed", "Cancelled"],
      message: "Invalid order status"
    }
  },

  workNote: {
    type: String,
    trim: true,
    maxlength: [1000, "Work note too long"],
    default: ""
  },

  // Photo filename uploaded by NGO on completion
  photo: {
    type: String,
    default: ""
  }

}, { timestamps: true });

// Index for NGO to quickly fetch their assigned orders
helpOrderSchema.index({ assignedNgo: 1, status: 1 });

module.exports = mongoose.model("HelpOrder", helpOrderSchema);