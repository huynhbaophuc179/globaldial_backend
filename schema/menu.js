const mongoose = require("mongoose");
const { Schema } = mongoose;

menuSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    foodList: [{ foodId: mongoose.Schema.Types.ObjectId, value: Number }],
    isTemplate: { type: Boolean, default: false },
    targetAge: { type: Number, default: -1 },
    targetBMI: { type: Number, default: -1 },
    userId: mongoose.Schema.Types.ObjectId,
  },
  { collection: "menu" }
);
const menu = mongoose.model("menu", menuSchema);
module.exports = menu