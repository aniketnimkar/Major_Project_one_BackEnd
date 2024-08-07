const mongoose = require("mongoose");

const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  Credentials: true,
};
app.use(cors(corsOptions));

const { intializeDatabase } = require("./db/db.connect");
const Product = require("./models/product.models");

// Middleware to parse JSON request bodies
app.use(express.json());

intializeDatabase();

app.get("/", (req, res) => {
  res.send("This is express server");
});

// Creating data and sending data to backend

app.post("/products", async (req, res) => {
  try {
    const createProduct = new Product(req.body);
    const saveProduct = await createProduct.save();
    if (saveProduct) {
      res.status(201).json({
        message: "Data added successfully",
        createProduct: createProduct,
      });
    } else {
      res.status(401).json({ error: "An error occurred while adding data" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while creating data" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length > 0) {
      res.status(200).json({ message: "Product Found", product: products });
    } else {
      res.status(404).json({ error: "No products are found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occured while getting products." });
  }
});

// route for getting products by category
app.get("/products/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ genderType: category });
    if (products.length > 0) {
      res
        .status(200)
        .json({ message: `${category} products found`, products: products });
    } else {
      res.status(404).json({ error: `No ${category} products are found` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occured while getting  products" });
  }
});

app.get("/productDetails/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      res.status(200).json({ message: "Product found", product: product });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occured while getting  products" });
  }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
