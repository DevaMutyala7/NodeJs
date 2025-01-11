const mongoose = require("mongoose");
const Product = require("./product");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  products: [
    {
      product: {
        type: Object,
        required: true,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
