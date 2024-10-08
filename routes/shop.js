const express = require("express");
const path = require("path");
const router = express.Router();

const productRouter = require("../routes/products");
const products = productRouter.products;

router.get("/", (req, res) => {
  res.render("shop", { products });
});

module.exports = router;
