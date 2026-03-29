"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  async function load() {
    const o = await fetch("/api/orders");
    const odata = await o.json();

    const p = await fetch("/api/products");
    const pdata = await p.json();

    setOrders(odata);
    setProducts(pdata);
  }

  useEffect(() => {
    load();
  }, []);

  // stats
  const totalOrders = orders.length;

  const revenue = orders.reduce(
    (sum, o) => (o.status === "done" ? sum + o.finalTotal : sum),
    0,
  );

  const pending = orders.filter((o) => o.status === "pending").length;
  const preparing = orders.filter((o) => o.status === "preparing").length;
  const out = orders.filter((o) => o.status === "out").length;
  const done = orders.filter((o) => o.status === "done").length;
  const rejected = orders.filter((o) => o.status === "rejected").length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* STATS GRID */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <Card title="Total Orders" value={totalOrders} />
        <Card title="Revenue" value={"₹" + revenue} />
        <Card title="Pending" value={pending} />
        <Card title="Preparing" value={preparing} />
        <Card title="Out" value={out} />
        <Card title="Done" value={done} />
        <Card title="Rejected" value={rejected} />
        <Card title="Products" value={products.length} />
      </div>

      {/* QUICK ACTION */}

      <div className="mt-6 flex gap-4">
        <a
          href="/admin/orders"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Manage Orders
        </a>

        <a
          href="/admin/products"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Manage Products
        </a>
      </div>
    </div>
  );
}

// reusable card
function Card({ title, value }) {

  return (

    <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-2xl font-bold mt-1">
        {value}
      </h2>

    </div>

  );

}
