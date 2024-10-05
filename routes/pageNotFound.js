const express = require("express");
const path = require("path");

const router = express.Router();

const pathName = require("../utils/path");

router.use((req, res) => {
  res.status(404).sendFile(path.join(pathName, "views", "pageNotFound.html"));
});

module.exports = router;
