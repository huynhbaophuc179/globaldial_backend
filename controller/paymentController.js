
// base URL will need to change for production applications
const base = "https://api-m.sandbox.paypal.com";

const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env; // pull from environment variables

// base URL will need to change for production applications
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};

// call this function to create your client token
async function generateClientToken() {
    const accessToken = await generateAccessToken();
    const response = await fetch(`${baseURL.sandbox}/v1/identity/generate-token`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Accept-Language": "en_US",
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data.client_token;
}

// access token is used to authenticate all REST API requests
async function generateAccessToken() {
    const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
    const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    const data = await response.json();
    console.log(data);
    return data.access_token;
}
