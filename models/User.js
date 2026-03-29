import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

  phone: String,

  name: String,

  address: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);