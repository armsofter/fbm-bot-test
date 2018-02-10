const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const facebookModule = require('fb-bot');
const Sequelize = require('sequelize');
const models = require('./models');
const MessagesController = require('./controllers/messages');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




facebookModule.init({
    APP_SECRET: 'c1a1102bdcb26b674a566e8339d84088',
    VALIDATION_TOKEN: 'token',
    PAGE_ACCESS_TOKEN: 'EAACjUUyZAe38BALM0bBx5wIlMQtupCtufpofSoQfZAD3u3dKxQGjZBVxAG5XIUs93HlyMEHlHsy2x06ZBm29w9KNma82QfKekvcZAasFaGM5SbDvmZAkIuqtmEqNor20lvB7E2UXZAkmayKnSUSdNz8jLg6bcUost1q8NQ47zkZC9pCkVU5RK6m9',
    SERVER_URL: 'https://cabb009f.ngrok.io'
  });
   
app.use(bodyParser.json({ verify: facebookModule.verifyRequestSignature }));

app.get('/webhook', facebookModule.authGET, function (req, res, next) {
    res.status(200).send(req.query['hub.challenge']);
});

app.post('/', facebookModule.parsePOST, function (req, res) {
    var dataList = req.afterParse ;
    console.log(dataList);
    MessagesController.welocomeMessage((a) => {
      dataList.forEach(function(data) {
        facebookModule.messageListener(data, function() {
          facebookModule.sendTextMessage(data.senderId, a.message);
        });
      });
    });
    
    res.sendStatus(200);
  });




app.listen(3000, () => console.log('Webhook server is listening, port 3000'));
