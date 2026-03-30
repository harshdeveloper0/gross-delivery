import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,

  role: {
    type: String,
    default: "user", // user / admin / delivery
  },
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);