const Models = require('../models/index');
const Users = Models.user;
const request = require('request');
var fs = require('fs');
var env = JSON.parse(fs.readFileSync('env.json', 'utf8'));

exports.saveUser = (id) => {
    Users.findAll({where: {user_id: id}}).then(user => {
        // console.log(user, " : user : ");
        if (!user.length) {
            let queryString = "https://graph.facebook.com/v2.6/" + id + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + env.PAGE_ACCESS_TOKEN
            request(queryString, function (error, response, body) {
                // console.log('error:', error); // Print the error if one occurred
                // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.
                let userdata = JSON.parse(body);
                Users.create({user_id: id, name: userdata.first_name, lastName: userdata.last_name}).then( created => {
                    console.log(' created USER : ', created);
                })
            });
        }
    })
};