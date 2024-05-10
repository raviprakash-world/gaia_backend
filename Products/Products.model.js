const { DataTypes } = require("sequelize");

module.exports = model;

function generateId() {
  // Generates a random number between 10000 and 99999
  return `PROD-${Math.floor(100000 + Math.random() * 900000)}`;
}

function model(sequelize) {
  const attributes = {
    product_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: generateId,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Brands",
        key: "brand_id",
      },
    },
    Fregnance_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "Fregnances",
        key: "Fregnance_id",
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Men", "Women", "Unisex"),
      allowNull: false,
    },

    size: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    main_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_id: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
  };

  const options = {
    hooks: {
      beforeValidate(brand) {
        if (!brand.brand_id || brand.brand_id.startsWith("PROD-")) {
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

  return sequelize.define("products", attributes, options);
}
