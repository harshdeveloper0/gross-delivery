import { connectDB } from "@/lib/db";
import Delivery from "@/models/Delivery";
import { requireDelivery } from "@/lib/auth";

export async function GET(req) {

  const user = await getUserFromReq(req);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // admin → full
  if (user.role === "admin") {
    const data = await Order.find();
    return Response.json(data);
  }

  // delivery → only assigned
  if (user.role === "delivery") {
    const data = await Order.find({
      deliveryId: user.phone,
    });

    return Response.json(data);
  }

  return Response.json([], { status: 403 });
}


export async function POST(req) {

  await connectDB();

  const body = await req.json();

  const d = await Delivery.create(body);

  return Response.json(d);

}