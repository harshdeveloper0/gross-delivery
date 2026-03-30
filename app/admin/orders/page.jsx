"use client";

import { useEffect, useState } from "react";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  async function load() {

    const res = await fetch("/api/orders",);
    const data = await res.json();

    const priority = {
      pending: 1,
      preparing: 2,
      out: 3,
      done: 4,
      rejected: 5,
    };

    const sorted = data.sort((a, b) => {

      if (priority[a.status] !== priority[b.status]) {
        return priority[a.status] - priority[b.status];
      }

      return new Date(b.createdAt) - new Date(a.createdAt);

    });

    setOrders(sorted);

  }

  useEffect(() => {
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);

  async function updateStatus(id, status) {

    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    load();

  }

  async function updateDelivery(id, deliveryId) {

    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, deliveryId }),
    });

    load();

  }

  const filtered = orders.filter(o => {

    const matchSearch =
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.phone?.includes(search) ||
      o.orderId?.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all" || o.status === filter;

    return matchSearch && matchFilter;

  });

  return (

    <div className="w-full">

      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">

        <input
          placeholder="Search name / phone / order id"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out">Out</option>
          <option value="done">Done</option>
          <option value="rejected">Rejected</option>
        </select>

      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500">No orders found</p>
      )}

      {filtered.map(o => (

        <OrderCard
          key={o._id}
          o={o}
          updateStatus={updateStatus}
          updateDelivery={updateDelivery}
        />

      ))}

    </div>

  );

}



function OrderCard({ o, updateStatus, updateDelivery }) {

  const [deliveryPhone, setDeliveryPhone] = useState("");

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    preparing: "bg-blue-100 text-blue-700",
    out: "bg-purple-100 text-purple-700",
    done: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (

    <div className="bg-white p-4 rounded-xl shadow-sm border mb-4 hover:shadow-md transition">

      <div className="flex justify-between items-center">

        <div>
          <p className="font-semibold text-lg">
            {o.customer?.name}
          </p>
          <p className="text-sm text-gray-500">
            {o.customer?.phone}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-400">
            #{o.orderId || o._id.slice(-6)}
          </p>
          <span className={`px-2 py-1 rounded text-xs ${statusColor[o.status]}`}>
            {o.status}
          </span>
        </div>

      </div>

      <p className="text-sm mt-2 text-gray-600">
        {o.customer?.address}
      </p>

      <div className="mt-3 text-sm space-y-1">
        {o.items?.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span>{item.name} × {item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-between font-semibold">
        <span>Total</span>
        <span>₹{o.finalTotal}</span>
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">

        <input
          placeholder="Delivery Phone"
          value={deliveryPhone}
          onChange={(e) => setDeliveryPhone(e.target.value)}
          className="border px-2 py-1 rounded text-sm flex-1"
        />

        <button
          onClick={() => updateDelivery(o._id, deliveryPhone)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Assign
        </button>

      </div>

      <div className="mt-3 flex gap-2 flex-wrap">

        <Btn onClick={() => updateStatus(o._id, "pending")}>Pending</Btn>
        <Btn onClick={() => updateStatus(o._id, "preparing")}>Preparing</Btn>
        <Btn onClick={() => updateStatus(o._id, "out")}>Out</Btn>
        <Btn onClick={() => updateStatus(o._id, "done")}>Done</Btn>
        <Btn red onClick={() => updateStatus(o._id, "rejected")}>Reject</Btn>

      </div>

    </div>

  );

}



function Btn({ children, onClick, red }) {

  return (

    <button
      onClick={onClick}
      className={`px-3 py-1 rounded text-sm ${
        red ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      {children}
    </button>

  );

}