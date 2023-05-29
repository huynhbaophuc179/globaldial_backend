const mongoose = require("mongoose");
const { Schema } = mongoose;

var userSchema = new Schema(
    {
        uid: { type: String },

    },
    { collection: "user" }
);
const user = mongoose.model("user", userSchema);
module.exports = user