#! /usr/bin/env node

const crypto = require("crypto");
const axios = require("axios");
const argv = require("yargs")
    .usage("Usage: $0 --webhookUrl [url] --hubSecret [secret]")
    .demandOption(["webhookUrl"])
    .argv;

const body = {
    topic: "user.created",
    data: {
        item: {
            type: "user",
            email: "test@test.com",
            phone: "+33631000000",
            name: "Test user"
        }
    }
};

const headers = argv.hubSecret ? {"X-Hub-Signature": crypto.createHmac("sha1", argv.hubSecret).update(JSON.stringify(body)).digest("hex")} : {};

axios.post(argv.webhookUrl, body, {headers}).then(() => {
    console.log("Sent successfully");
    process.exit(0);
}).catch(error => {
    console.log("Request failed");
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Status code=", error.response.status);
        console.log("Headers=", error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log("request=", error.request);
    }
    console.log("Error message=", error.message);
    process.exit(1);
});
