require('dotenv').config();

const builder = require('botbuilder');
const express = require('express');

//==================================================== =====
// Setup
//=========================================================

// create chat bot
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const bot = new builder.UniversalBot(connector);

// setup Express
const app = express();

app.post('/api/messages', connector.listen());

app.listen(process.env.PORT || 3978, () => console.log('Server is running...'));

//=========================================================
// Bot
//=========================================================

bot.dialog('/', session => session.send('Hello World!'));