"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {

  const { cart } = useCart();

  const [phone, setPhone] = useState(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);


  useEffect(() => {

    setMounted(true);

    if (typeof window !== "undefined") {
      setPhone(localStorage.getItem("phone"));
    }

  }, []);


  if (!mounted) return null;


  function logout() {
    localStorage.removeItem("phone");
    location.reload();
  }


  // ✅ total items count
  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );


  return (

    <>

      {/* TOP BAR */}

      <div className="bg-white border-b sticky top-0 z-50">

        <div className="max-w-6xl mx-auto flex items-center justify-between p-3">

          {/* MENU ICON */}
          <button
            className="text-2xl md:hidden"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>


          {/* LOGO */}
          <Link
            href="/"
            className="text-xl font-bold text-green-600"
          >
            QuickApp
          </Link>


          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-6 items-center">

            <Link href="/">Home</Link>

            <Link href="/cart" className="relative">

              🛒 Cart

              {count > 0 && (
                <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs px-1.5 rounded-full">
                  {count}
                </span>
              )}

            </Link>

            <Link href="/orders">Orders</Link>

            <Link href="/admin">Admin</Link>
            <Link href="/profile">profile</Link>

          </div>


          {/* RIGHT */}
          <div>

            {phone ? (

              <button
                onClick={logout}
                className="hidden md:block bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>

            ) : (

              <Link
                href="/login"
                className="hidden md:block bg-green-600 text-white px-3 py-1 rounded"
              >
                Login
              </Link>

            )}

          </div>

        </div>

      </div>



      {/* BACKDROP */}
      <div
        className={`fixed inset-0 z-40 transition
        ${open ? "bg-black/40 backdrop-blur-sm" : "pointer-events-none"}
        `}
        onClick={() => setOpen(false)}
      />


      {/* SIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50
        bg-white/70 backdrop-blur-xl shadow-lg
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        <div className="p-4 flex justify-between">
          <b>Menu</b>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>


        <div className="flex flex-col gap-4 p-4">

          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex justify-between items-center"
          >
            <span>Cart</span>

            {count > 0 && (
              <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                {count}
              </span>
            )}

          </Link>

          <Link href="/orders" onClick={() => setOpen(false)}>
            Orders
          </Link>

          <Link
            href="/admin"
            onClick={() => setOpen(false)}
          >
            Admin
          </Link>

          {phone && (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Logout
            </button>
          )}

        </div>

      </div>

    </>

  );

}