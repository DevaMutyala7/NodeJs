const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("book-store", "root", "Devateja@7798", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
