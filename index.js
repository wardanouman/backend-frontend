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
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
}); 

app.get("/", (req, res) => {
  res.json("This is Get API");
});

app.post("/products", async (req, res) => {
  try {
    const newProductFields = req.body;
    const newProduct = new Product(newProductFields);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findOneAndDelete({ id: id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateProductFields = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { id: id },
      updateProductFields,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});



app.listen(5050, () => {
  console.log("Server is running on port 5050");
}); 
app.get("/about", (req, res) => {
  res.json("This is About API");
});