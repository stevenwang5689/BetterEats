// sets up the scheduler for the external services
const schedule = require('node-schedule');

const User = require('../models/User.js');
const capitalOneApi = require('./capital.js');

module.exports.startSchedule = () => {
    let a = schedule.scheduleJob('* * * * *', () => {
        // User.find({}, (err, users) => {
        //     console.log('user found');
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         users.forEach((user) => {
        //             if (user.capitaloneId != 'one') {
        //                 capitalOneApi.getTransactions(user.capitaloneId);                        
        //             }
        //         });
        //     }
        // })
        console.log('it has been one minute');
        
    })
}