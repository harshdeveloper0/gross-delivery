"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ProductCard({ product }) {

  const { cart, addToCart, removeItem } = useCart();

  // ✅ FIX: old + new image support
  const img = product.images?.[0] || product.image;

  // ✅ check if already in cart
  const inCart = cart.find(p => p._id === product._id);

  return (

    <div className="bg-white rounded-xl shadow-sm border p-2 hover:shadow-md transition">

      {/* 🔥 IMAGE */}
      <Link href={`/products/${product._id}`}>

        <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">

          {img ? (

            <img
              src={img}
              className="w-full h-full object-cover"
              alt={product.name}
            />

          ) : (

            <span className="text-gray-400 text-sm">
              No image
            </span>

          )}

        </div>

      </Link>


      {/* 🔥 NAME */}
      <h3 className="text-sm font-semibold mt-2 line-clamp-2">
        {product.name}
      </h3>


      {/* 🔥 DESCRIPTION */}
      {product.description && (
        <p className="text-xs text-gray-500 line-clamp-2">
          {product.description}
        </p>
      )}


      {/* 🔥 PRICE */}
      <p className="font-bold text-lg mt-1">
        ₹{product.price}
      </p>


      {/* 🔥 STOCK */}
      <p className="text-xs text-gray-500">
        Stock: {product.stock}
      </p>


      {/* 🔥 BUTTONS */}
      <div className="flex gap-2 mt-2">

        {/* BUY */}
        <button

          disabled={product.stock <= 0}

          onClick={() => addToCart(product)}

          className={`flex-1 py-1 rounded-lg text-sm font-semibold
            ${
              product.stock > 0
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-600"
            }
          `}
        >

          {product.stock > 0 ? "Buy" : "Out"}

        </button>


        {/* REMOVE */}
        {inCart && (
          <button
            onClick={() => removeItem(product._id)}
            className="px-2 bg-red-500 text-white rounded-lg text-sm"
          >
            ✕
          </button>
        )}

      </div>

    </div>
  );
}