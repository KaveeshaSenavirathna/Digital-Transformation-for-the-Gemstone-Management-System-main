const express = require("express");
const router = express.Router();
const PreformLot = require("../../Models/Production & Process/PreformModel");
const preformLotcontroller = require("../../Controllers/Production & Process/PreformController");

//data pass
router.post("/", preformLotcontroller.InsertPreformLot);
router.get("/:id", preformLotcontroller.PreformLotgetbyId);
router.get("/", preformLotcontroller.getAllPreformLots);
router.put("/:id", preformLotcontroller.PreformLotUpdatebyId);
router.delete("/:id", preformLotcontroller.PeformLotdeletebyId);


module.exports = router;
