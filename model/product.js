import mongoose from "mongoose";

const productSchema = new mongoose.Schema({ 
     id: 
     { 
        type: String, required: true },
     name:
      { type: String, 
      },
     image: 
     { type: String,
     },
     price: { type: Number,
      },
     description: { type: String,
      },
   });

const Product = mongoose.model("Product", productSchema);
export default Product;