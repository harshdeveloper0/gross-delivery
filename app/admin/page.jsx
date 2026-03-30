"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminProtected from "@/components/protected/AdminProtected";

export default function AdminDashboard() {

  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ mount + auth check
  useEffect(() => {

    setMounted(true);

    const role = localStorage.getItem("role");

    if (role === "admin") {
      setAuthorized(true);
    } else {
      alert("Access denied");
      router.replace("/");
    }

  }, []);

  // ✅ load data only if authorized
  useEffect(() => {

    if (!authorized) return;

    async function load() {
      try {

        const [oRes, pRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
        ]);

        const odata = await oRes.json();
        const pdata = await pRes.json();

        setOrders(odata || []);
        setProducts(pdata || []);

      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();

  }, [authorized]);

  // ❌ hydration + auth safe
  if (!mounted) return null;

  if (!authorized) return null;

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // ✅ stats
  const totalOrders = orders.length;

  const revenue = orders.reduce(
    (sum, o) =>
      o.status === "done" ? sum + o.finalTotal : sum,
    0
  );

  const pending = orders.filter(o => o.status === "pending").length;
  const preparing = orders.filter(o => o.status === "preparing").length;
  const out = orders.filter(o => o.status === "out").length;
  const done = orders.filter(o => o.status === "done").length;
  const rejected = orders.filter(o => o.status === "rejected").length;

  return (
   

    <div className="p-4 max-w-6xl mx-auto">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Card title="Total Orders" value={totalOrders} />
        <Card title="Revenue" value={"₹" + revenue} />
        <Card title="Pending" value={pending} />
        <Card title="Preparing" value={preparing} />
        <Card title="Out" value={out} />
        <Card title="Done" value={done} />
        <Card title="Rejected" value={rejected} />
        <Card title="Products" value={products.length} />

      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex flex-wrap gap-4">

        <button
          onClick={() => router.push("/admin/orders")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Manage Orders
        </button>

        <button
          onClick={() => router.push("/admin/products")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Manage Products
        </button>

      </div>

    </div>

  );

}


// ✅ reusable card
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