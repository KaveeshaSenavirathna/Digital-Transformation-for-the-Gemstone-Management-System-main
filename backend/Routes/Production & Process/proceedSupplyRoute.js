const express = require("express");
const router = express.Router();
const Proceed = require("../../Models/Production & Process/ProceedSupply");

// POST - save a new gemlot into proceed collection
router.post("/gemlot", async (req, res) => {
  try {
    const newLot = new Proceed(req.body);
    await newLot.save();
    res.status(201).json(newLot);
  } catch (err) {
    console.error("Error saving proceed lot:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET - fetch all proceed lots
router.get("/", async (req, res) => {
  try {
    const lots = await Proceed.find().sort({ createdAt: -1 });
    res.json(lots);
  } catch (err) {
    console.error("Error fetching proceed lots:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lot = await Proceed.findById(req.params.id);
    if (!lot) return res.status(404).json({ error: "Lot not found" });
    res.json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
