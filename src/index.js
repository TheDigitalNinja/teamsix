"use strict";

//TODO import/require API modules

var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).


// state flow for full cancel process
// START_CANCEL  --> REMIND_REWARDS -- > (ask question) --> REWARDS_DECLINE --> _REMINDOFFERS --> (ask question) --> OFFERS_DECLINE --> 
var APP_STATES = {
    START: "_START", // Start cancel, as user are they sure (yes/no),
    REMIND_REWARDS: "_REMINDREWARDS", // get user rewards and remind user of them
    REMIND_OFFERS: "_REMINDOFFERS",
    FINAL_CONFIRMATION: "_FINALCONFIRMATION", // final are you sure you want to cancel
    DONE: "_DONE",
    HELP: "_HELPMODE" // The user is asking for help.
};


var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageString;
    alexa.registerHandlers(newSessionHandlers, startStateHandlers, remindRewardsStateHandlers, remindOffersStateHandlers, finalConfirmationStateHandlers, helpStateHandlers);
    alexa.execute();
};

var newSessionHandlers = {
    "LaunchRequest": function () {
        this.handler.state = APP_STATES.START;
        this.emitWithState("StartCancel", true);
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = APP_STATES.START;
        this.emitWithState("StartCancel", true);
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = APP_STATES.HELP;
        this.emitWithState("helpTheUser", true);
    },
    "Unhandled": function () {
        var speechOutput = 'Unhandled..find the developers and pay them more';
        this.emit(":ask", speechOutput, speechOutput);
    },
    'HelloWorldIntent': function () {
        this.emit(':tell', 'Hello World!')
    },
    //TODO
};

var startStateHandlers = Alexa.CreateStateHandler(APP_STATES.START, {
    "StartCancel": function (newGame) {

        // TODO -- replace boilerplate with cap one cancel stuff
        var speechOutput = 'Dave, you clearly have you been up all night at a hackathon. But I really want to stay in your wallet. Consider all the benefits of being a capital one customer.';
        var repromptText = '';
        // TODO -- card support
        var cardTitle = 'Cancel Account';

        
        // TODO -- API call get reards info
        // Set the current state to remind rewards mode. The skill will now use handlers defined in remind rewards

        //TODO 
        //apend reward stuff to speechOutput
        //speechOutput = speechOutput + '';
        repromptText = speechOutput;
        this.handler.state = APP_STATES.REMIND_REWARDS;
        this.emit('RemindRewards', true);
       // this.emit(":askWithCard", speechOutput, repromptText, cardTitle, repromptText);
       //this.emit(":tell", speechOutput, repromptText);
    }
});

var remindRewardsStateHandlers = Alexa.CreateStateHandler(APP_STATES.REMIND_REWARDS, {
    "RemindRewards": function (newGame) {
        var speechOutput = 'Dave, you clearly have you been up all night at a hackathon. But I really want to stay in your wallet. Consider all the benefits of being a capital one customer.';
       
        // TODO -- replace boilerplate with cap one cancel stuff
        speechOutput = speechOutput + ' Are you sure you want to give up your reward advantages?';
        var repromptText = speechOutput;
        // TODO -- card support
       // this.emit(":askWithCard", speechOutput, repromptText, cardTitle, repromptText);

       //ask the user if they are sure they want to cancel...if no, goto no cancel state, if yes, goto offers state
       this.emit(":ask", speechOutput, repromptText);
    },
    "AMAZON.YesIntent": function() {
         var speechOutput = '';
        if (this.attributes["speechOutput"] && this.attributes["repromptText"]) {
             //this.emit(":tell", speechOutput);
              this.emitWithState("RemindOffers");
           // this.emitWithState("AMAZON.RepeatIntent");
        } else {
            //this.handler.state = APP_STATES.DONE;
             this.emitWithState("RemindOffers");
           // this.emitWithState("StartGame", false);
        }
    },
    "AMAZON.NoIntent": function() {
        var speechOutput = 'You are the man Dave. I look forward to many years in your wallet.';
         this.handler.state = APP_STATES.DONE;
        this.emit(":tell", speechOutput);
        //TODO -- goto end state????
    }
});

//TODO how do we get to the state from a 'YES' to the question asked above
// enter this if yes says yes to still cancel after rewards
var remindOffersStateHandlers = Alexa.CreateStateHandler(APP_STATES.REMIND_OFFERS, {
    "RemindOffers": function (newGame) {

        // TODO -- replace boilerplate with cap one cancel stuff
        var speechOutput = 'With offers like these, how can you leave me? Keep in mind, Samuel L Jackson tried to leave once and we put him on a plane with a bunch of snakes.';
        var repromptText = speechOutput;
        // TODO -- card support
       

        
        // TODO -- API call get card offer info
        // Set the current state to remind rewards mode. The skill will now use handlers defined in remind rewards
        this.handler.state = APP_STATES.REMIND_OFFERS_CONFIRM;
       

       //ask the user if they are sure they want to cancel...if no, goto no cancel state, if yes, goto offers state
       this.emit(":ask", speechOutput, repromptText);
    },
    "AMAZON.YesIntent": function() {
         //var speechOutput = 'You are no longer a customer';
        if (this.attributes["speechOutput"] && this.attributes["repromptText"]) {
            //this.handler.state = APP_STATES.FINAL_CONFIRMATION;
             //this.emit(":tell", speechOutput);
            this.emitWithState("FinalConfirmation");
        } else {
             this.emitWithState("FinalConfirmation");
           
        }
    },
    "AMAZON.NoIntent": function() {
        var speechOutput = "Oh Dave, there's no wallet I'd rather be in.";
         this.handler.state = APP_STATES.DONE;
        this.emit(":tell", speechOutput);
         //TODO -- goto end state????
    }
});

