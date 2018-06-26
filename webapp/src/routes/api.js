const express = require('express');
const mongoose = require('mongoose');
const capitalOneApi = require('../external/capital.js');

let User = require('../models/User.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({api: 'It works!'}) ;
});

router.post('/register/', (req, res) => {

    User.findOne({username: req.body.username}, (err, usr) => {
        if (usr) {
            console.log('user already exists');
            res.json({err: "user already exists"});
        } else {
            let user = new User;
            user.username = req.body.username;
            user.password = req.body.password;
    
            user.save((err) => {
                console.log('tried to save');
                if (err) {
                    console.log(err);
                }
    
                console.log(user);
                res.json({msg: "success"});
            });
        }
    })
        
})

router.post('/login', (req, res) => {
    console.log('attempting login');
    User.findOne({username: req.body.username}, function(err, doc) {
        console.log(doc);
        if (doc && (doc.password == req.body.password)) {
            console.log('user logged in');
            res.json({msg: "success"});
        } else {
            res.json({err: "wrong username or password"});
        }
    })
})

//lists the user's account information including their ID, phone number, and mint account information
router.get('/profile/:id', (req, res) => {
    console.log('attempting to find user');
    User.findOne({_id: req.params.id}, function(err, doc) {
        console.log('attempting to find user');
        console.log(doc);
    });
});

// update any of the user's information 
router.post('/profile/:id', (req, res) => {
    User.findOne({_id: req.params.id}, function(err, doc) {
        console.log(doc);
        
        res.json({msg: 'success'});
    })
})

router.get('/profile/:id/transactions', (req, res) => {
    console.log(req.params.id);
    //find the transactions and list them
    User.findOne({"capitaloneId": req.params.id}, function(err, doc) {
        console.log(doc);
        res.json({transactions: doc.cTransactions});
    })
})

router.get('/profile/:id/recipes', (req, res) => {
    //find the transactions and list them
    User.findOne({_id: req.params.id}, function(err, doc) {

    })
})

router.post('/profile/:id/addtransaction', (req, res) => {
    // find the transactions and list them
    // params: merchantId, amount, and description
    capitalOneApi.addTransaction(req.params.id, req.body);
    
})

router.post('/addmerchant', (req, res) => {
    // add a new merchant based on name and category
    // params: name and category
    capitalOneApi.addMerchant(req.body);
})

router.get('/listmerchants', (req, res) => {
    // list all merchants
    capitalOneApi.listMerchants(function(merchants) {
        res.send(merchants);
    })
})

router.get('/profile/:id/mint/transactions', (req, res) => {
    //find the transactions and list them
    User.findOne({_id: req.params.id}, function(err, doc) {

    })
})

router.get('/profile/:id/mint/recipes', (req, res) => {
    //find the transactions and list them
    User.findOne({_id: req.params.id}, function(err, doc) {

    })
})

//routes needed : add transacrion, list all mint transactions, list all recipes, list all mint recipes

module.exports = router;
