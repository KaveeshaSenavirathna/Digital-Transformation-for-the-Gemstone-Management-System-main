const express = require("express");
const router = express.Router();
const ProductionSalaryController = require("../../Controllers/Finance/ProductionSalaryController");

// Production Salary Routes
router.post("/", ProductionSalaryController.createProductionSalary);
router.get("/", ProductionSalaryController.getProductionSalaries);
router.get("/:id", ProductionSalaryController.getProductionSalaryById);
router.put("/:id", ProductionSalaryController.updateProductionSalary);
router.delete("/:id", ProductionSalaryController.deleteProductionSalary);

module.exports = router;
