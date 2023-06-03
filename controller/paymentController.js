// const fetch = require("node-fetch");
require("dotenv").config();

// Replace Client ID and App secret
const APP_CLIENT_ID = process.env.PAYPAL_CLIENT_ID_SAND
const APP_CLIENT_SECRET = process.env.PAYPAL_APP_SECRET_SAND
console.log("iran");
console.log(APP_CLIENT_ID);
const base = "https://api-m.sandbox.paypal.com";

async function createOrder() {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: "100.00",
                    },
                },
            ],
        }),
    });
    const data = await response.json();
    return data;
}

async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
}

async function generateAccessToken() {
    const auth = Buffer.from(APP_CLIENT_ID + ":" + APP_CLIENT_SECRET).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "post",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    const { access_token } = await response.json();
    return access_token;
}

async function generateClientToken() {
    const accessToken = await generateAccessToken();
    const response = await fetch(`${base}/v1/identity/generate-token`, {
        method: "post",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Accept-Language": "en_US",
            "Content-Type": "application/json",
        },
    });
    // console.log('response', response.status);
    console.log(response);
    const jsonData = await handleResponse(response);
    return jsonData.client_token;
}

module.exports = {
    createOrder,
    capturePayment,
    generateAccessToken,
    generateClientToken,
};
