const mongoose = require("mongoose");
const schema = mongoose.Schema;

const SupplyLotSchema = new schema(
  {
    lot_no: { type: String, required: true, unique: true },
    stone_code: { type: String, required: true },
    type: { type: String, required: true },
    color_note: { type: String, required: true },
    size: { type: String, required: true },
    shape: { type: String, required: true },
    pcs: { type: Number, required: true },
    cts: { type: Number, required: true },
    currentStage_id: { type: String, required: true },
    clarity_note: { type: String },
    supply_date: { type: Date, default: Date.now },

    proceeded: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("NewLots", SupplyLotSchema);
