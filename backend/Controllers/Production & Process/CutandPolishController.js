const CPLot = require("../../Models/Production & Process/CutandPolishModel");

//Insert
const InsertCPLot = async (req, res, next) => {
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
    cp_id,
    cp_name,
    clarity_note,
  } = req.body;

  try {
    const cpLot = new CPLot({
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
      cp_id,
      cp_name,
      clarity_note,
    }); //constructor
    await cpLot.save();
    return res.status(201).json({ cplot: cpLot });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unable to add new cut and polish data" });
  }
};

// Get all suppliers data
const getAllCPLots = async (req, res, next) => {
  try {
    const cpLot = await CPLot.find(); // use StoneLot (the model)
    if (!cpLot || cpLot.length === 0) {
      return res.status(404).json({ message: "No cut and polish lot found" });
    }
    return res.status(200).json({ cpLot });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ cpLot: "Server error" });
  }
};

//data get by id
const CPLotgetbyId = async (req, res, next) => {
  const id = req.params.id;
  let cpLot;
  try {
    cpLot = await CPLot.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!cpLot || cpLot.length === 0) {
    return res.status(404).json({ message: "cut and polish lot not found" });
  }
  return res.status(200).json({ cpLot });
};

//update supplier
const CPLotUpdatebyId = async (req, res, next) => {
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
    cp_id,
    cp_name,
    clarity_note,
  } = req.body;

  let cpLot;

  try {
    cpLot = await CPLot.findByIdAndUpdate(id, {
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
      cp_id: cp_id,
      cp_name: cp_name,
      clarity_note: clarity_note,
    });
    cpLot = await cpLot.save();
  } catch (err) {
    console.log(err);
  }

  if (!cpLot || cpLot.length === 0) {
    return res
      .status(404)
      .json({ message: "unable to update cut and polish lot" });
  }
  return res.status(200).json({ cpLot });
};

//delete data
const CPLotdeletebyId = async (req, res, next) => {
  const id = req.params.id;

  let cpLot;

  try {
    cpLot = await CPLot.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!cpLot || cpLot.length === 0) {
    return res.status(404).json({ message: "cut and polish lot not deleted" });
  }
  return res.status(200).json({ cpLot });
};

exports.InsertCPLot = InsertCPLot;
exports.CPLotgetbyId = CPLotgetbyId;
exports.getAllCPLots = getAllCPLots;
exports.CPLotUpdatebyId = CPLotUpdatebyId;
exports.CPLotdeletebyId = CPLotdeletebyId;
