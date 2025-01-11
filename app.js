const mongoose = require("mongoose");
const mongodb = require("mongodb");
const path = require("path");

const objectId = mongodb.ObjectId.createFromHexString;

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findOne({ _id: objectId("67791919ee1766402276e6cf") })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log("err in assigning user", err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://devateja58:s94h2d4DN2kh463r@cluster0.0duas.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((client) => {
    app.listen(3000);
  });
