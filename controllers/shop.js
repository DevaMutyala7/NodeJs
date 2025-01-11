const mongoDb = require("mongodb");
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

const objectId = mongoDb.ObjectId.createFromHexString;

exports.getProducts = (req, res, next) => {
  Product.find()
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
  Product.findOne({ _id: prodId })
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
  Product.find()
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
  User.findById(req.user._id)
    .select("cart.items")
    .populate("cart.items.productId")
    .then(({ cart }) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cart.items,
      });
    })
    .catch((err) => console.log("err in getCart", err));
};

exports.postCart = (req, res, next) => {
  const product = req.body.product;

  Product.findById(product)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteCartItem(prodId).then(() => {
    res.redirect("/cart");
  });
};

exports.createOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      let cart = user.cart.items;
      let orders = cart.map((item) => {
        return {
          quantity: item.quantity,
          product: { ...item.productId },
        };
      });

      let newOrder = new Order({
        userId: req.user._id,
        products: orders,
      });

      return newOrder.save();
    })
    .then(() => {
      req.user.deleteCart();
    })
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log("error in creating order", err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id }).then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  });
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
