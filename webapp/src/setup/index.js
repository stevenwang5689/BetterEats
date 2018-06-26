const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const winston = require('winston');

module.exports.createExpressApp = (config) => {
    const app = express();

    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.set('port', config.get('port'));

    app.use((req, res, next) => {
        winston.debug(config.get('appname') + req.method, req.originalUrl);
        next();
    });

    return app;
};

module.exports.setupDBConnection = (config) => {
    console.log('attempting db connection');
    mongoose.connect('mongodb://root:1234Pizza@ds127564.mlab.com:27564/bettereats', function(err) {
        if (err) {
            console.log('connection failed');
        } else {
            console.log('connection to db worked');
        }
    });

    // connection.on('open', () => {
    //     console.log('the db is connected');
    //     console.log(connection.collections);
    //     winston.debug(config.get('appname'), 'MongoDB: ' + 'mongodb://<dbuser>:<dbpassword>@ds127564.mlab.com:27564/bettereats');
    // });

    // connection.on('error', (err) => {
    //     winston.debug(config.get('appname'), 'MongoDB: ' + err);
    // });
    
    // return connection;
}

module.exports.createRoutes = (app, db) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, '../..', 'public')));
    app.use('/api', require('../routes/api'));
};

module.exports.handleExpressErrors = (app) => {
    app.use((req, res) => {
        res.status(404);

        if (req.accepts('html')) {
            return res.send('404');
        }

        if (req.accepts('json')) {
            return res.send({error: 404});
        }

        res.type('txt').send('404');
    });

    app.use((err, req, res) => {
        winston.debug(config.get('appname'), 'Express:' + err.stack);
        res.status(500).send('Something broke!');
    });
};
