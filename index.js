'use strict';
var Alexa = require("alexa-sdk");
var request = require('request');
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
var handlers = {
    'RemindRewards': function () {
        // This would actually be:
        // GET /rewards/accounts
        // followed by merging
        // GET /rewards/accounts/{rewardsAcountsReferenceId}
        var responseData = {
          'rewardsAccounts': [
            {
              'accountDisplayName': 'Badass Rewards',
              'rewardsAccountReferenceId': '0fb65298-621b-45df-b3d6-997f69034e20',
              'rewardsCurrency': 'Cash'
            },
            {
              'accountDisplayName': 'Team Six Sweet Travel Rewards',
              'rewardsAccountReferenceId': '13165a84-9db7-4657-92f0-971f5d9dd98f',
              'rewardsCurrency': 'Miles'
            },
            {
              'accountDisplayName': 'Totally Legit Actual Real Account',
              'rewardsAccountReferenceId': '13165a84-9db7-4657-92f0-971f5d9dd98f',
              'rewardsCurrency': 'Points'
            }
          ]
        }
        var respString = "Your accounts are ";
        responseData.rewardsAccounts.forEach(function(acct) {
          respString += acct['accountDisplayName'] + ' (in ' + acct['rewardsCurrency'] + '), '
        });
        console.log(respString);
  
        this.emit(':tell', respString);
    },
    'RemindOffers': function () {

        var dataString = 'client_id=e76fa55db2754ee0883c41c7cd15137e&client_secret=20dbc5885cdaa2077b257498ad957e1d&grant_type=client_credentials';
        
        var options = {
            url: 'https://api-sandbox.capitalone.com/oauth2/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: dataString
        };
        
        var accessToken = ""
        var authType = ""
        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body)
                accessToken = data.access_token
                authType = data.token_type
                // expires_in : int (epoch?)
                // issued_at : int (epoch?)
            }
        });

        var headers = {
            'Accept': 'application/json; v=2',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        };
        headers['Authorization'] = authType + ' ' + accessToken

        options = {
            url: 'https://api-sandbox.capitalone.com/credit-offers/products/cards/consumer',
            headers: headers
        };

        request(options, function(error, response, body){
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                console.log(data.products);
                //console.log(data.products);
                //this.emit(':tell', 'whatever');
            }
        });

        /*
         *
        // This is the prequal stuff
        var headers = {
            'Accept': 'application/json;v=2',
            'Authorization': 'Bearer your_access_token',
            'Content-Type': 'application/json'
        };
        
        var dataString = '{"firstName":"Ray","middleName":"G","lastName":"Hubbard","nameSuffix":"Jr.","address":{"addressLine1":"1230 Duck Fuss Lane","addressLine2":"Apt 15X","city":"Beaumont","stateCode":"TX","postalCode":"77701","countryName":"United States","countryCode":"US","addressType":"Home"},"taxId":"666666666","dateOfBirth":"1970-06-29","emailAddress":"ray@wyliehubbard.com","annualIncome":75000,"selfAssessedCreditRating":"Excellent","bankAccountSummary":"CheckingAndSavings","requestedBenefit":"TravelRewards"}';
        
        var options = {
            url: 'https://api-sandbox.capitalone.com/credit-offers/prequalifications',
            method: 'POST',
            headers: headers,
            body: dataString
        };
        
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
        
        request(options, callback);
        */
    },
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    'HelloWorldIntent': function () {
        this.emit('SayHello')
    },
    'SayHello': function () {
        this.emit(':tell', 'Hello World!');
    }
};
