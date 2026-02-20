const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const performanceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
    userName: { type: String, required: true },
    date: { type: Date, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    pcs: { type: Number, default: 0 },
    cts: { type: Number, default: 0 },
    lotNo: { type: String, default: "" },
    color: { type: String, default: "" },
    size: { type: String, default: "" },
    preformCts: { type: Number, default: 0 },
    reject: { type: Number, default: 0 },
    rejectPcs: { type: Number, default: 0 },
    size2mm: { type: Number, default: 0 },
    size3x2: { type: Number, default: 0 },
    size3mm: { type: Number, default: 0 },
    size4x3_5x3: { type: Number, default: 0 },
    size4mm: { type: Number, default: 0 },
    size5x4_6x4: { type: Number, default: 0 },
    size5mm: { type: Number, default: 0 },
    size6x5: { type: Number, default: 0 },
    size7x5: { type: Number, default: 0 },
    size8x5: { type: Number, default: 0 },
    size1Cts: { type: Number, default: 0 },
    size1_5Cts: { type: Number, default: 0 },
    size2Cts: { type: Number, default: 0 },
    size3Cts: { type: Number, default: 0 },
    size4x2_5x2_5: { type: Number, default: 0 },
    size6x3_7x3_5: { type: Number, default: 0 },
    size8x4_9x4_5: { type: Number, default: 0 },
    princess: { type: Number, default: 0 },
    bracket: { type: Number, default: 0 },
    octagon: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Create compound index for userId, year, and month
performanceSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

// Also keep date index for queries
performanceSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("Performance", performanceSchema);



