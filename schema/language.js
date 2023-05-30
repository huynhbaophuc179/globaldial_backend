const mongoose = require("mongoose");
const { Schema } = mongoose;

var languageSchema = new Schema(
  {
    codeName: { type: String, },
    name: { type: String, },

    isPremium: { type: Boolean, default: false },
  },
  { collection: "language" }
);
const language = mongoose.model("language", languageSchema);
module.exports = language