const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

// /admin/add-product => GET
router.get("/add-product", isAuthenticated, adminController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

// // /admin/products => GET
router.get("/products", adminController.getAdminProducts);

router.get(
  "/edit-product/:productId",
  isAuthenticated,
  adminController.getEditProduct
);

router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
