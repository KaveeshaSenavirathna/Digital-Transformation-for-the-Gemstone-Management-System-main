const express = require("express");
const router = express.Router();
const cplotController = require("../../Controllers/Production & Process/CutandPolishProceedController");

router.get("/proceed", cplotController.getCPlotProceeds);
router.get("/proceed/:id", cplotController.getCPlotById);
router.post("/proceed", cplotController.addCPlotProceed);
router.put("/proceed/:id", cplotController.updateCPlot);
router.delete("/proceed/:id", cplotController.deleteCPlot);

module.exports = router;
