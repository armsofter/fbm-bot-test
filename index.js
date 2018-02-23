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

// Get Started button
// function setupGetStartedButton(res){
//     let messageData = {
//         "get_started":[
//             {
//                 "payload":"GetStarted"
//             }
//         ]
//     };

    // Start the request
//     request({
//             url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             form: messageData
//         },
//         function (error, response, body) {
//             if (!error && response.statusCode === 200) {
//                 // Print out the response body
//                 res.send(body);
//
//             } else {
//                 // TODO: Handle errors
//                 res.send(body);
//             }
//         });
// }


//End of Get Started Button

// app.use( (req, res, next) =>{
//     console.log('req header:', req.body.entry[0].changes);
//     // if (req.body.entry[0].changes[0].value.item === 'like') {
//     //     req.body.entry[0].changes[0]
//     // }else {
//     //     console.log( " : REQ START : ", req.body.entry[0].changes[0].value," : VALUE : ", " : REQ END : ");
//     // }
//
//     // if (req.body.entry[0].changes[0].value.item == 'comment') {
//     //     console.log(' : comment start : ');
//     //     console.log(req.body.entry[0].changes[0]);
//     //     console.log( " COMMENT END : ");
//     // } else if(req.body.entry[0].changes[0].value.item == 'like'){
//     //     console.log("  : LIKE START : ");
//     //     console.log(req.body.entry[0].changes[0]);
//     //     console.log(" : LIKE END : ")
//     // } else {
//     //     // console.log(' EVENT  : ');
//     //     // console.log(req.body.entry[0].changes[0]);
//     //     // console.log(': END EVENT  : ');
//     //
//     // }
//
//     //console.log( " : REQ START : ", req.body.entry[0].changes[0]," : VALUE : ", " : REQ END : ");
//
//
//     // next();
// });

app.use(bodyParser.json({verify: facebookModule.verifyRequestSignature}));

app.get('/', facebookModule.authGET, function (req, res, next) {
    res.status(200).send(req.query['hub.challenge']);
});

app.post('/', facebookModule.parsePOST, function (req, res) {
    console.log("req body :", req.body);
    let dataList = req.afterParse;
    console.log(" DATA LIST : ", dataList[0]);
    if (dataList[0].messageType === 'Postback'){
        UsersConteoller.saveUser(dataList[0].senderId);
        MessagesHelper.welcome(dataList);
    }else if (dataList[0].messageType === '') {
        if (dataList[0].message.text === 'hi'
            || dataList[0].message.text === 'HI'
            || dataList[0].message.text === 'Hi'
            || dataList[0].message.text === 'Hello'
            || dataList[0].message.text === 'hello') {
            UsersConteoller.saveUser(dataList[0].senderId);
            MessagesHelper.welcome(dataList);
        }
    } else if (dataList[0].messageType === 'QuickReply') {
        console.log(" PAYLOAD : ", dataList[0].message.quick_reply);
        let next = dataList[0].message.quick_reply.payload.split('_')[1];
        let type = dataList[0].message.quick_reply.payload.split('_')[2];
        let answerId = dataList[0].message.quick_reply.payload.split('_')[3];
        MessagesHelper.nextStep(next, parseInt(type), parseInt(answerId), dataList)
    } else {
        console.log(req, " NOT MESSAGE WEB HOOK ");
    }
    res.sendStatus(200);
});


app.listen(3000, () => console.log('Webhook server is listening, port 3000'));
