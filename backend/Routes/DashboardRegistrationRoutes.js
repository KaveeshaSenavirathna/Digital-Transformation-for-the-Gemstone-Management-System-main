const express = require("express");
const router = express.Router();
const {
  registerDashboardAccess,
  dashboardLogin,
  getDashboardRegistrations
} = require("../Controllers/DashboardRegistrationController");

// Dashboard registration routes
router.post("/register", registerDashboardAccess);
router.post("/login", dashboardLogin);
router.get("/registrations", getDashboardRegistrations);

module.exports = router;
