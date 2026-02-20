const mongoose = require("mongoose");
const Employee = require("./Models/Employee/EmployeeModel");
const DashboardRegistration = require("./Models/DashboardRegistrationModel");

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:HpcEoIQabjVo9oWo@dgms.klabbph.mongodb.net/DGMS")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Connection error:", err));

async function testDashboardSystem() {
  try {
    console.log("=== TESTING DASHBOARD REGISTRATION SYSTEM ===\n");
    
    // Get some existing employees
    const employees = await Employee.find({}).limit(5);
    
    console.log("📋 Available Employees for Registration:");
    employees.forEach(emp => {
      console.log(`• ${emp.name} (${emp.registrationId}) - ${emp.designation} in ${emp.department}`);
    });
    
    // Test with a specific employee
    const testEmployee = await Employee.findOne({ registrationId: "EMP1760379807500" });
    
    if (!testEmployee) {
      console.log("❌ Test employee not found");
      return;
    }
    
    console.log(`\n🎯 Testing with: ${testEmployee.name} (${testEmployee.registrationId})`);
    console.log(`Designation: ${testEmployee.designation}`);
    console.log(`Department: ${testEmployee.department}`);
    
    // Check if dashboard registration already exists
    const existingReg = await DashboardRegistration.findOne({
      registrationId: testEmployee.registrationId
    });
    
    if (existingReg) {
      console.log("\n✅ Dashboard registration already exists:");
      console.log(`Password: ${existingReg.password}`);
      console.log(`Active: ${existingReg.isActive}`);
      console.log(`Login Count: ${existingReg.loginCount}`);
    } else {
      console.log("\n📝 Creating new dashboard registration...");
      
      // Create dashboard registration
      const dashboardReg = new DashboardRegistration({
        employeeId: testEmployee._id,
        registrationId: testEmployee.registrationId,
        designation: testEmployee.designation,
        department: testEmployee.department,
        password: "test123" // Set a password for dashboard access
      });
      
      await dashboardReg.save();
      
      console.log("✅ Dashboard registration created successfully!");
      console.log(`Password: ${dashboardReg.password}`);
    }
    
    console.log("\n=== DASHBOARD ROUTING ===");
    const designationRoutes = {
      "Director": "/empdashboard", // All access
      "HR Executive": "/empdashboard", // Employee Dashboard
      "factory_Manager": "/pandpdashboard", // Process and Inventory
      "Production_Manager": "/pandpdashboard", // Process Dashboard
      "quality_assurance_officer": "/pandpdashboard", // Process Dashboard
      "accountent": "/financedashboard", // Finance Dashboard
      "systemmanager": "/admindashboard" // System Admin Dashboard
    };
    
    const route = designationRoutes[testEmployee.designation] || "/empdashboard";
    console.log(`${testEmployee.designation} → ${route}`);
    
    console.log("\n=== LOGIN CREDENTIALS ===");
    console.log("Registration ID: EMP1760379807500");
    console.log("Password: test123");
    console.log(`Dashboard: ${route}`);
    
  } catch (error) {
    console.error("Error testing dashboard system:", error);
  } finally {
    mongoose.connection.close();
  }
}

testDashboardSystem();
