const SupplyLots = require("../../Models/MainInventroy/NewSupplyModel");

// Create
exports.createSupplyLot = async (req, res) => {
  try {
    const newLot = new SupplyLots(req.body);
    await newLot.save();
    res.status(201).json(newLot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all
// Get all with optional search and date filter
exports.getAllSupplyLots = async (req, res) => {
  try {
    const { search, date } = req.query;
    let filter = {};

    // Search by full_name, last_name, NIC, stone_code
    if (search) {
      filter.$or = [
        { full_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { nic: { $regex: search, $options: "i" } },
        { stone_code: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by supply_date (daily records)
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.supply_date = { $gte: start, $lte: end };
    }

    // Fetch and sort newest first
    const lots = await SupplyLots.find(filter).sort({ createdAt: -1 });

    res.json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get by ID
exports.getSupplyLotById = async (req, res) => {
  try {
    const lot = await SupplyLots.findById(req.params.id);
    if (!lot) return res.status(404).json({ error: "Not Found" });
    res.json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateSupplyLot = async (req, res) => {
  try {
    const updatedLot = await SupplyLots.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLot) return res.status(404).json({ error: "Not Found" });
    res.json(updatedLot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteSupplyLot = async (req, res) => {
  try {
    const deletedLot = await SupplyLots.findByIdAndDelete(req.params.id);
    if (!deletedLot) return res.status(404).json({ error: "Not Found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
// Summary with date range
exports.getSummary = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    let match = {};

    // Date filter
    if (dateFrom || dateTo) {
      match.supply_date = {};
      if (dateFrom) {
        let from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0); 
        match.supply_date.$gte = from;
      }
      if (dateTo) {
        let to = new Date(dateTo);
        to.setHours(23, 59, 59, 999); 
        match.supply_date.$lte = to;
      }
    }

    const summary = await SupplyLots.aggregate([
      { $match: match }, // ✅ filter by date range
      {
        $group: {
          _id: "$type",
          sizes: { $addToSet: "$size" },
          colors: { $addToSet: "$color_note" },
          totalWeight: { $sum: "$weight" },
          totalPCS: { $sum: "$pcs" },
          totalCTS: { $sum: "$cts" },
        },
      },
      {
        $project: {
          type: "$_id",
          sizes: 1,
          colors: 1,
          totalWeight: 1,
          totalPCS: 1,
          totalCTS: 1,
          _id: 0,
        },
      },
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

