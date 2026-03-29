import { connectDB } from "@/lib/db";
import Delivery from "@/models/Delivery";

export async function GET() {

  await connectDB();

  const data = await Delivery.find();

  return Response.json(data);

}


export async function POST(req) {

  await connectDB();

  const body = await req.json();

  const d = await Delivery.create(body);

  return Response.json(d);

}