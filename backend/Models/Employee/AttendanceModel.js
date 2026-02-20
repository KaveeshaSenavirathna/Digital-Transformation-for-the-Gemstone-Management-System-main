const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
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
  date: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent", "Leave"], required: true },
  timeIn: { type: String }, // auto saved if Present
  leaveStartTime: { type: String }, // only for Leave
  leaveEndTime: { type: String },   // only for Leave
  leaveReason: { type: String }     // only for Leave
}, { timestamps: true });

// Prevent duplicate Present/Absent per employee per day
attendanceSchema.index(
  { employeeId: 1, date: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ["Present", "Absent"] } } }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
