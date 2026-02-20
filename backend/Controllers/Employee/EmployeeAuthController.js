const Employee = require("../../Models/Employee/EmployeeModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Validate employee data for registration
exports.validateEmployeeData = async (req, res) => {
  try {
    const { email, registrationId, department } = req.body;
    
    if (!email || !registrationId || !department) {
      return res.status(400).json({ 
        message: "Email, Registration ID, and Department are required" 
      });
    }

    // Find employee by email or registrationId
    const employee = await Employee.findOne({
      $or: [
        { email: email.trim() },
        { registrationId: registrationId.trim() }
      ]
    });

    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found. Please check your details." 
      });
    }

    // Validate department match
    if (employee.department !== department) {
      return res.status(400).json({ 
        message: "Department does not match employee record" 
      });
    }

    // Return employee data for frontend validation
    res.json({
      message: "Employee data validated successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        registrationId: employee.registrationId,
        department: employee.department,
        designation: employee.designation
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error validating employee data" });
  }
};

// Employee login using registrationId and password
exports.employeeLogin = async (req, res) => {
  try {
    const { registrationId, password } = req.body;
    
    if (!registrationId || !password) {
      return res.status(400).json({ 
        message: "Registration ID and password are required" 
      });
    }

    // Find employee by registrationId
    const employee = await Employee.findOne({ 
      registrationId: registrationId.trim() 
    });

    if (!employee) {
      return res.status(404).json({ 
        message: "Invalid Registration ID or Password" 
      });
    }

    // For now, we'll use a simple password check
    // In production, you should hash passwords and use bcrypt.compare
    // For demo purposes, we'll check against a default password
    const defaultPassword = "emp123"; // Change this to your default password
    
    if (password !== defaultPassword) {
      return res.status(400).json({ 
        message: "Invalid Registration ID or Password" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: employee._id,
        registrationId: employee.registrationId,
        department: employee.department,
        role: "EMPLOYEE"
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        registrationId: employee.registrationId,
        department: employee.department,
        designation: employee.designation,
        role: "EMPLOYEE"
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error during login" });
  }
};

// Set password for employee (for first-time setup)
exports.setEmployeePassword = async (req, res) => {
  try {
    const { registrationId, password } = req.body;
    
    if (!registrationId || !password) {
      return res.status(400).json({ 
        message: "Registration ID and password are required" 
      });
    }

    const employee = await Employee.findOne({ 
      registrationId: registrationId.trim() 
    });

    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update employee with hashed password
    employee.password = hashedPassword;
    await employee.save();

    res.json({ message: "Password set successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error setting password" });
  }
};
