'use strict';
module.exports = function(sequelize, DataTypes) {
    var Answers = sequelize.define('answers', {
        answer: {
            type: DataTypes.INTEGER
        },
        userid: {
            type: DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    });
    return Answers;
}