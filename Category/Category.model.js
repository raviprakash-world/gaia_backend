const { DataTypes, Sequelize } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    categoryName: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
  };

  const options = {
    defaultScope: {
      // exclude password hash by default
      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {} },
    },
  };

  // function generateId() {
  //   const prefix = attributes.categoryName.substring(0, 1).toUpperCase();
  //   let suffix;
  //   switch (attributes.gender) {
  //     case "male":
  //       suffix = "001";
  //       break;
  //     case "female":
  //       suffix = "002";
  //       break;
  //     default:
  //       suffix = "000";
  //   }
  //   return `${prefix}${suffix}`;
  // }

  return sequelize.define("category", attributes, options);
}
