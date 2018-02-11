
const Models = require('../models/index');
const Messages = Models.messages;

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
};
