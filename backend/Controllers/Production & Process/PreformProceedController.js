const Proceed = require("../../Models/Production & Process/PreformProceedModel");

// Add Preform to Proceed
exports.addPreformProceed = async (req, res) => {
  try {
    const { _id, ...cleanData } = req.body; // remove _id if exists
    const proceed = new Proceed({ ...cleanData, step: "Preform" });
    await proceed.save();

    res.status(201).json({
      message: "Moved to Proceed",
      preformProceed: proceed
    });
  } catch (err) {
    console.error("Failed to move Preform to Proceed:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// Get all Proceed data
exports.getAllProceeds = async (req, res) => {
  try {
    const proceeds = await Proceed.find();
    res.status(200).json(proceeds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch proceeds" });
  }
};

// Get only Preform proceeds
exports.getPreformProceeds = async (req, res) => {
  try {
    const preformProceeds = await Proceed.find({ step: "Preform" });
    res.status(200).json(preformProceeds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Preform proceeds" });
  }
};

// Get Proceed by ID
exports.getProceedById = async (req, res) => {
  try {
    const proceed = await Proceed.findById(req.params.id);
    if (!proceed) return res.status(404).json({ message: "Not found" });
    res.json(proceed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch proceed" });
  }
};

// Update Proceed by ID
exports.updateProceed = async (req, res) => {
  try {
    const updated = await Proceed.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update proceed" });
  }
};

// Delete Proceed by ID
exports.deleteProceed = async (req, res) => {
  try {
    await Proceed.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete proceed" });
  }
};
