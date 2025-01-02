const mongoDb = require("mongodb");
const { getDb } = require("../utils/db");

const objectId = mongoDb.ObjectId.createFromHexString;

class Product {
  constructor(title, price, imageUrl, description, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save(userId) {
    let db = getDb();
    let document = { ...this };
    if (userId) {
      document = { ...this, userid: userId };
    }
    return db
      .collection("products")
      .insertOne(document)
      .then((result) => console.log("successfully inserted", result))
      .catch((err) => console.log("err while inserting", err));
  }

  static findByUserId(userId) {
    let db = getDb();
    return db
      .collection("products")
      .find({ userid: userId })
      .toArray()
      .then((products) => {
        return products;
      });
  }

  static findAll() {
    let db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      });
  }

  static findOne(prodId) {
    let db = getDb();
    return db
      .collection("products")
      .find({ _id: prodId })
      .next()
      .then((val) => {
        return val;
      })
      .catch((err) => console.log("err", err));
  }

  static deleteProduct(prodId) {
    let db = getDb();
    return db.collection("products").deleteOne({
      _id: mongoDb.ObjectId.createFromHexString(prodId),
    });
  }

  updateProduct(prodId) {
    let db = getDb();

    return db.collection("products").updateOne(
      { _id: mongoDb.ObjectId.createFromHexString(prodId) },
      {
        $set: this,
      }
    );
  }
}

module.exports = Product;
