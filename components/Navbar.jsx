"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {

  const { cart } = useCart();
  const path = usePathname();

  const [phone, setPhone] = useState(null);
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPhone(localStorage.getItem("phone"));
    setRole(localStorage.getItem("role"));
  }, []);

  if (!mounted) return null;

  function logout() {
    localStorage.removeItem("phone");
    localStorage.removeItem("role");
    location.reload();
  }

  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  const isActive = (href) => path.startsWith(href);

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              className="text-2xl md:hidden"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>

            <Link href="/" className="text-xl font-bold text-green-600">
              QuickApp
            </Link>
          </div>

          {/* CENTER */}
          <div className="hidden md:flex gap-6 items-center ml-auto">

            {/* DELIVERY VIEW */}
            {role === "delivery" ? (
              <Link
                href="/delivery"
                className={`px-3 py-1 rounded ${
                  isActive("/delivery")
                    ? "bg-green-100 text-green-700 font-semibold"
                    : "hover:text-green-600"
                }`}
              >
                Delivery
              </Link>
            ) : (
              <>
                <Link
                  href="/"
                  className={isActive("/") ? "text-green-600 font-semibold" : ""}
                >
                  Home
                </Link>

                <Link
                  href="/orders"
                  className={isActive("/orders") ? "text-green-600 font-semibold" : ""}
                >
                  Orders
                </Link>

                <Link
                  href="/profile"
                  className={isActive("/profile") ? "text-green-600 font-semibold" : ""}
                >
                  Profile
                </Link>

                {role === "admin" && (
                  <Link
                    href="/admin"
                    className={`px-3 py-1 rounded ${
                      isActive("/admin")
                        ? "bg-green-100 text-green-700 font-semibold"
                        : "hover:text-green-600"
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 ml-6">

            <Link href="/cart" className="relative">
              🛒
              {count > 0 && (
                <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs px-1.5 rounded-full">
                  {count}
                </span>
              )}
            </Link>

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

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-40 transition ${
          open ? "bg-black/40 backdrop-blur-sm" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* SIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50
        bg-white/80 backdrop-blur-xl shadow-lg
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        <div className="p-4 flex justify-between items-center border-b">
          <b>Menu</b>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="flex flex-col gap-4 p-4">

          {role === "delivery" ? (
            <Link href="/delivery" onClick={() => setOpen(false)}>
              Delivery
            </Link>
          ) : (
            <>
              <Link href="/" onClick={() => setOpen(false)}>Home</Link>
              <Link href="/orders" onClick={() => setOpen(false)}>Orders</Link>

              {role === "admin" && (
                <Link href="/admin" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              )}

              <Link href="/profile" onClick={() => setOpen(false)}>
                Profile
              </Link>
            </>
          )}

          {phone ? (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="bg-green-600 text-white px-3 py-1 rounded text-center"
            >
              Login
            </Link>
          )}

        </div>

      </div>
    </>
  );
}