"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeliveryLogin() {

  const [phone, setPhone] = useState("");

  const router = useRouter();


  async function login() {

    const res = await fetch(
      "/api/delivery?phone=" + phone
    );

    const user = await res.json();

    if (!user) {

      alert("Not found");

      return;

    }

    localStorage.setItem(
      "delivery",
      phone
    );

    router.push("/delivery");

  }


  return (

    <div className="p-4">

      <h1>Delivery Login</h1>

      <input
        placeholder="Phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
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