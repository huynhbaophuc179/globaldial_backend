const mongoose = require("mongoose");
const { Schema } = mongoose;

var nutritionReferenceSchema = new Schema(
  {
    name: String,
    description: { type: String, default: "" },
    targetAge: Number,
    targetBMI: Number,

    nutritionList: [
      { nutritionId: mongoose.Schema.Types.ObjectId, value: Number },
    ],
  },
  { collection: "nutritionReference" }
);
const nutritionReference = mongoose.model(
  "nutritionReference",
  nutritionReferenceSchema
);
