const mongoose = require("mongoose");
const schema = mongoose.Schema;

//insert data
const DopLotSchema = new schema({
  lot_no: { type: String, required: true },
  stone_code: { type: String, required: true },
  currentStage_id: { type: String, required: true },
  type: { type: String, required: true },
  pcs: { type: String, required: true },
  cts: { type: String, required: true },
  size: { type: String, required: true },
  shape: { type: String, required: true },
  side: { type: String, required: true },
  color_note: { type: String, required: true },
  dop_id: { type: String, required: true },
  dop_name: { type: String, required: true },
  clarity_note: { type: String, required: true }
});

module.exports = mongoose.model("Dops", DopLotSchema);
                                 //class name    //function name