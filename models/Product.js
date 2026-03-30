import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,

  price: Number,

  stock: Number,

  category: String,

  
  description: String,

  
  images: [String],

}, { timestamps: true });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);