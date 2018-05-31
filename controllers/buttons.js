const Model = require('../models/index');
const Buttons = Model.buttons;
const ButtonsHelper = require('../helpers/buttonsHelper');

exports.getButton = (id, callback) => {
    Buttons.findById(id).then(buttons => {
        callback(buttons)
    });
};

exports.getButtons = (req, res) => {
    Buttons.findAll().then(buttons => {
        res.json(buttons);
    });
};

exports.addButton = (req, res) => {
    Buttons.create(req.body).then(data => {
        res.json(data);
    });
}

exports.updateButton = (req, res) => {
    Buttons.findById(req.body.id).then(button => {
        button.updateAttributes(req.body)
            .then(() => {
                res.json({});
            })
    });
}

exports.getOneButton = (req, res) => {
    Buttons.findById(req.params.id).then(button => {
        res.json(button);
    })
};

exports.deleteButton = (req, res) => {
    Buttons.destroy({
        where: {
            id: req.params.id
        }
    }).then(data => {
        res.json(data);
    });
};
