const { DataTypes } = require("sequelize");
const { sequelize } = require("../_helpers/db"); // Adjust the path as needed
const Brand = require("../Brand/Brand.model")(sequelize);
const Fregnance = require("../FregnanceFamily/Fregnance.model")(sequelize);

module.exports = model;

function generateId() {
  // Generates a random number between 10000 and 99999
  return `PROD-${Math.floor(10000 + Math.random() * 90000)}`;
}

function model(sequelize) {
  const Product = sequelize.define("Product", {
    product_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: generateId,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    brand_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Brand,
        key: "brand_id",
      },
    },
    Fregnance_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Fregnance,
        key: "Fregnance_id",
      },
    },
  });

  // Define associations
  Product.belongsTo(Brand, { as: "ProductBrand", foreignKey: "brand_id" });
  Product.belongsTo(Fregnance, {
    as: "ProductFregnance",
    foreignKey: "Fregnance_id",
  });

  return Product;
}
