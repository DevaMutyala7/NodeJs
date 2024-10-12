const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-app", "root", "Devateja@7798", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
