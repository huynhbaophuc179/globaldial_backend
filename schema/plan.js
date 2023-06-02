const mongoose = require("mongoose");
const { Schema } = mongoose;

var planSchema = new Schema(
    {

        name: { type: String, unique: true },
        description: { type: String },
        price: { type: Number, }


    },
    { collection: "plan" }
);
const plan = mongoose.model("plan", planSchema);
module.exports = plan
