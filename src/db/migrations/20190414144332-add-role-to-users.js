"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Users", "role", {
      type: Sequelize.STRING,
      allowNull: false,

      defaultValue: "admin"
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Users", "role");
  }
};
