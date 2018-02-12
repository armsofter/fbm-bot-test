
const Models = require('../models/index');
const Messages = Models.messages;
const Tracks = Models.tracks;
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
    Tracks.findOne({ user_id : userId} )
    .then(function(obj) {
        if(obj) { // update
            return obj.update({message_id: id, updateAt: new Date()});
        }
        else { // insert
            return Tracks.create({user_id: userId, message_id: id, createat: new Date()});
        }
    })
}




