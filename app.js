const express = require("express");
const path = require("path");

const routes = require("./routes/products");
const products = routes.products;
const productRoute = routes.router;
const shop = require("./routes/shop");
const pageNotFound = require("./routes/pageNotFound");

const bodyparser = require("body-parser");

const app = express();

app.set("view engine", "pug");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(productRoute);
app.use(shop);
app.use(pageNotFound);

app.listen(3000);
