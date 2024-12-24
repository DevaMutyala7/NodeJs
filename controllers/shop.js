const Product = require("../models/product");
const CartItem = require("../models/cart-item");
const { where } = require("sequelize");

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
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.dataValues?.title || "New Product",
        path: "/products",
      });
    })
    .catch((err) => console.log("err", err));
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
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    });
};

exports.postCart = async (req, res, next) => {
  let quantity = 1;
  let prodId = req.body.productId;
  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;

      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length) {
        product = products[0];
      }

      if (product) {
        quantity = product.cartItem.quantity + 1;
        return product;
      }

      return Product.findByPk(prodId);
    })
    .then((product) => {
      console.log("product to be added", product);
      return fetchedCart.addProduct(product, { through: { quantity } });
    })
    .then((data) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log("Error in getting cart", err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  let newQuantity;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product = products[0];

      if (product) {
        newQuantity = product.cartItem.quantity - 1;

        if (newQuantity > 0) {
          CartItem.update(
            { quantity: newQuantity },
            { where: { productId: prodId } }
          );
        } else {
          if (newQuantity === 0) {
            CartItem.destroy({ where: { productId: prodId } });
          }
        }
      }
      res.redirect("/cart");
    });
};

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
