import mongoose from "mongoose";

const DeliverySchema = new mongoose.Schema({

  name: String,

  phone: String,

  password: String,

  online: {
    type: Boolean,
    default: true
  }

});

export default mongoose.models.Delivery ||
  mongoose.model("Delivery", DeliverySchema);