const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://devateja58:s94h2d4DN2kh463r@cluster0.0duas.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log("error in connection", err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw "No Database Found";
};

module.exports = { mongoConnect, getDb };
