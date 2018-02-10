'use strict';
module.exports = function(sequelize, DataTypes) {
var Tracks = sequelize.define('tracks', {
    user_id: {
      type: DataTypes.INTEGER
    },
    mess_id: {
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