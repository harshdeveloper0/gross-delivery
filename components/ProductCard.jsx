"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {

  const { cart, addToCart, removeItem } = useCart();
  const router = useRouter();

  const item = cart.find(p => p._id === product._id);


  return (

    <div className="bg-white rounded-xl shadow-sm border p-2 hover:shadow-md transition">

      {/* IMAGE */}
      <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">

        {product.image ? (
          <img
            src={product.image}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400">
            No image
          </span>
        )}

      </div>


      {/* NAME */}
      <h3 className="text-sm font-semibold mt-2">
        {product.name}
      </h3>


      {/* PRICE */}
      <p className="font-bold text-lg">
        ₹{product.price}
      </p>


      {/* BUTTONS */}

      {product.stock <= 0 ? (

        <button
          disabled
          className="w-full mt-2 py-1 rounded bg-gray-300 text-gray-600"
        >
          Out
        </button>

      ) : item ? (

        <div className="flex gap-2 mt-2">

          <button
            onClick={() => router.push("/cart")}
            className="flex-1 bg-yellow-500 text-white py-1 rounded font-semibold"
          >
            Buy
          </button>

          <button
            onClick={() => removeItem(product._id)}
            className="bg-red-500 text-white px-2 rounded"
          >
            ✕
          </button>

        </div>

      ) : (

        <button
          onClick={() => addToCart(product)}
          className="w-full mt-2 py-1 rounded bg-green-600 text-white font-semibold"
        >
          Add
        </button>

      )}

    </div>

  );

}