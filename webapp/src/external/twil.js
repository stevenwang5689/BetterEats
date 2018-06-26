// Twilio Credentials
const accountSid = 'AC34b59a78bd9613d32af7167691a04471';
const authToken = 'e487661c6cbde10ebe47130ac4e86b10';

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

module.exports.sendText = (number, message) => {
    console.log('sending...');
    client.messages
    .create({
      to: number,
      from: '+14422540111',
      body: message,
    })
    .then((message) => console.log(message.sid));
}
