import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();

  const { phone } = await req.json();

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone });
  }

  return Response.json(user);
}