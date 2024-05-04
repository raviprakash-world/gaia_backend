const { DataTypes, Sequelize } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    ColorName: { type: DataTypes.STRING, allowNull: false },
    ColorCode: { type: DataTypes.STRING, allowNull: true },
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

  return sequelize.define("color", attributes, options);
}
