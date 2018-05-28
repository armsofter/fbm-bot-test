const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const facebookModule = require('fb-bot');
const Sequelize = require('sequelize');
const models = require('./models');
let fs = require('fs');
let env = JSON.parse(fs.readFileSync('env.json', 'utf8'));
const request = require('request');
const MessagesController = require('./controllers/messages');
const UsersConteoller = require('./controllers/users');
const ButtonsController = require('./controllers/buttons');
const MessagesHelper = require('./helpers/messagesHelper');
const MyJobsHelper = require('./helpers/MyjobsHelper');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


facebookModule.init({
    APP_SECRET: env.APP_SECRET,
    VALIDATION_TOKEN: env.VALIDATION_TOKEN,
    PAGE_ACCESS_TOKEN: env.PAGE_ACCESS_TOKEN,
    SERVER_URL: env.SERVER_URL
});


app.use((req, res, next) => {
    //tests for all web hooks

    next();
});

app.use(bodyParser.json({verify: facebookModule.verifyRequestSignature}));

app.get('/', facebookModule.authGET, function (req, res, next) {
    res.status(200).send(req.query['hub.challenge']);
});

app.post('/', facebookModule.parsePOST, function (req, res) {
    // console.log("req body :", req.body);
    let dataList = req.afterParse;
    if (dataList[0].messageType === 'Postback') {
        UsersConteoller.saveUser(dataList[0].senderId);
        MessagesHelper.welcome(dataList);
    } else if (dataList[0].messageType === '') {
        if (dataList[0].message.text === 'hi'
            || dataList[0].message.text === 'HI'
            || dataList[0].message.text === 'Hi'
            || dataList[0].message.text === 'Hello'
            || dataList[0].message.text === 'hello') {
            UsersConteoller.saveUser(dataList[0].senderId);
            MessagesHelper.welcome(dataList);
        } else {
            MessagesHelper.inputForID(dataList[0]);
        }
    } else if (dataList[0].messageType === 'QuickReply') {
        console.log(" PAYLOAD : ", dataList[0].message.quick_reply);
        let next = dataList[0].message.quick_reply.payload.split('_')[1];
        let type = dataList[0].message.quick_reply.payload.split('_')[2];
        let answerId = dataList[0].message.quick_reply.payload.split('_')[3];
        MessagesHelper.nextStep(next, parseInt(type), parseInt(answerId), dataList)
    } else {
        console.log(" NOT MESSAGE WEB HOOK ");
    }
    res.sendStatus(200);
});

app.post('/mass', (req, res) => {
    UsersConteoller.sendMassMessages(req, res);
});


app.listen(3000, () => console.log('Webhook server is listening, port 3000'));
