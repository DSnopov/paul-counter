const Swagger = require('swagger-client');
const url = require('url');

let clientPromise;

function initialize() {
  clientPromise = new Swagger({
    url: 'https://raw.githubusercontent.com/Microsoft/BotBuilder/master/CSharp/Library/Microsoft.Bot.Connector.Shared/Swagger/ConnectorAPI.json',
    usePromise: true
  });
}

function getAccessToken(connector) {
  return new Promise((resolve, reject) => {
    connector.getAccessToken((err, token) => {
        if (err) {
            reject(err);
        } else {
            resolve(token);
        }
    });
  });
}

function addTokenToClient([client, token]) {
  client.clientAuthorizations.add(
    'AuthorizationBearer',
    new Swagger.ApiKeyAuthorization('Authorization', 'Bearer ' + token, 'header')
  );
  return client;
}

function setClientHost(client, serviceUrl) {
  const serviceHost = url.parse(serviceUrl).host;
  client.setHost(serviceHost);
  return client;
}

function get(connector, serviceUrl) {
  return Promise.all([clientPromise, getAccessToken(connector)])
      .then(addTokenToClient)
      .then(client => setClientHost(client, serviceUrl));
}

module.exports = {
  initialize,
  get
};