
const Models = require('../models/index');
const Messages = Models.messages;

// const Messages = require('../models/Messages');

exports.welocomeMessage = (callback) => {
    Messages.findById(1).then(project => {
        // console.log('MESSAGE : ', project.dataValues.message);
        callback(project.dataValues)
      })
}