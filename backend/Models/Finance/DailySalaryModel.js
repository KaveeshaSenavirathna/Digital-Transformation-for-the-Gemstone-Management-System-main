const mongoose = require("mongoose");

const dailySalarySchema = new mongoose.Schema({
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Employee", 
    required: true 
  },
  employeeName: { 
    type: String, 
    required: true 
  },
  registrationId: { 
    type: String, 
    required: true 
  },
  department: {
    type: String,
    enum: ["human_resoure", "prduction&process", "quality_assurance", "dministration", "finance"],
    required: true,
  },
  designation: {
    type: String,
    enum: [
      "Director",
      "HR Executive",
      "factory_Manager",
      "Production_Manager",
      "quality_assurance_officer",
      "accountent",
      "systemmanager",
      "Office Assistant",
      "Gem Cutter (Cut & Polish)",
      "Gem_calibarater",
      "Gem_preform",
      "dopper",
      "Cleaning_Officer",
      "Trainer"
    ],
    required: true,
  },
  dailyRate: { 
    type: Number, 
    required: true,
    min: 0 
  },
  effectiveDate: { 
    type: Date, 
    default: Date.now 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Ensure only one active rate per employee
dailySalarySchema.index({ employeeId: 1, isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

module.exports = mongoose.model("DailySalary", dailySalarySchema);
