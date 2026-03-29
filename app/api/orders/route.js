import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";



// ✅ GET
export async function GET(req) {

  await connectDB();

  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  let query = {};

  if (phone) {
    query["customer.phone"] = phone;
  }

  const data = await Order.find(query).sort({
    createdAt: -1,
  });

  return Response.json(data);
}



// ✅ POST (FIXED)
export async function POST(req) {

  await connectDB();

  const body = await req.json();


  // 🔥 VALIDATION
  if (!body.items || body.items.length === 0) {
    return Response.json(
      { error: "Cart empty" },
      { status: 400 }
    );
  }


  // 🔥 STOCK CHECK + REDUCE
  for (const item of body.items) {

    const product = await Product.findById(item._id);

    if (!product) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < item.qty) {
      return Response.json(
        { error: `${product.name} out of stock` },
        { status: 400 }
      );
    }

    // reduce
    product.stock -= item.qty;
    await product.save();

  }


  // ✅ create order AFTER stock safe
  const order = await Order.create(body);

  return Response.json(order);

}



// ✅ PATCH (same but cleaner)
export async function PATCH(req) {

  await connectDB();

  const body = await req.json();
  const { id, status, deliveryId } = body;

  const order = await Order.findById(id);

  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }


  // 🔴 USER CANCEL
  if (status === "cancelled") {

    // ❌ prevent invalid cancel
    if (["out", "done", "rejected"].includes(order.status)) {
      return Response.json(
        { error: "Cannot cancel now" },
        { status: 400 }
      );
    }

    // 🔥 restore stock
    for (const item of order.items) {

      await Product.findByIdAndUpdate(
        item._id,
        {
          $inc: { stock: item.qty }
        }
      );

    }

  }


  // 🔴 ADMIN REJECT (already added but keep safe)
  if (status === "rejected" && order.status !== "rejected") {

    for (const item of order.items) {

      await Product.findByIdAndUpdate(
        item._id,
        {
          $inc: { stock: item.qty }
        }
      );

    }

  }


  const update = {};

  if (status) update.status = status;
  if (deliveryId) update.deliveryId = deliveryId;

  await Order.findByIdAndUpdate(id, update);

  return Response.json({ ok: true });

}