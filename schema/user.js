const mongoose = require("mongoose");
const { Schema } = mongoose;

var paymentSchema = new Schema(
    {
        paymentItem: { type: String, },
        paymentAmount: { type: Number, },
        paymentDescription: { type: String, },
        paymentBank: { type: String },
        paymentLanguage: { type: String },


    },
    { collection: "payment" }
);
const payment = mongoose.model("payment", paymentSchema);
module.exports = payment