const Model = require('../models/index');
const Buttons = Model.buttons;
const ButtonsHelper = require('../helpers/buttonsHelper');

exports.getButton = (id, callback) => {
    Buttons.findById(id).then(buttons => {
       callback(buttons)
    });
};
