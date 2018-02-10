'use strict';
module.exports = function(sequelize, DataTypes) {
var Buttons = sequelize.define('buttons', {
    buttons: {
      type: DataTypes.JSON
    },
    type: {
      type: DataTypes.INTEGER
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
  });
  return Buttons;
}