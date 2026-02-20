const SupplyLots = require("../../Models/MainInventroy/NewLotModel");
const PreformProceed = require("../../Models/Production & Process/PreformModel");

// Generate auto lot number
const generateLotNo = async () => {
  const lastLot = await SupplyLots.findOne().sort({ createdAt: -1 });
  if (!lastLot) return "LOT001";

  const lastNumber = parseInt(lastLot.lot_no.replace("LOT", "")) || 0;
  const nextNumber = lastNumber + 1;
  return "LOT" + nextNumber.toString().padStart(3, "0");
};

// Create Supply Lot
exports.createSupplyLot = async (req, res) => {
  try {
    const lot_no = await generateLotNo();
    const newLot = new SupplyLots({ ...req.body, lot_no });
    await newLot.save();
    res.status(201).json(newLot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Supply Lots
exports.getAllSupplyLots = async (req, res) => {
  try {
    const lots = await SupplyLots.find().sort({ createdAt: -1 });
    res.json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Supply Lot by ID
exports.getSupplyLotById = async (req, res) => {
  try {
    const lot = await SupplyLots.findById(req.params.id);
    if (!lot) return res.status(404).json({ error: "Lot not found" });
    res.json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Supply Lot
exports.updateSupplyLot = async (req, res) => {
  try {
    const updatedLot = await SupplyLots.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLot) return res.status(404).json({ error: "Lot not found" });
    res.json(updatedLot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Supply Lot
exports.deleteSupplyLot = async (req, res) => {
  try {
    const deletedLot = await SupplyLots.findByIdAndDelete(req.params.id);
    if (!deletedLot) return res.status(404).json({ error: "Lot not found" });
    res.json({ message: "Lot deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Proceed a lot
exports.proceedLot = async (req, res) => {
  try {
    const { id } = req.params;

    // Find lot by ID
    const lot = await SupplyLots.findById(id);
    if (!lot) return res.status(404).json({ error: "Lot not found" });

    // Check if already proceeded
    if (lot.proceeded) {
      return res.status(400).json({ error: "Lot already proceeded" });
    }

    // Copy to PreformProceed collection
    const preform = new PreformProceed({
      step: "Preform", // ✅ you can change step dynamically if needed
      lot_no: lot.lot_no,
      stone_code: lot.stone_code,
      currentStage_id: lot.currentStage_id,
      type: lot.type,
      pcs: lot.pcs,
      cts: lot.cts,
      size: lot.size,
      shape: lot.shape || "", // optional
      color_note: lot.color_note,
      clarity_note: lot.clarity_note,
    });
    await preform.save();

    // Mark original lot as proceeded
    lot.proceeded = true;
    await lot.save();

    res.json({ message: "Lot proceeded successfully", preform });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};