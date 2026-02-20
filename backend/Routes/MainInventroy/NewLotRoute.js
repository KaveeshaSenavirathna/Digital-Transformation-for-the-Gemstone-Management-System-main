const express = require("express");
const router = express.Router();
const {
  createSupplyLot,
  getAllSupplyLots,
  getSupplyLotById,
  updateSupplyLot,
  deleteSupplyLot,
  proceedLot
} = require("../../Controllers/MainInventroy/NewLotController");

router.post("/", createSupplyLot);
router.get("/", getAllSupplyLots);
router.get("/:id", getSupplyLotById);
router.put("/:id", updateSupplyLot);
router.delete("/:id", deleteSupplyLot);

router.post("/:id/proceed", proceedLot);

module.exports = router;
