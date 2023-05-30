const mongoose = require("mongoose");
const { Schema } = mongoose;

var userSchema = new Schema(
    {
        uidFirebase: { type: String, default: null, unique: true },
        username: { type: String, unique: true },
        displayName: { type: String },
        email: { type: String, unique: true },
        photoUrl: { type: String, default: null },
        phoneNumber: { type: String, default: null },
        subcriptionPlan: { type: String, default: 0, enum: [0, 1] }
    },
    { collection: "user" }
);
const user = mongoose.model("user", userSchema);
module.exports = user