import { connectDB } from "@/lib/db";
import Product from "@/models/Product";


// GET
export async function GET() {

  await connectDB();

  const data = await Product.find();

  return Response.json(data);
}


// ADD
export async function POST(req) {

  await connectDB();

  const body = await req.json();

  console.log("PRODUCT BODY:", body); // 🔥 debug

  const p = await Product.create({

    name: body.name,

    price: Number(body.price),

    stock: Number(body.stock),

    category: body.category,

    // ✅ FIX
    description: body.description || "",

    // ✅ MULTI IMAGE SUPPORT
    images: body.images || (body.image ? [body.image] : []),

  });

  return Response.json(p);
}


// UPDATE
export async function PATCH(req) {

  await connectDB();

  const body = await req.json();

  const { id, ...rest } = body;

  await Product.findByIdAndUpdate(
    id,
    {
      ...rest,

      price: Number(rest.price),
      stock: Number(rest.stock),

      // ✅ FIX
      images: rest.images || (rest.image ? [rest.image] : []),
    }
  );

  return Response.json({ ok: true });
}


// DELETE
export async function DELETE(req) {

  await connectDB();

  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  await Product.findByIdAndDelete(id);

  return Response.json({ ok: true });
}