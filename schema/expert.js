const mongoose = require("mongoose");
const { Schema } = mongoose;
const ROLE = require("../constants/roles");
const PLAN = require("../constants/plans");


var expertSchema = new Schema(
    {
        profession: { type: String, required: true },
        topic: { type: mongoose.Schema.Types.ObjectId, },
        company: { type: String },
        bio: { type: String, },
        skills: { type: [{ name: String, }] },
        userId: { type: String, required: true }



    },
    { collection: "expert" }
);
const expert = mongoose.model("expert", expertSchema);
module.exports = expert