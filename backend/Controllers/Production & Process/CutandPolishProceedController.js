const CPlotProceed = require("../../Models/Production & Process/CutandPolishProceed");

// ➕ Add CPlot Proceed
exports.addCPlotProceed = async (req, res) => {
  try {
    const { _id, ...data } = req.body; // remove _id if present
    const proceed = new CPlotProceed({ ...data, step: "CPlot" });
    await proceed.save();
    res.status(201).json({ message: "CPlot moved to Proceed", cplotProceed: proceed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add CPlot Proceed" });
  }
};

// 📌 Get all proceeds
exports.getCPlotProceeds = async (req, res) => {
  try {
    const proceeds = await CPlotProceed.find();
    res.status(200).json({ cplotProceed: proceeds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch CPlot proceeds" });
  }
};

// 📌 Get by ID
exports.getCPlotById = async (req, res) => {
  try {
    const proceed = await CPlotProceed.findById(req.params.id);
    if (!proceed) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ cplotProceed: proceed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch CPlot proceed" });
  }
};

// ✏️ Update
exports.updateCPlot = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body };
    delete updateData._id; // REMOVE _id to prevent MongoDB issues

    const updated = await CPlotProceed.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "CPlot Proceed not found" });

    res.json({ cplotProceed: updated });
  } catch (err) {
    console.error("Error updating CPlot Proceed:", err);
    res.status(500).json({ message: "Failed to update CPlot Proceed" });
  }
};

// ❌ Delete
exports.deleteCPlot = async (req, res) => {
  try {
    await CPlotProceed.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete CPlot proceed" });
  }
};
