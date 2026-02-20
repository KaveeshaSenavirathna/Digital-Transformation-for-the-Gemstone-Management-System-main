const mongoose = require("mongoose");

const CPlotProceedSchema = new mongoose.Schema({
  lot_no: { type: String, required: true },
  stone_code: { type: String, required: true },
  currentStage_id: { type: String },
  type: { type: String },
  pcs: { type: String },
  cts: { type: String },
  size: { type: String },
  shape: { type: String },
  side: { type: String },
  color_note: { type: String },
  cp_id: { type: String, required: true },
  cp_name: { type: String, required: true },
  clarity_note: { type: String },
  step: { type: String, default: "CPlot" }
}, { timestamps: true });

module.exports = mongoose.model("CutandPolishProceeds", CPlotProceedSchema);
