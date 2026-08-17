const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({
  numbers: [{ type: String }],
  userName: { type: String, default: "Pre-Login Citizen" },
  mobile: { type: String, default: "" },
  state: { type: String, default: "N/A" },
  district: { type: String, default: "N/A" },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  googleMapsLink: { type: String, default: "" },
  isPreLogin: { type: Boolean, default: false },
  status: { type: String, default: "Active", enum: ["Active", "Resolved"] },
  time: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("SOS", sosSchema);