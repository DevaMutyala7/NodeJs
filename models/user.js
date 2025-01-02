const { getDb } = require("../utils/db");
const mongoDb = require("mongodb");
const Product = require("./product");

const objectIdFunc = mongoDb.ObjectId.createFromHexString;
class User {
  constructor(userName, email) {
    this.userName = userName;
    this.email = email;
  }

  save() {
    let db = getDb();

    db.collection("users")
      .insertOne(this)
      .then((val) => {
        console.log("successfully inserted user", val);
      })
      .catch((err) => {
        console.log("Error while inserting user", err);
      });
  }

  static findUser(userId) {
    let db = getDb();

    return db
      .collection("users")
      .find({ _id: objectIdFunc(userId) })
      .next()
      .then((val) => {
        return val;
      })
      .catch((err) => {
        console.log("error while finding user", err);
      });
  }

  static addToCart(userId, product) {
    let db = getDb();
    let quantity = 1;
    let itemsTobeAdded = [];

    return db
      .collection("users")
      .find({ _id: userId })
      .next()
      .then((val) => {
        return val.cart.items;
      })
      .then((items) => {
        let itemIndex = items.findIndex((i) => i.productId == product);

        if (itemIndex >= 0) {
          quantity = items[itemIndex].quantity + 1;
          items[itemIndex].quantity = quantity;
          itemsTobeAdded = [...items];
        } else {
          itemsTobeAdded = [
            ...items,
            {
              productId: mongoDb.ObjectId.createFromHexString(product),
              quantity,
            },
          ];
        }

        return db.collection("users").updateOne(
          { _id: userId },
          {
            $set: {
              cart: {
                items: itemsTobeAdded,
              },
            },
          }
        );
      })
      .catch((err) => console.log("Err in add to cart", err));
  }

  static getCartItems(userId) {
    const db = getDb();

    return db
      .collection("users")
      .find({ _id: userId })
      .next()
      .then((val) => {
        console.log("items", val.cart.items);
        return val.cart.items;
      })
      .then((products) => {
        let productIds = products.map((item) => item.productId);
        return db
          .collection("products")
          .find({ _id: { $in: [...productIds] } })
          .toArray()
          .then((val) => {
            return val.map((item) => ({
              ...item,
              quantity: products.find(
                (i) => i.productId.toString() === item._id.toString()
              ).quantity,
            }));
          });
      })
      .then((items) => {
        return items;
      })
      .catch((err) => {
        console.log("err in getCartItems", err);
      });
  }
}

module.exports = User;
