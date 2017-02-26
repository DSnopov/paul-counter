require('dotenv').config();

const builder = require('botbuilder');
const express = require('express');
const swaggerClient = require('./swaggerClient');

//==================================================== =====
// Setup
//=========================================================

swaggerClient.initialize();

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

function printMembersInChannel(conversationAddress, members) {
  const memberList = members
    .map(m => '* ' + m.name + ' (Id: ' + m.id + ')')
    .join('\n ');

  const reply = new builder.Message()
    .address(conversationAddress)
    .text('These are the members of this conversation: \n ' + memberList);
  bot.send(reply);
}

bot.dialog('/', (session) => {
  const message = session.message;
  const conversationId = message.address.conversation.id;

  swaggerClient
    .get(connector, message.address.serviceUrl)
    .then((client) => {
      return client
        .Conversations
        .Conversations_GetConversationMembers({conversationId: conversationId});
    })
    .then(response => printMembersInChannel(message.address, response.obj))
    .catch(err => console.log(err.status));
});