"use strict";
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: { msg: "must be a valid email" }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "admin"
      }
    },
    {}
  );
  User.associate = function(models) {
    User.hasMany(models.Item, {
      foreignKey: "userId",
      as: "items"
    });

    User.hasMany(models.Purchase, {
      foreignKey: "userId",
      as: "purchases"
    });
  };
  User.prototype.isAdmin = function() {
    return this.role === "admin";
  };

  return User;
};
