const axios = require("axios");

class Client {
    constructor(apiId, apiToken) {
        if (!apiId || !apiToken) {
            throw new Error("Must provide apiId and apiToken key");
        }
        this.client = axios.create({
            auth: {
                username: apiId,
                password: apiToken
            },
            baseURL: "https://api.aircall.io/v1"
        });
    }

    postContact(props) {
        const body = {
            first_name: props.firstName,
            last_name: props.lastName,
            company_name: props.companyName,
            information: props.information
        };
        if (props.phoneNumber) {
            body["phone_numbers"] =  [{
                value: props.phoneNumber,
                label: "Personal"
            }];
        }
        if (props.email) {
            body.emails =  [{
                value: props.email,
                label: "Personal"
            }];
        }
        return this.client.post("/contacts", body);
    }
}

module.exports = Client;
