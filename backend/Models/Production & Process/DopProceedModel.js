const mongoose = require("mongoose");

const DopProceedSchema = new mongoose.Schema({
  step: { type: String, default: "DOP" },
  lot_no: String,
  currentStage_id: String,
  type: String,
  pcs: String,
  cts: String,
  size: String,
  shape: String,
  color_note: String,
  dop_id: String,
  dop_name: String,
  clarity_note: String,
  side: String,
}, { timestamps: true });

module.exports = mongoose.model("DopProceeds", DopProceedSchema);
