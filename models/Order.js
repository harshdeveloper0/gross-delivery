import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({

  items: [
    {
      name: String,
      price: Number,
      qty: Number,
      productId: String,
    },
  ],

  total: Number,

  delivery: Number,

  finalTotal: Number,


  customer: {
    name: String,
    phone: String,
    address: String,
  },


  // ✅ delivery boy id
  deliveryId: {
    type: String,
    default: null,
  },


  status: {
    type: String,
    default: "pending",
    enum: [
      "pending",
      "accepted",
      "preparing",
      "out",
      "done",
      "cancel",
    ],
  },


  createdAt: {
    type: Date,
    default: Date.now,
  },

});


export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);