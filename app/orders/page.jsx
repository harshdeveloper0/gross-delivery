"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {

  const [orders, setOrders] = useState([]);



  async function load() {

    const phone = localStorage.getItem("phone");

    if (!phone) return;

    const res = await fetch("/api/orders?phone=" + phone);
    const data = await res.json();

    // latest first
    const sorted = data.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    setOrders(sorted);

  }



  // 🔄 auto refresh
  useEffect(() => {

    load();

    const i = setInterval(load, 5000);

    return () => clearInterval(i);

  }, []);



  return (

    <div className="max-w-3xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">
        Your Orders
      </h1>



      {orders.length === 0 && (

        <p className="text-gray-500">
          No orders yet 😅
        </p>

      )}



      {orders.map((o) => (

        <div
          key={o._id}
          className="bg-white p-4 rounded-xl shadow-sm border mb-4"
        >

          {/* STATUS */}

          <div className="mb-2">

            <span
              className={`px-2 py-1 rounded text-sm font-semibold
                ${getColor(o.status)}
              `}
            >
              {o.status}
            </span>

          </div>



          {/* ITEMS */}

          <div className="space-y-1">

            {o.items.map((i, idx) => (

              <div
                key={idx}
                className="flex justify-between text-sm"
              >

                <span>
                  {i.name} × {i.qty}
                </span>

                <span>
                  ₹{i.price * i.qty}
                </span>

              </div>

            ))}

          </div>
          {["pending", "preparing"].includes(o.status) && (

 <button
  onClick={async () => {

    const ok = confirm("Cancel order?");
    if (!ok) return;

    try {

      await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: o._id,
          status: "cancelled",
        }),
      });

      alert("Order cancelled"); // 🔥 feedback
      load();

    } catch (e) {
      alert("Something went wrong");
    }

  }}
  className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
>
  Cancel Order
</button>

)}



          {/* TOTAL */}

          <div className="mt-2 font-bold">
            ₹{o.finalTotal}
          </div>

        </div>

      ))}

    </div>

  );

}



// 🎨 status color

function getColor(status) {

  switch (status) {

    case "pending":
      return "bg-gray-200 text-gray-700";

    case "preparing":
      return "bg-blue-100 text-blue-700";

    case "out":
      return "bg-yellow-100 text-yellow-700";

    case "done":
      return "bg-green-100 text-green-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    case "cancelled":
      return "bg-red-200 text-red-800"; // 🔥 FIX

    default:
      return "bg-gray-100";

  }

}