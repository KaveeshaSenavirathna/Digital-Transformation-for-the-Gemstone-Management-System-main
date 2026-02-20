const express = require("express");
const router = express.Router();
const calibrateController = require("../../Controllers/Production & Process/CalibrateProceedController");

// Proceed APIs
router.get("/proceed", calibrateController.getCalibrateProceeds);
router.get("/proceed/:id", calibrateController.getCalibrateById);
router.post("/proceed", calibrateController.addCalibrateProceed);
router.put("/proceed/:id", calibrateController.updateCalibrate);
router.delete("/proceed/:id", calibrateController.deleteCalibrate);

module.exports = router;
