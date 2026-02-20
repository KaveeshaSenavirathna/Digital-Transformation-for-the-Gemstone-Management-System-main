const express = require("express");
const router = express.Router();
const CalibrateLot = require("../../Models/Production & Process/CalibrateModel");
const calibrateLotcontroller = require("../../Controllers/Production & Process/CalibrateController");
const Employee = require("../../Models/Employee/EmployeeModel");

router.get("/calibraters", async (req, res) => {
  try {
    const employees = await Employee.find({
      department: "prduction&process",
      designation: "Gem_calibarater",
    }).select("name registrationId -_id"); // only send name and ID
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
//data pass
router.post("/", calibrateLotcontroller.InsertCalibrateLot);
router.get("/:id", calibrateLotcontroller.CalibrateLotgetbyId);
router.get("/", calibrateLotcontroller.getAllCalibrateLots);
router.put("/:id", calibrateLotcontroller.CalibrateLotUpdatebyId);
router.delete("/:id", calibrateLotcontroller.CalibrateLotdeletebyId);



module.exports = router;
