const MessagesController = require('../controllers/messages');
const UsersConteoller = require('../controllers/users');
const ButtonsController = require('../controllers/buttons');
const facebookModule = require('fb-bot');
const messagesHelper = require('./messagesHelper');
var fs = require('fs');
var env = JSON.parse(fs.readFileSync('./env.json', 'utf8'));
const ButtonsHelper = require('../helpers/buttonsHelper');

facebookModule.init({
    APP_SECRET: env.APP_SECRET,
    VALIDATION_TOKEN: env.VALIDATION_TOKEN,
    PAGE_ACCESS_TOKEN: env.PAGE_ACCESS_TOKEN,
    SERVER_URL: env.SERVER_URL
});

exports.welcome = (dataList) => {
    MessagesController.welcomeMessage((a) => {
        dataList.forEach(function (data) {
            facebookModule.messageListener(data, function () {
                facebookModule.sendTextMessage(data.senderId, a.message);
                if (a.type === 0) {
                    messagesHelper.nextStep(a.next, a.type, 0, dataList);
                } else {
                    ButtonsController.getButton(a.next);
                }
            });
        });
    });

};


exports.nextStep = (next, type, answerId, dataList) => {
    console.log("step",next)
    console.log("data_list",dataList[0].message.quick_reply)
    setTimeout(() => {
        if (type === 0) {
            // track message
            MessagesController.track(next,dataList[0].senderId);
            MessagesController.addAnswer(answerId, dataList[0].senderId)

            MessagesController.message(next, (a) => {
                dataList.forEach(function (data) {
                    facebookModule.messageListener(data, function () {
                        facebookModule.sendTextMessage(data.senderId, a.message);
                        messagesHelper.nextStep(a.next, a.type, answerId, dataList);
                    });
                });
            });
        } else if (type === 1) {
            console.log("Buttons :" ,next, type, dataList, ":Ednd buttons")
            // track message
            MessagesController.track(next,dataList[0].senderId);
            MessagesController.addAnswer(answerId, dataList[0].senderId)

            ButtonsController.getButton(next, (buttons) => {
                dataList.forEach(function (data) {
                    ButtonsHelper.sendButtons(dataList[0].senderId, buttons.dataValues);
                });
            });
        }
    }, 1000);

};
