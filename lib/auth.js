import { connectDB } from "./db";
import User from "@/models/User";

export async function getUserFromReq(req) {

  await connectDB();

  const phone = req.headers.get("x-phone");

  if (!phone) return null;

  const user = await User.findOne({ phone });

  return user;
}


export async function requireAdmin(req) {

  const user = await getUserFromReq(req);

  if (!user || user.role !== "admin") {
    return false;
  }

  return true;
}


export async function requireDelivery(req) {

  const user = await getUserFromReq(req);

  if (!user || user.role !== "delivery") {
    return false;
  }

  return true;
}