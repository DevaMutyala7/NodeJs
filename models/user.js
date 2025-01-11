const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.deleteCart = function () {
  this.cart = { items: [] };
  return this.save();
};

userSchema.methods.deleteCartItem = function (prodId) {
  let newCart = this.cart.items.filter(
    (cp) => cp.productId.toString() !== prodId.toString()
  );

  let updatedCart = {
    items: newCart,
  };

  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.addToCart = function (product) {
  let cartItemIndex = this.cart.items.findIndex(
    (cp) => cp.productId.toString() === product._id.toString()
  );
  let newQuantity = 1;
  let newCartItems = [...this.cart.items];

  if (cartItemIndex >= 0) {
    newQuantity = this.cart.items[cartItemIndex].quantity + 1;
    newCartItems[cartItemIndex].quantity = newQuantity;
  } else {
    newCartItems.push({ productId: product._id, quantity: newQuantity });
  }

  let updatedCart = {
    items: newCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
