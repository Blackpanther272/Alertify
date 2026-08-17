const mongoose = require("mongoose");

// FIX: Added required + maxlength on text field to prevent empty/massive submissions.
// FIX: Status enum now enforced at DB level, not just in server logic.
// FIX: id field is the custom complaint ID (e.g. CMP-1234) used in all routes —
//      both GET and PUT now consistently use this field (findOneAndUpdate fix in server.js).

const complaintSchema = new mongoose.Schema({

  // Custom complaint ID like "CMP-1748291234567"
  id: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },

  text: {
    type: String,
    required: [true, "Complaint text is required"],
    trim: true,
    minlength: [10, "Complaint must be at least 10 characters"],
    maxlength: [2000, "Complaint cannot exceed 2000 characters"]
  },

  status: {
    type: String,
    default: "Under Progress",
    enum: {
      values: ["Under Progress", "Resolved", "Rejected"],
      message: "Invalid status value"
    }
  },

  adminReply: {
    type: String,
    default: "",
    trim: true,
    maxlength: [1000, "Admin reply cannot exceed 1000 characters"]
  },

  // Submission date stored as readable string (keeps backward compat)
  date: {
    type: String,
    default: ""
  }

}, { timestamps: true });

// Index for fast lookup by custom id
complaintSchema.index({ id: 1 });

module.exports = mongoose.model("Complaint", complaintSchema);