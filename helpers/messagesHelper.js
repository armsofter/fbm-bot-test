const MessagesController = require('../controllers/messages');
const UsersConteoller = require('../controllers/users');
const Models = require('../models/index');
const Tracks = Models.tracks;
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


const nextStep = exports.nextStep = (next, type, answerId, dataList) => {
    setTimeout(() => {

        if (type === 0) {
            if( next === '4'){
                UsersConteoller.getUser(dataList[0].senderId).then( (user) => {
                    console.log("USER ::: ", user, user.dataValues.j_id, answerId)
                    MyjobsHelper.setCategory(user.dataValues.j_id, answerId)
                })
            }
            // track message
            MessagesController.track(next, dataList[0].senderId);
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
            // track message
            MessagesController.track(next, dataList[0].senderId);
            MessagesController.addAnswer(answerId, dataList[0].senderId)

            ButtonsController.getButton(next, (buttons) => {
                dataList.forEach(function (data) {
                    ButtonsHelper.sendButtons(dataList[0].senderId, buttons.dataValues);
                });
            });
        }
    }, 1000);

};


exports.inputForID = (data) => {
    if (data.senderId !== null) {
        Tracks.find({where: {user_id: data.senderId}}).then((track) => {
            if (track.message_id == 8 || track.message_id == 12) {
                if (validator.isEmail(String(data.message.text))) {
                    MyjobsHelper.userDataByEmail(data.message.text, (count, j_id) => {
                        console.log(" : STARAT S : ", count, " : USERS EMAIL : ", j_id);
                        UsersConteoller.saveUserJobId(j_id, data.senderId);
                        if (count < 3) {
                            nextStep(10, 0, 8, [data]);
                        } else {
                            nextStep(11, 0, 8, [data]);
                        }
                    });

                } else {
                    nextStep(12, 0, 8, [data])
                }
            }
        })
    } else {
        console.log('sadsds');
    }
};