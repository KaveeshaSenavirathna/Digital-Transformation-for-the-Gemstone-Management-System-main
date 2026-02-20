const express = require("express");
const router = express.Router();
const {
  getSummary,
  createSupplyLot,
  getAllSupplyLots,
  getSupplyLotById,
  updateSupplyLot,
  deleteSupplyLot,
 
} = require("../../Controllers/MainInventroy/NewSupplyController");

router.get("/summary", getSummary);
router.post("/", createSupplyLot);
router.get("/", getAllSupplyLots);
router.get("/:id", getSupplyLotById);
router.put("/:id", updateSupplyLot);
router.delete("/:id", deleteSupplyLot);

router.get("/options", async (req, res) => {
  try {
    const types = await SupplyLots.distinct("type");
    const colors = await SupplyLots.distinct("color_note");
    const sizes = await SupplyLots.distinct("size");
    res.json({ types, colors, sizes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
