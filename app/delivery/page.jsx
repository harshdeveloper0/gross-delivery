"use client";

import DeliveryProtected from "@/components/protected/DeliveryProtected";
import { useEffect, useState } from "react";

export default function DeliveryPage() {
  const [orders, setOrders] = useState([]);

  const phone =
    typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  async function load() {
    if (!phone) return;

    const res = await fetch("/api/orders");
    const data = await res.json();

    const mine = data.filter((o) => o.deliveryId === phone);

    setOrders(mine);
  }

  useEffect(() => {
    load();

    const i = setInterval(load, 5000);

    return () => clearInterval(i);
  }, []);

  async function updateStatus(id, status) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    load();
  }

  return (
    <DeliveryProtected>
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Delivery Panel</h1>

        {orders.length === 0 && <p>No assigned orders</p>}

        {orders.map((o) => (
          <div key={o._id} className="bg-white p-4 rounded shadow mb-4">
            <p className="font-bold">{o.customer?.name}</p>

            <p className="text-sm">{o.customer?.phone}</p>

            <p className="text-sm">{o.customer?.address}</p>

            <div className="mt-2 text-sm">
              {o.items.map((i, idx) => (
                <div key={idx}>
                  {i.name} × {i.qty}
                </div>
              ))}
            </div>

            <div className="mt-2 font-bold">₹{o.finalTotal}</div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => updateStatus(o._id, "out")}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Out
              </button>

              <button
                onClick={() => updateStatus(o._id, "done")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Delivered
              </button>
            </div>
          </div>
        ))}
      </div>
    </DeliveryProtected>
  );
}
