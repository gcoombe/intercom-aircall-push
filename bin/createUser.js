#! /usr/bin/env node

//Can be used for testing but BEWARE this will create a user in your intercom user list/aircall contact list
//You can use an intercom test app but there isn't a similar thing in aircall so you'll need to clean the created contacts up
const intercom = require("intercom-client");

const argv = require("yargs")
.usage("Usage: $0 --accessToken [token]")
.demandOption(["accessToken"])
    .argv;

const client = new intercom.Client({token: argv.accessToken});


client.users.update({
    email: "test@test.com",
    phone: "555-555-5555",
    name: "Test user"
}).then(() => {
    console.log("Created user");
    process.exit(0);
}).catch(err => {
    console.error("Error creating intercom user", err);
    process.exit(1);
});
