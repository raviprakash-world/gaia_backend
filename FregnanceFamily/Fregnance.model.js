const { DataTypes } = require("sequelize");

module.exports = model;

function generateId() {
  // Generates a random number between 10000 and 99999
  return `FRG-${Math.floor(100000 + Math.random() * 900000)}`;
}

function model(sequelize) {
  const attributes = {
    Fregnance_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: generateId, // Set the custom ID as default value
    },
    Fregnance_name: { type: DataTypes.STRING, allowNull: false },
    image_url: { type: DataTypes.STRING, allowNull: false },
  };

  const options = {
    hooks: {
      beforeValidate(fregnance) {
        if (
          !fregnance.Fregnance_id ||
          fregnance.Fregnance_id.startsWith("FRG-")
        ) {
          fregnance.Fregnance_id = generateId();
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {
      withHash: { attributes: {} },
    },
  };

  return sequelize.define("fregnance", attributes, options);
}
