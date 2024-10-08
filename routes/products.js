const express = require("express");
const path = require("path");

const router = express.Router();
const pathName = require("../utils/path");

const products = [];

router.get("/add-product", (req, res) => {
  res.render("product", { prod: products, docTitle: "Product Page" });
});

router.post("/add-product", (req, res) => {
  const { title, price, description } = req.body;
  products.push({ title, price, description });
  console.log("prod", products);
  res.redirect("/");
});

exports.router = router;
exports.products = products;
