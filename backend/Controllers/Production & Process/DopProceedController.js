const DopProceed = require("../../Models/Production & Process/DopProceedModel");

// ➕ Add DOP Proceed
exports.addDopProceed = async (req, res) => {
  try {
    const { _id, ...cleanData } = req.body;
    const proceed = new DopProceed({ ...cleanData, step: "DOP" });
    await proceed.save();
    res.status(201).json({ message: "DOP moved to Proceed", proceed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to move DOP to Proceed" });
  }
};

// 📌 Get all DOP proceeds
exports.getDopProceeds = async (req, res) => {
  try {
    const proceeds = await DopProceed.find();
    res.status(200).json(proceeds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch DOP proceeds" });
  }
};

// 📌 Get one DOP by ID
exports.getDopById = async (req, res) => {
  try {
    const proceed = await DopProceed.findById(req.params.id);
    if (!proceed) return res.status(404).json({ message: "Not found" });
    res.json(proceed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch DOP proceed" });
  }
};

// ✏️ Update
exports.updateDop = async (req, res) => {
  try {
    const updated = await DopProceed.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update DOP proceed" });
  }
};

// ❌ Delete
exports.deleteDop = async (req, res) => {
  try {
    await DopProceed.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete DOP proceed" });
  }
};
