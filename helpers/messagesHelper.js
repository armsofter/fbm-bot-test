const MessagesController = require('../controllers/messages');
const UsersConteoller = require('../controllers/users');
const Models = require('../models/index');
const Tracks = Models.tracks;
const Messages = Models.messages;
const Inputs = Models.inputs;
const ButtonsController = require('../controllers/buttons');
const facebookModule = require('fb-bot');
const messagesHelper = require('./messagesHelper');
const fs = require('fs');
const env = JSON.parse(fs.readFileSync('./env.json', 'utf8'));
const ButtonsHelper = require('../helpers/buttonsHelper');
const validator = require('validator');
const MyjobsHelper = require('./MyjobsHelper');

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
                MessagesController.track(1, data.senderId);
                facebookModule.sendTextMessage(data.senderId, a.message);
                if (a.type === 0) {
                    setTimeout(() => {
                        nextStep(a.next, a.type, 0, dataList, a.input);
                    }, 2000);
                } else {
                    ButtonsController.getButton(a.next, (buttons) => {
                        dataList.forEach(function (data) {
                            ButtonsHelper.sendButtons(dataList[0].senderId, buttons.dataValues);
                        });
                    });
                }
            });
        });
    });
};

const nextStep = exports.nextStep = (next, type, answerId, dataList, input) => {
    setTimeout(() => {
        if (input) {
            MessagesController.track(next, dataList[0].senderId);
        } else {
            if (type === 0) {
                // track message
                MessagesController.track(next, dataList[0].senderId);
                MessagesController.addAnswer(answerId, dataList[0].senderId);
                MessagesController.message(next, (a) => {
                    dataList.forEach(function (data) {
                        facebookModule.messageListener(data, function () {
                            facebookModule.sendTextMessage(data.senderId, a.message);
                            nextStep(a.next, a.type, answerId, dataList, a.input);
                        });
                    });
                });
            } else if (type === 1) {
                MessagesController.track(next, dataList[0].senderId);
                MessagesController.addAnswer(answerId, dataList[0].senderId);
                ButtonsController.getButton(next, (buttons) => {
                    dataList.forEach(function (data) {
                        ButtonsHelper.sendButtons(dataList[0].senderId, buttons.dataValues);
                    });
                });
            }
        }

    }, 1500);
};

const inputForID = exports.inputForID = (data) => {
    if (data.senderId !== null) {
        Tracks.find({where: {user_id: data.senderId}}).then((track) => {
            let messageId = Number(track.dataValues.message_id) - 1;
            Messages.findById(messageId).then(message => {
                console.log(" MESSAGE : ", message.dataValues, " : MESSAGE ");
                if (message.dataValues.input) {
                    Inputs.create({
                        user: data.senderId,
                        answer: data.message.text,
                        question: message.dataValues.id
                    }).then((res => {
                        console.log(" RESULT : ", res.dataValues, " : RESULT ");
                        nextStep(message.dataValues.next, message.dataValues.type, 0, [data], false);
                    }))
                }
            });
            console.log(" TRACK :  FROM USER ID : ", track.dataValues.message_id, " : TRACK USER ID : : ");
        })
    } else {
        console.log('sadsds');
    }
};