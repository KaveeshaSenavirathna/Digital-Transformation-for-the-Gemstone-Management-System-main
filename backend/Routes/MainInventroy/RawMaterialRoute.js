const express = require("express");
const router = express.Router();
const RawMaterial = require("../../Models/MainInventroy/RawMaterialModel");

// Get all raw materials
router.get("/", async (req, res) => {
  try {
    const materials = await RawMaterial.find().sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new raw material
router.post("/", async (req, res) => {
  try {
    const newMaterial = new RawMaterial(req.body);
    await newMaterial.save();
    res.json(newMaterial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update raw material
router.put("/:id", async (req, res) => {
  try {
    const updated = await RawMaterial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete raw material
router.delete("/:id", async (req, res) => {
  try {
    await RawMaterial.findByIdAndDelete(req.params.id);
    res.json({ message: "Raw material deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// In rawmaterials.js route
router.get("/:id", async (req, res) => {
  try {
    const material = await RawMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }
    res.json(material);  // 👈 return object, not array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
