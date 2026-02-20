const mongoose = require("mongoose");
const schema = mongoose.Schema;

// Supply Lot Schema
const SupplyLotSchema = new schema(
  {
    // Supplier Details
    full_name: { type: String, required: true },
    last_name: { type: String, required: true },
    nic: { type: String, required: true },
    Address: { type: String, required: true },
    contact_no: { type: String, required: true },
    gmail: { type: String, required: true },

    // Stone Lot Details
    stone_code: { type: String, required: true },
    type: { type: String, required: true },
    color_note: { type: String, required: true },
    size: { type: String, required: true },
    pcs: { type: Number, required: true },   // number instead of string
    cts: { type: Number, required: true },   // number instead of string
    weight: { type: Number, required: true }, // ✅ added weight
    currentStage_id: { type: String, required: true },
    clarity_note: { type: String }, // optional

    // Supply Date
    supply_date: { type: Date, required: true }, // ✅ added date
  },
  { timestamps: true, versionKey: false } // ✅ auto add createdAt, updatedAt / hide __v
);

module.exports = mongoose.model("SupplyLots", SupplyLotSchema);
