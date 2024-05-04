const { DataTypes } = require("sequelize");

module.exports = model;

function generateId() {
  // Generates a random number between 10000 and 99999
  return `BRAND-${Math.floor(100000 + Math.random() * 900000)}`;
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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Brand",
        key: "brand_id",
      },
    },
    Fregnance_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: "Fregnance",
        key: "Fregnance_id",
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    gender: {
      type: DataTypes.ENUM("Men", "Women", "Unisex"),
    },

    size: {
      type: DataTypes.STRING(20),
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    discount_price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
    },
    main_image: {
      type: DataTypes.STRING,
    },
    additional_images: {
      type: DataTypes.JSON,
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
