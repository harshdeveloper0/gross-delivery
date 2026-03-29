"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function HomePage() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const { cart } = useCart();
  const router = useRouter();



  async function load() {

    setLoading(true);

    const p = await fetch("/api/products");
    const pdata = await p.json();
    setProducts(pdata);

    const c = await fetch("/api/categories");
    const cdata = await c.json();
    setCategories(cdata);

    setLoading(false);

  }

  useEffect(() => {
    load();
  }, []);



  const filtered = products.filter(p => {

    const matchCategory =
      selected === "" || p.category === selected;

    const matchSearch =
      p.name
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchCategory && matchSearch;

  });



  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);



  return (

    <div className="p-4 pb-24">

      {/* 🔍 SEARCH */}

      <div className="mb-4">

        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />

      </div>



      {/* 🧩 CATEGORY */}

      <div className="flex gap-2 overflow-x-auto mb-4">

        <button
          onClick={() => setSelected("")}
          className={`px-4 py-1 rounded-full text-sm border transition ${
            selected === ""
              ? "bg-green-600 text-white"
              : "bg-white"
          }`}
        >
          All
        </button>

        {categories.map(c => (

          <button
            key={c._id}
            onClick={() => setSelected(c.name)}
            className={`px-4 py-1 rounded-full text-sm border whitespace-nowrap transition ${
              selected === c.name
                ? "bg-green-600 text-white"
                : "bg-white"
            }`}
          >
            {c.name}
          </button>

        ))}

      </div>



      {/* 🧱 PRODUCTS */}

      {loading ? (

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {[...Array(8)].map((_, i) => (

            <div
              key={i}
              className="h-40 bg-gray-200 animate-pulse rounded-lg"
            />

          ))}

        </div>

      ) : (

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {filtered.map(p => (

            <ProductCard
              key={p._id}
              product={p}
            />

          ))}

        </div>

      )}



      {/* 🛒 BOTTOM BAR */}

      {count > 0 && (

        <div className="fixed bottom-0 left-0 w-full bg-green-600 text-white p-4 flex justify-between items-center shadow-lg">

          <div>
            <p className="text-sm">
              {count} items | ₹{total}
            </p>
          </div>

          <button
            onClick={() => router.push("/cart")}
            className="bg-white text-green-600 px-4 py-2 rounded font-semibold"
          >
            View Cart
          </button>

        </div>

      )}

    </div>

  );

}