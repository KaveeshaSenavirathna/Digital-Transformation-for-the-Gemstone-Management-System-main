const express = require("express");
const router = express.Router();
const DailySalaryController = require("../../Controllers/Finance/DailySalaryController");

// Daily Salary Routes
router.post("/", DailySalaryController.createDailySalary);
router.get("/", DailySalaryController.getDailySalaries);
router.get("/:id", DailySalaryController.getDailySalaryById);
router.get("/employee/:employeeId", DailySalaryController.getActiveDailySalary);
router.put("/:id", DailySalaryController.updateDailySalary);
router.delete("/:id", DailySalaryController.deleteDailySalary);

module.exports = router;
