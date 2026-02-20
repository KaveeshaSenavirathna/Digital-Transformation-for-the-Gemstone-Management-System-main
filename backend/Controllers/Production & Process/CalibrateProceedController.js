const CalibrateProceed = require("../../Models/Production & Process/CalibrateProceedModel");

// ➕ Add Calibrate Proceed
exports.addCalibrateProceed = async (req, res) => {
  try {
    const { _id, ...cleanData } = req.body; // remove _id
    const proceed = new CalibrateProceed({ ...cleanData, step: "Calibrate" });
    await proceed.save();
    return res.status(201).json({ message: "Calibrate moved to Proceed", proceed });
  } catch (err) {
    console.error("Failed to save Calibrate proceed:", err);
    return res.status(500).json({ error: "Failed to move Calibrate to Proceed" });
  }
};

// 📌 Get all Calibrate Proceeds
exports.getCalibrateProceeds = async (req, res) => {
  try {
    const proceeds = await CalibrateProceed.find();
    return res.status(200).json(proceeds || []); // always return array
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch Calibrate proceeds" });
  }
};

// 📌 Get Calibrate Proceed by ID
exports.getCalibrateById = async (req, res) => {
  try {
    const proceed = await CalibrateProceed.findById(req.params.id);
    if (!proceed) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(proceed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch Calibrate proceed" });
  }
};

// ✏️ Update Calibrate Proceed by ID
exports.updateCalibrate = async (req, res) => {
  try {
    const updated = await CalibrateProceed.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update Calibrate proceed" });
  }
};

// ❌ Delete Calibrate Proceed by ID
exports.deleteCalibrate = async (req, res) => {
  try {
    await CalibrateProceed.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete Calibrate proceed" });
  }
};
