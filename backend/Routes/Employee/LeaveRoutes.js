const express = require("express");
const router = express.Router();
const {
  syncLeaveRequests,
  getLeaveRequests,
  updateLeaveStatus,
} = require("../../Controllers/Employee/LeaveRequestController");

router.get("/sync", syncLeaveRequests);     // Sync from Google Sheet
router.get("/", getLeaveRequests);         // Get all requests
router.patch("/:id", updateLeaveStatus);   // Approve/Reject a request

module.exports = router;
