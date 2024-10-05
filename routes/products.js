const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const pathName = require("../utils/path");

router.get("/add-product", (req, res) => {
  res.sendFile(path.join(pathName, "views", "product.html"));
});

router.post("/add-product", (req, res) => {
  fs.writeFileSync("product.txt", req.body["product"]);
  res.redirect("/");
});

module.exports = router;
