const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationId: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
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
  photo: { type: String },          
  birthCertificate: { type: String },
  idCopy: { type: String },
  cv: { type: String },       
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
