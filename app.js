const express = require("express");

const product = require("./routes/products");
const shop = require("./routes/shop");
const pageNotFound = require("./routes/pageNotFound");

const bodyparser = require("body-parser");

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));

app.use(product);
app.use(shop);
app.use(pageNotFound);

app.listen(3000);
