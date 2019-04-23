"use strict";
module.exports = (sequelize, DataTypes) => {
  var Purchase = sequelize.define(
    "Purchase",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Purchase.associate = function(models) {
    Purchase.belongsTo(models.Item, {
      foreignKey: "itemId",
      onDelete: "CASCADE"
    });

    Purchase.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };
  return Purchase;
};
