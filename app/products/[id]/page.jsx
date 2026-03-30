import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductSlider from "@/components/ProductSlider";
import AddToCartBtn from "@/components/AddToCartBtn";

export default async function ProductPage({ params }) {

  await connectDB();

  // ✅ Next.js 16 fix
  const { id } = await params;

  const product = await Product.findById(id).lean();

  console.log("ID:", id);
  console.log("PRODUCT:", product);

  if (!product) {
    return (
      <div className="p-4 text-center">
        Product not found 😅
      </div>
    );
  }

  // ✅ support old + new images
  const images = product.images?.length
    ? product.images
    : product.image
    ? [product.image]
    : [];

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">

      {/* 🔥 SLIDER */}
      <ProductSlider images={images} />

      {/* 🔥 INFO */}
      <h1 className="text-2xl font-bold mt-4">
        {product.name}
      </h1>

      <p className="text-gray-600 mt-2">
        {product.description}
      </p>

      <p className="text-xl font-bold mt-3">
        ₹{product.price}
      </p>

      <p className="text-sm text-gray-500">
        Stock: {product.stock}
      </p>

      {/* 🔥 ADD TO CART */}
      <AddToCartBtn product={product} />

    </div>
  );
}