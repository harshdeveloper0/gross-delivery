import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({

  name: String,

  price: Number,

  category: String,

  stock: {
    type: Number,
    default: 0,
  },

  image: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);