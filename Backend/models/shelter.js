const mongoose = require("mongoose");

const shelterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentOccupancy: { type: Number, default: 0 },
  contactPerson: { type: String, default: "" },
  contactPhone: { type: String, default: "" },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  facilities: { type: [String], default: ["Food", "Water", "Medical Aid"] },
  status: { 
    type: String, 
    enum: ["Open", "Full", "Closed"], 
    default: "Open" 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Shelter", shelterSchema);