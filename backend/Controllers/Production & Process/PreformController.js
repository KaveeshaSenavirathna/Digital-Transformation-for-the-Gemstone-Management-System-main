const PreformLot = require("../../Models/Production & Process/PreformModel");

//Insert
const InsertPreformLot = async (req, res, next) => {
  const {
    lot_no,
    stone_code,
    currentStage_id,
    type,
    pcs,
    cts,
    size,
    shape,
    color_note,
    clarity_note,
  } = req.body;

  try {
    const preformLot = new PreformLot({
      lot_no,
      stone_code,
      currentStage_id,
      type,
      pcs,
      cts,
      size,
      shape,
      color_note,
      clarity_note,
    }); //constructor
    await preformLot.save();
    return res.status(201).json({ preformlot: preformLot });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to add new preform data" });
  }
};

// Get all suppliers data
const getAllPreformLots = async (req, res, next) => {
  try {
    const preformLot = await PreformLot.find(); // use StoneLot (the model)
    if (!preformLot || preformLot.length === 0) {
      return res.status(404).json({ message: "No preformlot found" });
    }
    return res.status(200).json({ preformLot });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ preformLot: "Server error" });
  }
};

//data get by id
const PreformLotgetbyId = async (req, res, next) => {
  const id = req.params.id;
  let preformLot;
  try {
    preformLot = await PreformLot.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!preformLot || preformLot.length === 0) {
    return res.status(404).json({ message: "preformlot not found" });
  }
  return res.status(200).json({ preformLot });
};

//update supplier
const PreformLotUpdatebyId = async (req, res, next) => {
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
    color_note,
    clarity_note,
  } = req.body;

  let preformLot;

  try {
    preformLot = await PreformLot.findByIdAndUpdate(id, {
      lot_no: lot_no,
      stone_code: stone_code,
      currentStage_id: currentStage_id,
      type: type,
      pcs: pcs,
      cts: cts,
      size: size,
      shape: shape,
      color_note: color_note,
      clarity_note: clarity_note,
    });
    preformLot = await preformLot.save();
  } catch (err) {
    console.log(err);
  }

  if (!preformLot || preformLot.length === 0) {
    return res.status(404).json({ message: "unable to update preformlot" });
  }
  return res.status(200).json({ preformLot });
};

//delete data
const PeformLotdeletebyId = async (req, res, next) => {
  const id = req.params.id;

  let preformLot;

  try {
    preformLot = await PreformLot.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!preformLot || preformLot.length === 0) {
    return res.status(404).json({ message: "preformLot not deleted" });
  }
  return res.status(200).json({ preformLot });
};


exports.InsertPreformLot = InsertPreformLot;
exports.PreformLotgetbyId = PreformLotgetbyId;
exports.getAllPreformLots = getAllPreformLots;
exports.PreformLotUpdatebyId = PreformLotUpdatebyId;
exports.PeformLotdeletebyId = PeformLotdeletebyId;
