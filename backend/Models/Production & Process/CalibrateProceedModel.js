const mongoose = require("mongoose");

const CalibrateProceedSchema = new mongoose.Schema({
  step: { type: String, default: "Calibrate" },
  lot_no: String,
  stone_code: String,
  currentStage_id: String,
  type: String,
  pcs: String,
  cts: String,
  size: String,
  shape: String,
  color_note: String,
  cal_id: String,
  cal_name: String,
  clarity_note: String,
  side: String,
  AorR: String
}, { timestamps: true });

module.exports = mongoose.model("CalibrateProceed", CalibrateProceedSchema);
