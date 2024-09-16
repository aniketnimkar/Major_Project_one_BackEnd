const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));

const { intializeDatabase } = require("./db/db.connect");
const Product = require("./models/product.models");
const Cart = require("./models/cart.models");
const Wishlist = require("./models/wishlist.models");
const Address = require("./models/address.models");

// Middleware to parse JSON request bodies
app.use(express.json());

intializeDatabase();

app.get("/", (req, res) => {
  res.send("This is an express server");
});

// Route to create a new product and save it in the database
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

// Route to get all products
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
      .json({ message: "An error occurred while getting products." });
  }
});

// Route to get products by category
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
      .json({ message: "An error occurred while getting products" });
  }
});

// Route to get product details by ID
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
      .json({ message: "An error occurred while getting products" });
  }
});

// Route for adding products to the cart
app.post("/products/addToCart", async (req, res) => {
  try {
    // Find the existing cart (there should only be one cart)
    let cart = await Cart.findOne();

    if (cart) {
      // If the cart exists, push the new product into the existing cart array
      cart.cart.push(req.body); // Add the new product to the existing cart
      const updatedCart = await cart.save(); // Save the updated cart
      res.status(200).json({
        message: "Product added to cart successfully",
        cart: updatedCart,
      });
    } else {
      // If no cart exists, create a new one
      cart = new Cart({
        cart: [req.body], // Create a new cart with the product
      });
      const newCart = await cart.save(); // Save the new cart
      res.status(201).json({
        message: "Cart created and product added successfully",
        cart: newCart,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while adding the product to the cart",
      error: error.message,
    });
  }
});

// route for put request
app.put("/product/updateQuantity/:id", async (req, res) => {
  try {
    // Find the cart
    let cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const id = req.params.id;
    const { quantity } = req.body;

    // Find the product in the cart by ID
    const productIndex = cart.cart.findIndex(
      (item) => item._id.toString() === id
    );

    if (productIndex !== -1) {
      if (quantity < 1) {
        // Remove the product from the cart if quantity is less than 1
        cart.cart.splice(productIndex, 1);
      } else {
        // Update the product quantity if it's valid
        cart.cart[productIndex].quantity = quantity;
      }

      // Save the updated cart
      const updatedCart = await cart.save();
      res.status(200).json({
        message:
          quantity < 1
            ? "Product removed successfully"
            : "Quantity updated successfully",
        cart: updatedCart,
      });
    } else {
      res.status(404).json({ error: "Product not found in cart" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update cart", details: error.message });
  }
});

// delete product from cart
app.delete("/product/deleteProduct/:id", async (req, res) => {
  try {
    let cart = await Cart.findOne(); // Assuming you have a Cart model and want to find the first cart
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const id = req.params.id;

    console.log("ID from params:", id);
    console.log("Cart contents:", cart.cart);

    // Find the index of the product in the cart by Id
    const productIndex = cart.cart.findIndex(
      (item) => item._id.toString() === id
    );

    if (productIndex !== -1) {
      // Remove the product from the cart
      cart.cart.splice(productIndex, 1);

      // Save the updated cart
      await cart.save();

      res.status(200).json({ message: "Product removed from cart", cart });
    } else {
      console.log("Product not found with ID:", id);
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error occurred while deleting the product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product" });
  }
});

app.post("/products/addToWishlist", async (req, res) => {
  try {
    // Find the existing wishlist (there should only be one wishlist)
    let wishlist = await Wishlist.findOne();

    if (wishlist) {
      // If the wishlist exists, push the new product into the existing wishlist array
      wishlist.wishlist.push(req.body); // Add the new product to the existing wishlist
      const updatedWishlist = await wishlist.save(); // Save the updated wishlist
      res.status(200).json({
        message: "Product added to wishlist successfully",
        wishlist: updatedWishlist,
      });
    } else {
      // If no cart exists, create a new one
      wishlist = new Wishlist({
        wishlist: req.body, // Create a new cart with the product
      });
      const newWishlist = await wishlist.save(); // Save the new cart
      res.status(201).json({
        message: "Wishlist created and product added successfully",
        wishlist: newWishlist,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while adding the product to the wishlist",
      error: error.message,
    });
  }
});

// delete from wishlist
app.delete("/product/deleteProductWishlist/:id", async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne(); // Assuming you have a Cart model and want to find the first cart
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    const id = req.params.id;

    // Find the index of the product in the cart by Id
    const productIndex = wishlist.wishlist.findIndex(
      (item) => item._id.toString() === id
    );

    if (productIndex !== -1) {
      // Remove the product from the wishlist
      wishlist.wishlist.splice(productIndex, 1);

      // Save the updated wishlist
      await wishlist.save();

      res
        .status(200)
        .json({ message: "Product removed from wishlist", wishlist });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product" });
  }
});

//address Api
//addresses POST API

app.post("/addresses/addAddress", async (req, res) => {
  try {
    let address = await Address.findOne();

    if (address) {
      address.address.push(req.body);
      const updatedAddress = await address.save();
      res.status(200).json({
        message: "Address uploaded successfully",
        address: updatedAddress,
      });
    } else {
      address = new Address({
        address: req.body,
      });
      const newAddress = await address.save();
      res.status(201).json({
        message: "Address created and added successfully",
        address: newAddress,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while adding address",
      error: error.message,
    });
  }
});

// route for address put request
app.put("/addresses/updateAddress/:id", async (req, res) => {
  try {
    // Find the address document
    let address = await Address.findOne();
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    const id = req.params.id;
    const updatedAddress = req.body;

    // Find the specific address in the array by ID
    const foundAddressIndex = address.address.findIndex((add) => add.id === id);

    if (foundAddressIndex !== -1) {
      // Update the properties of the found address
      address.address[foundAddressIndex] = {
        ...address.address[foundAddressIndex],
        ...updatedAddress,
      };

      // Save the updated address
      const updated = await address.save();
      res.status(200).json({
        message: "Address updated successfully",
        address: updated,
      });
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update Address", details: error.message });
  }
});

app.delete("/addresses/deleteAddress/:id", async (req, res) => {
  try {
    // Find the address document
    let address = await Address.findOne();
    if (!address) {
      return res.status(404).json({ error: "address not found" });
    }

    const id = req.params.id;

    // Find the index of the address in the addressess by Id
    const addressIndex = address.address.findIndex((add) => add.id === id);

    if (addressIndex !== -1) {
      // Remove the address from the addresses array
      address.address.splice(addressIndex, 1);

      // Save the updated wishlist
      await address.save();

      res
        .status(200)
        .json({ message: "address removed from addresses", address });
    } else {
      res.status(404).json({ error: "address not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting theaddress" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
