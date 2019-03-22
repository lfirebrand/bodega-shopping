"use strict";
module.exports = (sequelize, DataTypes) => {
  var Item = sequelize.define(
    "Item",
    {
      itemName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      purchased: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      listId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Item.associate = function(models) {
    // associations can be defined here

    Item.belongsTo(models.List, {
      foreignKey: "listId",
      onDelete: "CASCADE"
    });
  };
  return Item;
};
