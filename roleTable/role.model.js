const { DataTypes, Sequelize } = require("sequelize");

module.exports = model;
function model(sequelize) {
  const attributes = {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleResource: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };
  return sequelize.define("role", attributes);
}
