const mongoose = require("mongoose");

const dashboardRegistrationSchema = new mongoose.Schema({
  // Employee validation fields
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Employee", 
    required: true 
  },
  registrationId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  designation: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  
  // Dashboard registration specific fields
  password: { 
    type: String, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date 
  },
  loginCount: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

// Index for faster lookups
dashboardRegistrationSchema.index({ registrationId: 1 });
dashboardRegistrationSchema.index({ isActive: 1 });

const DashboardRegistration = mongoose.model("DashboardRegistration", dashboardRegistrationSchema);
module.exports = DashboardRegistration;
