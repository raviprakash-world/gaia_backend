const { DataTypes, Sequelize } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    username: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, allowNull: false },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[0-9]{10,15}$/,
      },
    },
    expiry: { type: DataTypes.BOOLEAN, allowNull: false },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      default: "user",
    },
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

  return sequelize.define("authentication", attributes, options);
}
