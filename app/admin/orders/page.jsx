"use client";

import { useEffect, useState } from "react";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");



  async function load() {

    const res = await fetch("/api/orders");
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
      o.customer?.phone?.includes(search);

    const matchFilter =
      filter === "all" || o.status === filter;

    return matchSearch && matchFilter;

  });



  return (

    <div>

      <h1 className="text-2xl font-bold mb-4">Orders</h1>



      {/* SEARCH */}
      <div className="flex gap-3 mb-4">

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out">Out</option>
          <option value="done">Done</option>
          <option value="rejected">Rejected</option>
        </select>

      </div>



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

  return (

    <div className="bg-white p-4 rounded shadow mb-4">

      <p className="font-bold">{o.customer?.name}</p>
      <p className="text-sm">{o.customer?.phone}</p>
      <p className="text-sm">{o.customer?.address}</p>



      {/* ASSIGN DELIVERY */}
      <div className="mt-2 flex gap-2">

        <input
          placeholder="Delivery Phone"
          value={deliveryPhone}
          onChange={(e) => setDeliveryPhone(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />

        <button
          onClick={() => updateDelivery(o._id, deliveryPhone)}
          className="bg-blue-600 text-white px-2 rounded text-sm"
        >
          Assign
        </button>

      </div>



      {/* STATUS */}
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
        red ? "bg-red-600 text-white" : "bg-gray-200"
      }`}
    >
      {children}
    </button>

  );

}