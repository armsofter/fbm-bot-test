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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

facebookModule.init({
    APP_SECRET: env.APP_SECRET,
    VALIDATION_TOKEN: env.VALIDATION_TOKEN,
    PAGE_ACCESS_TOKEN: env.PAGE_ACCESS_TOKEN,
    SERVER_URL: env.SERVER_URL
});

app.use(bodyParser.json({verify: facebookModule.verifyRequestSignature}));


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type, token');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

app.get('/', facebookModule.authGET, function (req, res, next) {
    res.status(200).send(req.query['hub.challenge']);
});

app.post('/', facebookModule.parsePOST, function (req, res) {
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
            if (dataList[0].message.text) {
                MessagesHelper.inputForID(dataList[0]);
            }
        }
    } else if (dataList[0].messageType === 'QuickReply') {
        let next = dataList[0].message.quick_reply.payload.split('_')[1];
        let type = dataList[0].message.quick_reply.payload.split('_')[2];
        let answerId = dataList[0].message.quick_reply.payload.split('_')[3];
        MessagesHelper.nextStep(next, parseInt(type), parseInt(answerId), dataList, false)
    } else {
        console.log(" NOT MESSAGE WEB HOOK ");
    }
    res.sendStatus(200);
});

app.get('/allButtons', (req, res) => {
    ButtonsController.getButtons(req, res);
});

app.post('/addButton', (req, res) => {
    ButtonsController.addButton(req, res);
});

app.get('/getOneButton/:id', (req, res) => {
    ButtonsController.getOneButton(req, res);
});

app.get('/deleteMessage/:id', (req, res) => {
    MessagesController.deleteMessage(req, res);
});

app.get('/deleteButton/:id', (req, res) => {
    ButtonsController.deleteButton(req, res);
});

app.post('/updateButton', (req, res) => {
    ButtonsController.updateButton(req, res);
});

app.get('/allMessages', (req, res) => {
    MessagesController.getAllQuestions(req, res);
});

app.get('/message/:id', (req, res) => {
    MessagesController.getOneQuestion(req, res);
});

app.post('/messages/update', (req, res) => {
    MessagesController.updateMessage(req, res);
});

app.post('/messages/add', (req, res) => {
    MessagesController.addQuestion(req, res);
});

app.get('/getFlow', (req, res) => {
    MessagesController.getFlow(req, res);
});

app.listen(3000, () => console.log('Webhook server is listening, port 3000'));
