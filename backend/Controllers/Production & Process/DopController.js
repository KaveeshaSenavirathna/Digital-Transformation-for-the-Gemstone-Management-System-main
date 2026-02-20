const DopLot = require("../../Models/Production & Process/DopModel");
//Insert
const InsertDopLot = async (req, res, next) => {
  const {
    lot_no,
    stone_code,
    currentStage_id,
    type,
    pcs,
    cts,
    size,
    shape,
    side,
    color_note,
    dop_id,
    dop_name,
    clarity_note,
  } = req.body;

  try {
    const dopLot = new DopLot({
      lot_no,
      stone_code,
      currentStage_id,
      type,
      pcs,
      cts,
      size,
      shape,
      side,
      color_note,
      dop_id,
      dop_name,
      clarity_note,
    }); //constructor
    await dopLot.save();
    return res.status(201).json({ doplot: dopLot });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to add new dopping data" });
  }
};

// Get all suppliers data
const getAllDopLots = async (req, res, next) => {
  try {
    const dopLot = await DopLot.find(); // use StoneLot (the model)
    if (!dopLot || dopLot.length === 0) {
      return res.status(404).json({ message: "No dop lot found" });
    }
    return res.status(200).json({ dopLot });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ dopLot: "Server error" });
  }
};

//data get by id
const DopLotgetbyId = async (req, res, next) => {
  const id = req.params.id;
  let dopLot;
  try {
    dopLot = await DopLot.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!dopLot || dopLot.length === 0) {
    return res.status(404).json({ message: "dop lot not found" });
  }
  return res.status(200).json({ dopLot });
};

//update supplier
const DopLotUpdatebyId = async (req, res, next) => {
  const id = req.params.id;
  const {
    lot_no,
    stone_code,
    currentStage_id,
    type,
    pcs,
    cts,
    size,
    shape,
    side,
    color_note,
    dop_id,
    dop_name,
    clarity_note,
  } = req.body;

  let dopLot;

  try {
    dopLot = await DopLot.findByIdAndUpdate(id, {
      lot_no: lot_no,
      stone_code: stone_code,
      currentStage_id: currentStage_id,
      type: type,
      pcs: pcs,
      cts: cts,
      size: size,
      shape: shape,
      side: side,
      color_note: color_note,
      dop_id: dop_id,
      dop_name: dop_name,
      clarity_note: clarity_note,
    });
    dopLot = await dopLot.save();
  } catch (err) {
    console.log(err);
  }

  if (!dopLot || dopLot.length === 0) {
    return res.status(404).json({ message: "unable to update calibrate lot" });
  }
  return res.status(200).json({ dopLot });
};

//delete data
const DopLotdeletebyId = async (req, res, next) => {
  const id = req.params.id;

  let dopLot;

  try {
    dopLot = await DopLot.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!dopLot || dopLot.length === 0) {
    return res.status(404).json({ message: "dop lot not deleted" });
  }
  return res.status(200).json({ dopLot });
};

exports.InsertDopLot = InsertDopLot;
exports.DopLotgetbyId = DopLotgetbyId;
exports.getAllDopLots = getAllDopLots;
exports.DopLotUpdatebyId = DopLotUpdatebyId;
exports.DopLotdeletebyId = DopLotdeletebyId;
