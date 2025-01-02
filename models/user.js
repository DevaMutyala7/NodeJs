const { getDb } = require("../utils/db");
const mongoDb = require("mongodb");

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
}

module.exports = User;
