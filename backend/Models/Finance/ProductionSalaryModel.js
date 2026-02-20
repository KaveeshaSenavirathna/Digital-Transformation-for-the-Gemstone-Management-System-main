const mongoose = require("mongoose");

const productionSalarySchema = new mongoose.Schema({
  stoneCode: { 
    type: String, 
    required: true,
    unique: true 
  },
  type: { 
    type: String, 
    required: true 
  },
  pricePerPcs: { 
    type: Number, 
    required: true,
    min: 0 
  },
  description: { 
    type: String 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model("ProductionSalary", productionSalarySchema);
