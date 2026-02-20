const express = require("express");
const router = express.Router();
const proceedController = require("../../Controllers/Production & Process/PreformProceedController");

// GET Preform proceeds only
router.get("/preform", proceedController.getPreformProceeds);

// GET all proceeds
router.get("/", proceedController.getAllProceeds);

// GET Proceed by ID
router.get("/:id", proceedController.getProceedById);

// POST a Preform to Proceed
router.post("/", proceedController.addPreformProceed);

// PUT update Proceed
router.put("/:id", proceedController.updateProceed);

// DELETE Proceed
router.delete("/:id", proceedController.deleteProceed);

module.exports = router;
