'use strict';
module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define('user', {
        user_id: {
        type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    });
    return Users;
}