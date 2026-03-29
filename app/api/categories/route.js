import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

const defaults = [
  { name: "Fruits" },
  { name: "Vegetables" },
  { name: "Snacks" },
  { name: "Drinks" },
  { name: "Dairy" },
  { name: "Bread" },
  { name: "Tea" },
  { name: "Coffee" },
  { name: "Rice" },
  { name: "Atta" },
  { name: "Oil" },
  { name: "Masala" },
  { name: "Ice Cream" },
  { name: "Frozen" },
  { name: "Cleaning" },
  { name: "Personal Care" },
  { name: "Baby" },
  { name: "Pet" },
  { name: "Stationery" },
  { name: "Electronics" },
];

export async function GET() {

  await connectDB();

  // force reset every time (for dev)

  await Category.deleteMany({});

  await Category.insertMany(defaults);

  const data = await Category.find();

  return Response.json(data);
}


// POST
export async function POST(req) {

  await connectDB();

  const body = await req.json();

  const c = await Category.create(body);

  return Response.json(c);

}