const mongoose = require("mongoose");
const { Schema } = mongoose;

var mealPlanSchema = new Schema(
    {
        name: String,
        description: { type: String, default: "" },
        menuList: { type: [{ menuId: mongoose.Schema.Types.ObjectId, time: String }], default: [] },
        isTemplate: { type: Boolean, default: false },
        userId: mongoose.Schema.Types.ObjectId,
        targetAge: { type: Number, default: -1 },
        targetBMI: { type: Number, default: -1 },
    },
    { collection: "mealPlan" }
);
const mealPlan = mongoose.model("mealPlan", mealPlanSchema);
