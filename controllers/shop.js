const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
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
        product: product.dataValues,
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
      console.log(
        "products//////////////////////////////",
        products.map((item) => item.dataValues)
      );
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products.map((item) => item.dataValues),
      });
    })
    .catch((err) => console.log("err in getCart", err));
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  let cartId;

  req.user
    .getCart()
    .then(({ dataValues }) => {
      cartId = dataValues.id;
      return CartItem.findOne({ where: { productId: productId } });
    })
    .then((cartProd) => {
      if (cartProd) {
        CartItem.update(
          { quantity: cartProd.quantity + 1 },
          { where: { productId: productId } }
        );
      } else {
        CartItem.create({
          quantity: 1,
          productId,
          cartId,
        });
      }
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log("err in postcart", err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
