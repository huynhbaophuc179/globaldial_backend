const mongoose = require("mongoose");
const { Schema } = mongoose;

var childSubSchema = new Schema(
  {
    weight: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
//Schema for child, a child have multiple version of mass for logging purposes

var childSchema = new Schema(
  {
    name: String,
    gender: { type: String, default: "Private" },
    dob: Date,
    mass: [childSubSchema],
    imgUrl: { type: String, },
    menuId: mongoose.Schema.Types.ObjectId,
    parentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { collection: "child" }
);
const child = mongoose.model("child", childSchema);
module.exports = child;
