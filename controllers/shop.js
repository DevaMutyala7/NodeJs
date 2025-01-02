const mongoDb = require("mongodb");
const User = require("../models/user");
const Product = require("../models/product");

const objectId = mongoDb.ObjectId.createFromHexString;

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findOne(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title || "New Product",
        path: "/products",
      });
    })
    .catch((err) => console.log("err in getting product", err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log("err", err));
};

exports.getCart = (req, res, next) => {
  User.getCartItems(req.user._id)
    .then((items) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: items,
      });
    })
    .catch((err) => console.log("err in getCart", err));
};

exports.postCart = (req, res, next) => {
  const userId = req.user._id;
  const product = req.body.product;

  User.addToCart(userId, product).then(() => {
    res.redirect("/cart");
  });
};

// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId, (product) => {
//     Cart.deleteProduct(prodId, product.price);
//     res.redirect("/cart");
//   });
// };

// exports.getOrders = (req, res, next) => {
//   res.render("shop/orders", {
//     path: "/orders",
//     pageTitle: "Your Orders",
//   });
// };

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
