'use strict';
var Alexa = require("alexa-sdk");
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
var handlers = {
    'RemindRewards': function () {
        var https = require('https');
        
        // Assemble the request message headers
        var requestHeaders = {
          'Accept': 'application/json;v=1',
          'Authorization': 'Bearer e87c585ada4809ec202c9bcb5cf4b13d1',
          'Accept-Language': 'en-US'
        }
        
        // Assemble the calling options for the request message
        var options = {
          method: 'GET',
          hostname: 'api-sandbox.capitalone.com',
          port: 443, // https
          path: '/rewards/accounts',
          headers: requestHeaders
        }
        
        // Create the request and handle the response
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

        var retrieveRewardsAccounts = https.request(options, function(response) {
        
          // Accumulate the response data
          var responseData = "";
          response.on('data', function(data) {
            responseData += data;
          });
        
          // Process the response data
          response.on('end', function() {
            // TODO: actually do something with responseData...
            console.log(responseData);
            var jsonData = JSON.parse(responseData);
            var respString = "Your accounts are ";
            responseData.rewardsAccounts.forEach(function(acct) {
              // go get the balance for them or something so we can get X Miles / Points / Cash
              respString += acct['accountDisplayName'] + ' (' + acct['rewardsCurrency'] + '), '
            });
            this.emit(':tell', respString);
          });
        });
    
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
