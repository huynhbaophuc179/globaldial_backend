const mongoose = require("mongoose");
const { Schema } = mongoose;

var userPlanSchema = new Schema(
  {
    name: String,
    description: { type: String, default: "" },
    childrenList: [{ childId: mongoose.Schema.Types.ObjectId }],

    startDate: Date,
    endDate: Date,
    notificationDay: [Number],
    mealPlan: { type: mongoose.Schema.Types.ObjectId, }
  },
  { collection: "userPlan" }
);
const userPlan = mongoose.model("userPlan", userPlanSchema);
