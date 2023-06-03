const mongoose = require("mongoose");
const { Schema } = mongoose;
const ROLE = require("../constants/roles");
const PLAN = require("../constants/plans");
var userSchema = new Schema(
    {
        uidFirebase: { type: String, default: null, unique: true },
        username: { type: String, unique: true },
        displayName: { type: String },
        email: { type: String, unique: true },
        photoUrl: { type: String, default: null },
        phoneNumber: { type: String, default: null },
        role: { type: String, enum: [...Object.values(ROLE)], default: ROLE.USER },
        plan: { type: String, ref: "Plan", enum: [...Object.values(PLAN)], default: PLAN.DEFAULT }
    },
    { collection: "user" }
);
const user = mongoose.model("user", userSchema);
module.exports = user