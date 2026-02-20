const mongoose = require("mongoose");

const RawMaterialSchema = new mongoose.Schema(
  {
    material_name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit_type: { type: String, required: true },   // e.g., grams, pcs, carats
    unit_value: { type: Number, required: true },  // user input (e.g., 10 grams)
    supplier: { type: String },
    arrival_date: { type: Date, required: true },
    expire_date: { type: Date },
    price: { type: Number, required: true },
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RawMaterial", RawMaterialSchema);
