"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartBtn({ product }) {

  const { addToCart } = useCart();

  function handleAdd() {

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || "",
    });

    alert("Added to cart 🛒");
  }

  return (
    <button
      onClick={handleAdd}
      className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
    >
      Add to Cart
    </button>
  );
}