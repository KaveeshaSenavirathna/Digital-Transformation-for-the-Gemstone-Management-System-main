const express = require("express");
const router = express.Router();
const CPLot = require("../../Models/Production & Process/CutandPolishModel");
const CPLotcontroller = require("../../Controllers/Production & Process/CutandPolishController");
const Employee = require("../../Models/Employee/EmployeeModel");

// ✅ Fetch only Gem Cutter employees
router.get("/gemcutters", async (req, res) => {
  try {
    const employees = await Employee.find({
      department: "prduction&process",
      designation: "Gem Cutter (Cut & Polish)",
    }).select("name registrationId");
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Main CRUD
router.post("/", CPLotcontroller.InsertCPLot);
router.get("/:id", CPLotcontroller.CPLotgetbyId);
router.get("/", CPLotcontroller.getAllCPLots);
router.put("/:id", CPLotcontroller.CPLotUpdatebyId);
router.delete("/:id", CPLotcontroller.CPLotdeletebyId);

module.exports = router;
