'use strict';
module.exports = function (sequelize, DataTypes) {
    var Users = sequelize.define('user', {
        user_id: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        },
        gender: {
            type: DataTypes.STRING
        },
        timezone: {
            type: DataTypes.STRING
        },
        locale: {
            type: DataTypes.STRING
        },
        user_pic: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        j_id: {
            type: DataTypes.INTEGER
        }
    });
    return Users;
}