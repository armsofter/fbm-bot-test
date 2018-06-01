const Models = require('../models/index');
const Messages = Models.messages;
const Tracks = Models.tracks;
const Answers = Models.answers;
// const Messages = require('../models/Messages');

exports.welcomeMessage = (callback) => {
    Messages.findById(1).then(project => {
        // console.log('MESSAGE : ', project.dataValues.message);
        callback(project.dataValues)
    })
}

exports.message = (id, callback) => {
    Messages.findById(id).then(message => {
        callback(message.dataValues)
    });
}


exports.track = (id, userId) => {
    console.log(" ARGUMENTS : ", id, userId + '');
    Tracks.find({user_id: String(userId)})
        .then(function (obj) {
            if (obj) {
                console.log('update error');
                return obj.update({message_id: id, updateAt: new Date()}).then(data => {
                    console.log('UPDATED TRACKING')
                });
            }
            else { // insert
                console.log('insert error');
                return Tracks.create({user_id: userId, message_id: id, createat: new Date()});
            }
        })
}

exports.addAnswer = (answerId, userId) => {
    Answers.create({answer: answerId, userid: userId, createdAt: new Date()}).then(answer => {
        if (answer) {
            return true;
        } else {
            return false;
        }
    });
}

exports.addQuestion = (req, res) => {
    Messages.create(req.body).then(data => {
        res.json(data);
    })
};

exports.getAllQuestions = (req, res) => {
    Messages.findAll().then(data => {
        res.json(data);
    });
};

exports.getOneQuestion = (req, res) => {
    Messages.findById(req.params.id).then(data => {
        res.json(data);
    });
}


exports.updateMessage = (req, res) => {
    Messages.findById(req.body.id).then(message => {
        message.updateAttributes(req.body)
            .then(() => {
                res.json({});
            })
    });
}

exports.deleteMessage = (req, res) => {
    Messages.destroy({
        where: {
            id: req.params.id
        }
    }).then(data => {
        res.json(data);
    });
};

