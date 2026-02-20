const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    color: String,
    Shape: String,
    Size: String,
    Cut: String,
    intensity: String,
    Clarity: String,
    Treatment: String,
    Origin: String,
    description: String,
    price: { type: Number, required: true },
    image: [String], // array for multiple images
    published: { type: Boolean, default: false },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MarketProducts", ProductSchema);
