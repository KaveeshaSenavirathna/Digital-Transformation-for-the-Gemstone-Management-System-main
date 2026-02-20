const express = require("express");
const router = express.Router();
const {
  validateEmployeeData,
  employeeLogin,
  setEmployeePassword
} = require("../../Controllers/Employee/EmployeeAuthController");

// Employee authentication routes
router.post("/validate", validateEmployeeData);
router.post("/login", employeeLogin);
router.post("/set-password", setEmployeePassword);

module.exports = router;
