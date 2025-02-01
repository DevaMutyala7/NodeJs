const mongoose = require("mongoose");
const mongodb = require("mongodb");
const path = require("path");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const objectId = mongodb.ObjectId.createFromHexString;

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const MONGODB_URI =
  "mongodb+srv://devateja58:s94h2d4DN2kh463r@cluster0.0duas.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: "My Node Js Application",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
    store: store,
  })
);

// app.use((req, res, next) => {
//   if (req.get("Cookie") && req.get("Cookie").includes("loggedIn")) {
//     const cookie = req.get("Cookie").split(";")[0].split("=")[1];

//     const isLoggedIn = cookie.toLowerCase() === "true";

//     req.isLoggedIn = isLoggedIn;
//   } else {
//     req.isLoggedIn = false;
//   }
//   next();
// });

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
app.use(authRoutes);
app.use(errorController.get404);

mongoose.connect(MONGODB_URI).then((client) => {
  app.listen(3000);
});
