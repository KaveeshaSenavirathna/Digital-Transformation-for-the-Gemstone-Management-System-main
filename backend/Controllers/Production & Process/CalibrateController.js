const CalibrateLot = require("../../Models/Production & Process/CalibrateModel");

//Insert
const InsertCalibrateLot = async (req, res, next) => {
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
    cal_id,
    cal_name,
    clarity_note,
  } = req.body;

  try {
    const calibrateLot = new CalibrateLot({
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
      cal_id,
      cal_name,
      clarity_note,
    }); //constructor
    await calibrateLot.save();
    return res.status(201).json({ calibratelot: calibrateLot });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unable to add new calibrate data" });
  }
};

// Get all suppliers data
const getAllCalibrateLots = async (req, res, next) => {
  try {
    const calibrateLot = await CalibrateLot.find(); // use StoneLot (the model)
    if (!calibrateLot || calibrateLot.length === 0) {
      return res.status(404).json({ message: "No calibrate lot found" });
    }
    return res.status(200).json({ calibrateLot });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ calibrateLot: "Server error" });
  }
};

//data get by id
const CalibrateLotgetbyId = async (req, res, next) => {
  const id = req.params.id;
  let calibrateLot;
  try {
    calibrateLot = await CalibrateLot.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!calibrateLot || calibrateLot.length === 0) {
    return res.status(404).json({ message: "calibrate lot not found" });
  }
  return res.status(200).json({ calibrateLot });
};

// PUT /calibratelot/:id
const CalibrateLotUpdatebyId = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body; // side or other fields

  try {
    const updatedLot = await CalibrateLot.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedLot) return res.status(404).json({ message: "Lot not found" });
    res.status(200).json(updatedLot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update Calibrate lot" });
  }
};


//delete data
const CalibrateLotdeletebyId = async (req, res, next) => {
  const id = req.params.id;

  let calibrateLot;

  try {
    calibrateLot = await CalibrateLot.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!calibrateLot || calibrateLot.length === 0) {
    return res.status(404).json({ message: "calibrate lot not deleted" });
  }
  return res.status(200).json({ calibrateLot });
};

exports.InsertCalibrateLot = InsertCalibrateLot;
exports.CalibrateLotgetbyId = CalibrateLotgetbyId;
exports.getAllCalibrateLots = getAllCalibrateLots;
exports.CalibrateLotUpdatebyId = CalibrateLotUpdatebyId;
exports.CalibrateLotdeletebyId = CalibrateLotdeletebyId;
