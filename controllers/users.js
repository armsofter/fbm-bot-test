const Models = require('../models/index');
const Users = Models.user;
const request = require('request');
let fs = require('fs');
const facebookModule = require('fb-bot');
let env = JSON.parse(fs.readFileSync('env.json', 'utf8'));
const MyjobsHelper = require('../helpers/MyjobsHelper');

facebookModule.init({
    APP_SECRET: env.APP_SECRET,
    VALIDATION_TOKEN: env.VALIDATION_TOKEN,
    PAGE_ACCESS_TOKEN: env.PAGE_ACCESS_TOKEN,
    SERVER_URL: env.SERVER_URL
});

exports.saveUser = (id) => {
    Users.findAll({where: {user_id: id}}).then(user => {
        // console.log(user, " : user : ");
        if (!user.length) {
            let queryString = "https://graph.facebook.com/v2.6/" + id + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + env.PAGE_ACCESS_TOKEN
            request(queryString, function (error, response, body) {
                console.log('body:', body); // Print the HTML for the Google homepage.
                let userdata = JSON.parse(body);
                Users.create({
                    user_id: id,
                    gender: userdata.gender,
                    timezone: userdata.timezone,
                    locale: userdata.locale,
                    user_pic: userdata.profile_pic,
                    name: userdata.first_name,
                    lastName: userdata.last_name
                }).then(created => {
                    console.log(' created USER : ', created);
                })
            });
        } else {
            let queryString = "https://graph.facebook.com/v2.6/" + id + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + env.PAGE_ACCESS_TOKEN
            request(queryString, function (error, response, body) {
                // console.log('error:', error); // Print the error if one occurred
                // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.

            });
        }
    })
};


exports.sendMassMessages = (req, res) => {
    Users.findAll().then(users => {
        users.forEach((user) => {
            if (user.j_id != null) {
                MyjobsHelper.getJobsForUser(user.j_id, (jobs) => {
                    console.log(" JOBS START : ", jobs[0], " : JOBS END : ", jobs[0].length);
                    let blocks = [];
                    jobs[0].forEach(job => {
                        blocks.push({
                            title: job.title,
                            image_url: 'https://www.myjobs.com.mm/static/company-logo/' + job.company_id + '_1.jpeg',
                            subtitle: job.name,
                            default_action:
                                {
                                    type: 'web_url',
                                    url: 'https://www.myjobs.com.mm/job/-/' + job.job_id,
                                    messenger_extensions: true,
                                    webview_height_ratio: 'tall',
                                    fallback_url: 'https://myjobs.com.mm/'
                                },
                            buttons:
                                [{
                                    type: 'web_url',
                                    url: 'https://www.myjobs.com.mm/job/-/' + job.job_id,
                                    title: 'View Job Post'
                                }]
                        })
                    })
                    facebookModule.sendTextMessage(user.user_id, 'မဂၤလာပါ  ' + user.name + ' ' + user.lastName + ',\n' +
                        '\n' +
                        'ေအာက္ေဖာ္ျပပါ အလုပ္မ်ားက သင္နဲ႔ကိုက္ညီႏိုင္မယ့္ အလုပ္မ်ားကို အႀကံျပဳေပးျခင္းျဖစ္ပါတယ္။ စိတ္၀င္စားလို႔ ေလွ်ာက္ထားလိုတယ္ဆိုရင္ လင့္ခ္ကိုကလစ္ႏွိပ္ၿပီး ေလွ်ာက္ထားႏိုင္ပါတယ္။');

                    setTimeout(() => {
                        let options = {
                            method: 'POST',
                            url: 'https://graph.facebook.com/v2.6/me/messages',
                            qs: {access_token: 'EAACjUUyZAe38BALM0bBx5wIlMQtupCtufpofSoQfZAD3u3dKxQGjZBVxAG5XIUs93HlyMEHlHsy2x06ZBm29w9KNma82QfKekvcZAasFaGM5SbDvmZAkIuqtmEqNor20lvB7E2UXZAkmayKnSUSdNz8jLg6bcUost1q8NQ47zkZC9pCkVU5RK6m9'},
                            headers:
                                {
                                    'Cache-Control': 'no-cache',
                                    'Content-Type': 'application/json'
                                },
                            body:
                                {
                                    recipient: {id: user.user_id},
                                    message:
                                        {
                                            attachment:
                                                {
                                                    type: 'template',
                                                    payload:
                                                        {
                                                            template_type: 'generic',
                                                            elements: blocks
                                                        }
                                                }
                                        }
                                },
                            json: true
                        };

                        request(options, function (error, response, body) {
                            if (error) throw new Error(error);

                            console.log(body);
                        });
                    }, 1000);

                });
            }

        });
        res.json({err: false});
    });
};

exports.saveUserJobId = (j_id, id) => {
    Users.findOne({where: {user_id: id}}).then((user) => {
        user.j_id = j_id;
        user.save().then(() => {
            console.log('j_id saved');
        })
    })
};

exports.getUser = (id) => {
    return  Users.findOne({where: {user_id: id}});
}