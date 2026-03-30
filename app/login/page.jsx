"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const [phone, setPhone] = useState("");
  const router = useRouter();

  async function login() {

    if (!phone) {
      alert("Enter phone");
      return;
    }

    const res = await fetch("/api/auth/login", {
      
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    const user = await res.json();

    localStorage.setItem("phone", user.phone);
    localStorage.setItem("role", user.role);

    router.push("/");
  }

  return (

    <div className="flex items-center justify-center h-screen">

      <div className="bg-white p-6 rounded shadow w-80">

        <h1 className="text-xl font-bold mb-4">
          Login
        </h1>

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <button
          onClick={login}
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          Login
        </button>

      </div>

    </div>

  );
}