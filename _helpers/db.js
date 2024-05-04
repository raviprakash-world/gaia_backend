const config = require("config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = db = {};

(async function initialize() {
  // create db if it doesn't already exist
  const { host, port, user, password, database } = config.database;

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, {
      host,
      dialect: "mysql",
      dialectOptions: {
        // useUTC: false,
        // timezone: "+05:30", // for reading the data
      },
      // timezone: "+05:30", // for writing the data
      logging: process.env.LOGGING === "TRUE" ? true : false,
    });
    //export connection object
    db.sequelize = sequelize;

    // init models and add them to the exported db object
    db.Authentication = require("../auth/auth.model")(sequelize);

    db.Role = require("../roleTable/role.model")(sequelize);
    db.Color = require("../Color/Color.model")(sequelize);
    db.Category = require("../Category/Category.model")(sequelize);
    db.Fregnance = require("../FregnanceFamily/Fregnance.model")(sequelize);
    db.Brand = require("../Brand/Brand.model")(sequelize);

    // sync all models with database
    await sequelize.sync();
    console.log(
      "API connected to the database successfully and all the models synced"
    );
  } catch (e) {
    console.error("Database error: ", e);
  }
})();
