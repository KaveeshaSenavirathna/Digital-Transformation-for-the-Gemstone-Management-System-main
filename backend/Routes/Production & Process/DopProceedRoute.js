const express = require("express");
const router = express.Router();
const dopController = require("../../Controllers/Production & Process/DopProceedController");

// Proceed APIs
router.get("/proceed", dopController.getDopProceeds);
router.get("/proceed/:id", dopController.getDopById);
router.post("/proceed", dopController.addDopProceed);
router.put("/proceed/:id", dopController.updateDop);
router.delete("/proceed/:id", dopController.deleteDop);

module.exports = router;
