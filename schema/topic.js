const mongoose = require("mongoose");
const { Schema } = mongoose;

var topicSchema = new Schema(
    {
        codeName: { type: String, },
        name: { type: String, },
        isPremium: { type: Boolean, default: false },
    },
    { collection: "topic" }
);
const topic = mongoose.model("topic", topicSchema);
module.exports = topic
