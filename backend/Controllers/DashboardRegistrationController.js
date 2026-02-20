const DashboardRegistration = require("../Models/DashboardRegistrationModel");
const Employee = require("../Models/Employee/EmployeeModel");
const jwt = require("jsonwebtoken");

// Register dashboard access for employee
exports.registerDashboardAccess = async (req, res) => {
  try {
    const { 
      registrationId, 
      designation, 
      department, 
      password 
    } = req.body;
    
    // Validate required fields
    if (!registrationId || !designation || !department || !password) {
      return res.status(400).json({ 
        message: "All fields are required: registrationId, designation, department, password" 
      });
    }
    
    // Check if employee exists in employee database
    const employee = await Employee.findOne({
      registrationId: registrationId.trim()
    });
    
    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found with this registration ID" 
      });
    }
    
    // Validate designation and department match
    if (employee.designation !== designation) {
      return res.status(400).json({ 
        message: "Designation does not match employee record" 
      });
    }
    
    if (employee.department !== department) {
      return res.status(400).json({ 
        message: "Department does not match employee record" 
      });
    }
    
    // Check if dashboard registration already exists
    const existingRegistration = await DashboardRegistration.findOne({
      registrationId: registrationId.trim()
    });
    
    if (existingRegistration) {
      return res.status(400).json({ 
        message: "Dashboard access already registered for this employee" 
      });
    }
    
    // Create dashboard registration
    const dashboardRegistration = new DashboardRegistration({
      employeeId: employee._id,
      registrationId: registrationId.trim(),
      designation: designation,
      department: department,
      password: password
    });
    
    await dashboardRegistration.save();
    
    res.status(201).json({
      message: "Dashboard access registered successfully",
      registration: {
        id: dashboardRegistration._id,
        registrationId: dashboardRegistration.registrationId,
        designation: dashboardRegistration.designation,
        department: dashboardRegistration.department,
        isActive: dashboardRegistration.isActive
      }
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering dashboard access" });
  }
};

// Login using dashboard registration data
exports.dashboardLogin = async (req, res) => {
  try {
    const { registrationId, password } = req.body;
    
    if (!registrationId || !password) {
      return res.status(400).json({ 
        message: "Registration ID and password are required" 
      });
    }
    
    // Find dashboard registration
    const dashboardReg = await DashboardRegistration.findOne({
      registrationId: registrationId.trim(),
      isActive: true
    }).populate('employeeId');
    
    if (!dashboardReg) {
      return res.status(404).json({ 
        message: "Invalid Registration ID or Password" 
      });
    }
    
    // Check password
    if (password !== dashboardReg.password) {
      return res.status(400).json({ 
        message: "Invalid Registration ID or Password" 
      });
    }
    
    // Update login info
    dashboardReg.lastLogin = new Date();
    dashboardReg.loginCount += 1;
    await dashboardReg.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: dashboardReg._id,
        employeeId: dashboardReg.employeeId._id,
        registrationId: dashboardReg.registrationId,
        department: dashboardReg.department,
        designation: dashboardReg.designation,
        role: "DASHBOARD_USER"
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );
    
    res.json({
      message: "Login successful",
      token,
      user: {
        id: dashboardReg._id,
        employeeId: dashboardReg.employeeId._id,
        name: dashboardReg.employeeId.name,
        email: dashboardReg.employeeId.email,
        registrationId: dashboardReg.registrationId,
        department: dashboardReg.department,
        designation: dashboardReg.designation,
        role: "DASHBOARD_USER"
      }
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login" });
  }
};

// Get all dashboard registrations
exports.getDashboardRegistrations = async (req, res) => {
  try {
    const registrations = await DashboardRegistration.find({})
      .populate('employeeId', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({
      message: "Dashboard registrations retrieved successfully",
      registrations
    });
    
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Error fetching dashboard registrations" });
  }
};
