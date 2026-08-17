const mongoose = require("mongoose");

const safetySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  state: { type: String, default: "N/A" },
  district: { type: String, default: "N/A" },
  statusNote: { type: String, default: "I am safe and uninjured." },
  markedAt: { type: Date, default: Date.now }
});

safetySchema.index({ mobile: 1 });
safetySchema.index({ name: "text" });

module.exports = mongoose.model("Safety", safetySchema);