
// For a fully working example, please see:
// https://github.com/paypal-examples/docs-examples/tree/main/standard-integration
var express = require('express');
var router = express.Router();
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID_SAND
const APP_SECRET = process.env.PAYPAL_APP_SECRET_SAND
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};
const paypal = require("../controller/paymentController");

// allow json body


// create a new order
router.post("/api/token", async (req, res) => {
    try {
        console.log("irac");

        const token = await paypal.generateClientToken();
        console.log(token);
        res.json(token);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

router.post("/api/orders", async (req, res) => {
    const order = await paypal.createOrder();
    res.json(order);
});

router.post("/api/orders/:orderID/capture", async (req, res) => {
    const { orderID } = req.params;
    const captureData = await paypal.capturePayment(orderID);
    res.json(captureData);
});

module.exports = router