import express from "express";
import Product from "./model/product.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns/promises";
import cors from "cors";

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection failed:", error));

app.get("/products", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}); 

app.get("/", (req, res) => {
  res.json("This is Get API");
});

app.post("/products", async (req, res) => {
  try {
    console.log("Incoming product data:", req.body);
    
    // Auto-generate an id if the frontend didn't provide one to satisfy 'required: true'
    const productData = {
      ...req.body,
      id: req.body.id || Date.now().toString()
    };

    const newProduct = new Product(productData);
    await newProduct.save();
    console.log("Product added successfully:", newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Attempting to delete product with ID: ${id}`);
    const deletedProduct = await Product.findOneAndDelete({ id: id });
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log(`Product deleted: ${JSON.stringify(deletedProduct)}`);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateProductFields = req.body;
    console.log(`Attempting to update product ID: ${id} with data:`, updateProductFields);
    
    // Fixed: using findOneAndUpdate with your custom schema's { id: id }
    const updatedProduct = await Product.findOneAndUpdate(
      { id: id },
      updateProductFields,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("Product updated successfully:", updatedProduct);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.listen(5050, () => {
  console.log("Server is running on port 5050");
}); 

app.get("/about", (req, res) => {
  res.json("This is About API");
});