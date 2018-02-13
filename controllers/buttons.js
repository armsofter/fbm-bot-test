const Model = require('../models/index');
const Buttons = Model.buttons;
const ButtonsHelper = require('../helpers/buttonsHelper');

exports.getButton = (id, callback) => {
    Buttons.findById(id).then(buttons => {
        console.log("buttons from db: ", buttons.dataValues.buttons[0])
       callback(buttons)
    });
};
