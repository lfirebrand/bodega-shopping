'use strict';
module.exports = (sequelize, DataTypes) => {
  var List = sequelize.define('List', {
    listName: DataTypes.STRING
  }, {});
  List.associate = function(models) {
    // associations can be defined here
  };
  return List;
};