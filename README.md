# Intercom aircall push
> Keep your intercom users in sync with your aircall contacts

## Purpose
In our app we create intercom users when new users register to allow our customer service staff to monitor their progress and chat with them.  We also use aircall to make outbound calls to these users. Currently the aircall/intercom integration will auto push all aircall calls into intercom but there is nothing to create an aircall contact based on a new intercom user

## Installation
```bash
npm install intercom-aircall-push
```
## Setup
Configure a subscription in intercom which will be notified whenever a user is created:
1. Instructions for creating a subscription are here: https://developers.intercom.com/v2.0/reference#manage-subscriptions. Select the topics: User created and User email updated.
   - **Recommended:** create a hubSecret so that notifications are signed. Not required but recommended
2. Create an aircall apiToken: https://developer.aircall.io/#authentication

## Usage

```js
var IntercomAirCallPush = require("intercom-aircall-push");
var express = require("express");

var app = express();

app.use("/", IntercomAirCallPush({
    aircallApiId: //aircall api id,
    aircallApiToken: //aircall api token,
    intercomWebhookPath: //Path to the webhook that you have setup in intercom.  Note that this should NOT include the base url
    hubSecret: //OPTIONAL hubSecret setup in intercom
}));
```
## TODO
- Check for prescence of subscription on start up and optionally create it if not present (subscriptions aren't currently supported in the intercom node sdk but this would be an easy pull request)
- Optionall on start sync existing users/contacts.  Create new contacts where there is an intercom user without a matching contact
