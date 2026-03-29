"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [phone, setPhone] = useState("");

  const router = useRouter();

  async function login() {
    const res = await fetch(
      "/api/users?phone=" + phone
    );

    const user = await res.json();

    if (!user) {
      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          phone,
        }),
      });
    }

    localStorage.setItem("phone", phone);

    router.push("/");
  }

  return (
    <div className="p-4">

      <h1 className="text-xl mb-3">
        Login
      </h1>

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
        className="border p-2"
      />

      <button
        onClick={login}
        className="bg-green-500 text-white px-3 ml-2"
      >
        Login
      </button>
    </div>
  );
}