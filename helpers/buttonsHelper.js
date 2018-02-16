const request = require('request');
var fs = require('fs');
var env = JSON.parse(fs.readFileSync('./env.json', 'utf8'));

exports.sendButtons = (userId, buttonsData) => {
    console.log(" : BUTTON DATA : ", buttonsData, " : BUTTONS DATA : ");
    let requestData = {
        recipient: {
            "id": userId
        },
        message: {
            text: buttonsData.message,
            quick_replies: [
            ]
        }
    };
    buttonsData.buttons.map(button => {
        requestData.message.quick_replies.push({
            content_type:"text",
            title: button.name,
            payload: "button_" + button.next + "_" + button.type + "_" + button.ID
        });
    });
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + env.PAGE_ACCESS_TOKEN,
        method: "POST",
        json: requestData
    }, function (err, resp, body) {

    })


}