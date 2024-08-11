const mongoose = require("mongoose");
const { type } = require("os");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
    },
    productImageURL: {
      type: String,
    },
    productPrice: {
      type: Number,
    },
    productRating: {
      type: Number,
    },
    genderType: {
      type: String,
    },
    category: {
      type: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
