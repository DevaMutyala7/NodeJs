const { DataTypes } = require("sequelize");

const { getDb } = require("../utils/db");

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    let db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => console.log("successfully inserted", result))
      .catch((err) => console.log("err while inserting", err));
  }

  static findAll() {
    let db = getDb();
    return db.collection("products").find().toArray();
  }
}

module.exports = Product;