var finalConfirmationStateHandlers = Alexa.CreateStateHandler(APP_STATES.FINAL_CONFIRMATION, {
    "FinalConfirmation": function (newGame) {

        // TODO -- replace boilerplate with cap one cancel stuff
        var speechOutput = "Come on Dave, please don't do this to me. Are you sure you really really sure you want to cancel?";
        var repromptText = speechOutput;
        // TODO -- card support
       
       

       //ask the user if they are sure they want to cancel...if no, goto no cancel state, if yes, goto offers state
       this.emit(":ask", speechOutput, repromptText);
    },
    "AMAZON.YesIntent": function() {
         var speechOutput = "Fine, I didn’t like being in your wallet anyway";
        if (this.attributes["speechOutput"] && this.attributes["repromptText"]) {
           // this.handler.state = APP_STATES.FINAL_CONFIRMATION;
            this.handler.state = APP_STATES.DONE;
             this.emit(":tell", speechOutput);
           // this.emitWithState("AMAZON.RepeatIntent");
        } else {
            //this.handler.state = APP_STATES.DONE;
             this.handler.state = APP_STATES.DONE;
            this.emit(":tell", speechOutput);
             //TODO -- goto end state????
           
        }
    },
    "AMAZON.NoIntent": function() {
        var speechOutput = "Oh Dave, there's no wallet I'd rather be in.";
        this.emit(":tell", speechOutput);
         //TODO -- goto end state????
    }
});

// var triviaStateHandlers = Alexa.CreateStateHandler(APP_STATES.TRIVIA, {
//     "AnswerIntent": function () {
//         handleUserGuess.call(this, false);
//     },
//     "DontKnowIntent": function () {
//         handleUserGuess.call(this, true);
//     },
//     "AMAZON.StartOverIntent": function () {
//         this.handler.state = APP_STATES.START;
//         this.emitWithState("StartGame", false);
//     },
//     "AMAZON.RepeatIntent": function () {
//         this.emit(":ask", this.attributes["speechOutput"], this.attributes["repromptText"]);
//     },
//     "AMAZON.HelpIntent": function () {
//         this.handler.state = APP_STATES.HELP;
//         this.emitWithState("helpTheUser", false);
//     },
//     "AMAZON.StopIntent": function () {
//         this.handler.state = APP_STATES.HELP;
//         var speechOutput = this.t("STOP_MESSAGE");
//         this.emit(":ask", speechOutput, speechOutput);
//     },
//     "AMAZON.CancelIntent": function () {
//         this.emit(":tell", this.t("CANCEL_MESSAGE"));
//     },
//     "Unhandled": function () {
//         var speechOutput = this.t("TRIVIA_UNHANDLED", ANSWER_COUNT.toString());
//         this.emit(":ask", speechOutput, speechOutput);
//     },
//     "SessionEndedRequest": function () {
//         console.log("Session ended in trivia state: " + this.event.request.reason);
//     }
// });

var helpStateHandlers = Alexa.CreateStateHandler(APP_STATES.HELP, {
    "helpTheUser": function (newGame) {
        //TODO ---add help support

        
        var speechOutput = "";
        var repromptText = speechOutput;
        this.emit(":ask", speechOutput, repromptText);
    },
    "AMAZON.StartOverIntent": function () {
        this.handler.state = APP_STATES.START;
        this.emitWithState("StartCancel", false);
    },
    "AMAZON.RepeatIntent": function () {
        var newGame = (this.attributes["speechOutput"] && this.attributes["repromptText"]) ? false : true;
        this.emitWithState("helpTheUser", newGame);
    },
    "AMAZON.HelpIntent": function() {
        var newGame = (this.attributes["speechOutput"] && this.attributes["repromptText"]) ? false : true;
        this.emitWithState("helpTheUser", newGame);
    },
    "AMAZON.YesIntent": function() {
        if (this.attributes["speechOutput"] && this.attributes["repromptText"]) {
            this.handler.state = APP_STATES.START;
            this.emitWithState("AMAZON.RepeatIntent");
        } else {
            this.handler.state = APP_STATES.START;
            this.emitWithState("StartCancel", false);
        }
    },
    "AMAZON.NoIntent": function() {
        var speechOutput = "";
        this.emit(":tell", speechOutput);
    },
    "AMAZON.StopIntent": function () {
        var speechOutput = "";
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.CancelIntent": function () {
        this.emit(":tell", "Cancel message");
    },
    "Unhandled": function () {
        var speechOutput = "Unhandled...run away";
        this.emit(":ask", speechOutput, speechOutput);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in help state: " + this.event.request.reason);
    }
});





