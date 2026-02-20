const mongoose = require("mongoose");

const ProceedSchema = new mongoose.Schema(
  {
    step: { type: String, required: true },          
    lot_no: { type: String, required: true },
    stone_code: { type: String, required: true },
    currentStage_id: { type: String },
    type: { type: String },
    pcs: { type: String },
    cts: { type: String },
    size: { type: String },
    shape: { type: String },
    color_note: { type: String },
    clarity_note: { type: String },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("PreformProceed", ProceedSchema);
