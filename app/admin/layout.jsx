"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {

  const [open, setOpen] = useState(false);
  const path = usePathname();

  const menu = [
    { name: "Dashboard", href: "/admin" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Products", href: "/admin/products" },
  ];

  return (

    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r hidden md:flex flex-col">

        <div className="p-5 font-bold text-xl text-green-600">
          QuickAdmin
        </div>

        <div className="flex flex-col gap-2 px-3">

          {menu.map((m) => (

            <Link
              key={m.href}
              href={m.href}
              className={`px-3 py-2 rounded-lg text-sm transition
                ${
                  path === m.href
                    ? "bg-green-100 text-green-700 font-semibold"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {m.name}
            </Link>

          ))}

        </div>

      </div>



      {/* MOBILE MENU */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}



      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">

          <button
            className="md:hidden text-xl"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

          <h1 className="font-semibold">
            Admin Panel
          </h1>

        </div>



        {/* CONTENT */}
        <div className="p-6">

          {children}

        </div>

      </div>

    </div>

  );

}