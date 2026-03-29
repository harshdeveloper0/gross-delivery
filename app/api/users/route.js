import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  const user = await User.findOne({ phone });

  return Response.json(user);
}

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const exist = await User.findOne({
    phone: body.phone,
  });

  if (exist) {
    exist.name = body.name || exist.name;
    exist.address = body.address || exist.address;

    await exist.save();

    return Response.json(exist);
  }

  const user = await User.create(body);

  return Response.json(user);
}