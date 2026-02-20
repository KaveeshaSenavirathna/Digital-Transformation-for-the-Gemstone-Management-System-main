const express = require("express");
const router = express.Router();
const Performance = require("../../Models/Employee/PerformanceModel");

// Create performance entry
router.post("/", async (req, res) => {
  try {
    const { userId, userName, date } = req.body;
    console.log('Received performance data:', { userId, userName, date });
    
    if (!userId || !userName || !date) {
      return res.status(400).json({ message: "userId, userName and date are required" });
    }

    // Always set date to UTC midnight for saving and duplicate check
    const dateObj = new Date(date);
    dateObj.setUTCHours(0,0,0,0);
    
    // Extract year and month from the date
    const year = dateObj.getUTCFullYear();
    const month = dateObj.getUTCMonth() + 1; // JavaScript months are 0-based
    
    const startDate = new Date(dateObj);
    const endDate = new Date(dateObj);
    endDate.setUTCHours(23,59,59,999);

    console.log('Checking for existing record:', {
      userId,
      year,
      month
    });

    const existingRecord = await Performance.findOne({
      userId: userId,
      year: year,
      month: month
    });

    if (existingRecord) {
      console.log('Found existing record:', existingRecord);
      return res.status(400).json({ 
        message: "Performance record already exists for this month",
        existingDate: existingRecord.date,
        year: existingRecord.year,
        month: existingRecord.month
      });
    }

    // Set the exact midnight time for storage and add year/month
    const performanceData = {
      ...req.body,
      date: dateObj,
      year: year,
      month: month
    };
    console.log('Saving new performance with date:', dateObj.toISOString(), 'year:', year, 'month:', month);

    const performance = new Performance(performanceData);
    await performance.save();
    console.log('Successfully saved performance:', performance);
    res.json({ performance });
  } catch (error) {
    console.error('Performance save error:', error);
    res.status(500).json({ 
      error: error.message,
      type: error.name,
      details: error.errors || error
    });
  }
});

// Get all performance for a user
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const list = await Performance.find({ userId }).sort({ date: -1, createdAt: -1 });
    res.json({ performances: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch performance" });
  }
});

// Aggregate performance by period for analytics
router.get('/summary', async (req, res) => {
  try {
    const { period, year, month, weekStart, weekEnd } = req.query;
    let match = {};
    if (period === 'monthly' && year && month) {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10) - 1;
      const start = new Date(Date.UTC(y, m, 1));
      const end = new Date(Date.UTC(y, m + 1, 1));
      match.date = { $gte: start, $lt: end };
    } else if (period === 'annual' && year) {
      const y = parseInt(year, 10);
      const start = new Date(Date.UTC(y, 0, 1));
      const end = new Date(Date.UTC(y + 1, 0, 1));
      match.date = { $gte: start, $lt: end };
    } else if (period === 'weekly' && weekStart && weekEnd) {
      match.date = { $gte: new Date(weekStart), $lt: new Date(weekEnd) };
    }
    const agg = await Performance.aggregate([
      { $match: match },
      { $group: {
        _id: "$userId",
        totalPcs: { $sum: "$pcs" },
        totalCts: { $sum: "$cts" },
        count: { $sum: 1 }
      } }
    ]);
    res.json({ summary: agg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch performance summary" });
  }
});
// Admin route to drop performances collection and recreate index
router.post('/admin/reset-performances', async (req, res) => {
  try {
    await Performance.collection.drop();
    await Performance.createCollection();
    await Performance.collection.createIndex({ userId: 1, date: 1 }, { unique: true });
    res.json({ message: 'Performances collection dropped and index recreated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get performance data for specific user and date
router.get('/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const startDate = new Date(date);
    startDate.setHours(0,0,0,0);
    const endDate = new Date(date);
    endDate.setHours(23,59,59,999);
    const performance = await Performance.findOne({
      userId: userId,
      date: { $gte: startDate, $lte: endDate }
    });
    if (performance) {
      res.json({ performance });
    } else {
      res.status(404).json({ message: 'No data found for this date' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update existing performance data
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    if (updatedData.date) {
      const dateObj = new Date(updatedData.date);
      dateObj.setHours(0,0,0,0);
      updatedData.date = dateObj;
    }
    const performance = await Performance.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    if (!performance) {
      return res.status(404).json({ message: 'Performance record not found' });
    }
    res.json({ performance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;