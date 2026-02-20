const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: String,
  weight: Number,
  cts: Number,
  pcs: Number,
  color: String,
  clarity: String,
  treatment: String,
  certification: String,
  description: String,
  price: Number,
  images: [String],
  status: { type: String, enum: ['ACTIVE','INACTIVE','AUCTION'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now }
});

ProductSchema.index({ type: 1, color: 1, clarity: 1, price: 1 });
module.exports = mongoose.models.Product || mongoose.model("Products", ProductSchema);
