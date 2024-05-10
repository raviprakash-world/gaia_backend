const { DataTypes } = require("sequelize");

module.exports = model;

function generateId() {
  // Generates a random number between 10000 and 99999
  return `BRAND-${Math.floor(100000 + Math.random() * 900000)}`;
}

function model(sequelize) {
  const attributes = {
    brand_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: generateId,
    },
    brand_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    logo: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
  };

  const options = {
    hooks: {
      beforeValidate(brand) {
        if (!brand.brand_id || brand.brand_id.startsWith("BRAND-")) {
          brand.brand_id = generateId();
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

  return sequelize.define("brand", attributes, options);
}
