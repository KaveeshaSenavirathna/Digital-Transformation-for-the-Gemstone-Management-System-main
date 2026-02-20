const express = require("express");
const router = express.Router();
const AttendanceController = require("../../Controllers/Employee/AttendanceController");

// CRUD
router.post("/", AttendanceController.markAttendance);
router.put("/:id", AttendanceController.updateAttendance);
router.delete("/:id", AttendanceController.deleteAttendance);
router.get("/daily", AttendanceController.getDailyAttendance);



// Summary and downloads
router.get("/summary", AttendanceController.getAttendanceSummary);
router.get("/summary/download", AttendanceController.downloadAttendance);
router.get("/summary/download-with-totals", AttendanceController.downloadSummaryWithTotals);

// Employee attendance
router.get("/employee/details", AttendanceController.getEmployeeAttendance);
router.get("/employee/download", AttendanceController.downloadEmployeeAttendance);

// attendanceRoutes.js
router.get("/todaypresentcount", AttendanceController.getTodayPresentCount);






module.exports = router;
