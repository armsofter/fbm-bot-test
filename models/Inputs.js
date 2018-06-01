'use strict';
module.exports = function (sequelize, DataTypes) {
    var Inputs = sequelize.define('inputs', {
        user: {
            type: DataTypes.STRING
        },
        answer: {
            type: DataTypes.STRING
        },
        question: {
            type: DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    });
    return Inputs;
}