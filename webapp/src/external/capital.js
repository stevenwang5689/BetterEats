// exposes all the important stuff for the capital one api
const request = require('request');

const twil = require('./twil.js');
const User = require('../models/User.js');

const KEY = 'c5608a5b7c95ce7eaf1022449bd67068';

function getMerchantTypes(merchantId, cb) {
    let url = 'http://api.reimaginebanking.com/merchants/' + merchantId + '?key=' + KEY;

    request(url, (err, res, body) => {
        if (body.category.includes('food')) {
            cb(true, body.name);
        }
    })
}

module.exports.getTransactions = (accountId) => {
    let url = 'http://api.reimaginebanking.com/accounts/' + accountId + '/purchases?key=' + KEY;
    request(url, (err, res, body) => {
        body.forEach((elem) => {
            getMerchantTypes(elem.merchant_id, function(isFood, name) {
                if (isFood) {
                    // run the recipe request
                    recipeUrl = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyCGdb4Luj-KtUjvqu424twQWGf_chUp6h4&cx=015559519240519451969:lq3zh9hahai&q=' + name;
                    request(recipeUrl, (eerr, response, recipes) => {
                        let recipe = recipes.items[0].formattedUrl;
                        let message = 'Hey! You just spend money! Maybe next time try this recipe: ' + recipe;

                        User.findOne({_id: accountId}, function(err, usr) {
                            if (usr) {
                                twil.sendText(usr.number, message)
                            }



                        });

                    })
                }
            })
        })

    })
}

module.exports.addTransaction = (accountId, data) => {
    let trans = {
        merchant_id: data.merchantId,
        medium: "balance",
        purchase_date: "2017-10-28",
        amount: data.amount,
        description: data.description
    };

    let url = 'http://api.reimaginebanking.com/accounts/' + accountId + '/purchases?key=' + KEY;

    request.post(url, {form: trans}, function(err, res, body) {
        console.log(body);
    });

    let recipeUrl = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyCGdb4Luj-KtUjvqu424twQWGf_chUp6h4&cx=015559519240519451969:lq3zh9hahai&q=' + data.description;
    request(recipeUrl, (eerr, response, recipes) => {
        let jsonpar = JSON.parse(recipes);
        let recipe = jsonpar.items[0].formattedUrl;
        let message = 'Hey! You just spent $' + data.amount +'! Maybe next time try this recipe: ' + recipe;

        console.log(message);
        User.findOne({"capitaloneId": accountId}, function(err, usr) {
            
            if (usr) {
                twil.sendText(usr.number, message)
            }

        });

    })


}

module.exports.addMerchant = (data) => {
    console.log(data);
    let merch = {
        "name": data.name,
        "category": [
          "food",
          "store"
        ],
        "address": {
          "street_number": "1234",
          "street_name": "Main st",
          "city": "Austin",
          "state": "TX",
          "zip": "78705"
        },
        "geocode": {
          "lat": 0,
          "lng": 0
        }
    };

    console.log(merch);

    let url = 'http://api.reimaginebanking.com/merchants?key=' + KEY;

    request.post(url, {form: merch}, function(err, res, body) {
        console.log(body);
    })
}

module.exports.listMerchants = (cb) => {
    let url = 'http://api.reimaginebanking.com/merchants?key=' + KEY;
    request(url, (err, res, body) => {
        cb(body);
    });
}