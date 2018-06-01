'use strict';
module.exports = function(sequelize, DataTypes) {
var Tracks = sequelize.define('tracks', {
    user_id: {
      type: DataTypes.STRING
    },
    message_id: {
      type: DataTypes.INTEGER
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
  });
  return Tracks;
}