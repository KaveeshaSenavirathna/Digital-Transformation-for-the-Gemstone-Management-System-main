const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
    userName: { type: String, required: true },
    department: {
      type: String,
      enum: ["human_resoure", "prduction&process", "quality_assurance", "dministration", "finance"],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    status: { type: String, enum: ["pending", "in_progress", "done"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);


