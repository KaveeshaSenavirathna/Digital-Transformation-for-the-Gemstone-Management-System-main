const express = require("express");
const router = express.Router();
const DopLot = require("../../Models/Production & Process/DopModel");
const Employee = require("../../Models/Employee/EmployeeModel");
const DopLotController = require("../../Controllers/Production & Process/DopController");

/// Fetch DOP employees (dropdown)
router.get("/doppers", async (req, res) => {
  try {
    const employees = await Employee.find({
      department: "prduction&process",
      designation: "dopper"
    }).select("name registrationId -_id");
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching DOP employees" });
  }
});

// Get all DOP lots
router.get("/", DopLotController.getAllDopLots);

// Get DOP lot by ID
router.get("/:id", DopLotController.DopLotgetbyId);

// Insert new DOP lot
router.post("/", DopLotController.InsertDopLot);

// Update DOP lot
router.put("/:id", DopLotController.DopLotUpdatebyId);

// Delete DOP lot
router.delete("/:id", DopLotController.DopLotdeletebyId);





module.exports = router;
