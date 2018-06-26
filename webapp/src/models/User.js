// user information
const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: String,
    password: String,
    capitaloneId: {type: String, default: 'one'},
    number: String,
    mintuser: {type: String, default: 'username'},
    mintpw: {type: String, default: 'password'},
    mintSession: {type: String},
    mintGuid: {type: String},
    cTransactions: [{
        givenId: String,
        amount: Number,
        description: String,
        recipe: String,
        send: {type: Boolean, default: false}
    }]
    // mTransactions: [{
    // }]
});

module.exports = mongoose.model('User', User);