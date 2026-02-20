const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  employeeId: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  leaveType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  adminComment: { type: String },
});

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
