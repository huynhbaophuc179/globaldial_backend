const { initializeApp } = require('firebase-admin/app');
var admin = require("firebase-admin");

var serviceAccount = require("./serviceKey.json");

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});



module.exports = app;