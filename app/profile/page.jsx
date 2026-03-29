"use client";

import { useEffect, useState } from "react";

export default function Profile() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");



  useEffect(() => {

    const p = localStorage.getItem("phone");

    if (!p) return;

    fetch("/api/users?phone=" + p)
      .then(res => res.json())
      .then(u => {

        if (!u) return;

        setName(u.name || "");
        setPhone(u.phone || "");
        setAddress(u.address || "");

      });

  }, []);




  async function save() {

    await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        address,
      }),
    });

    alert("Saved");

  }



  return (

    <div className="p-4">

      <h1 className="text-xl mb-3">
        Profile
      </h1>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border p-2 w-full my-2"
      />

      <input
        placeholder="Phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="border p-2 w-full my-2"
      />

      <input
        placeholder="Address"
        value={address}
        onChange={e => setAddress(e.target.value)}
        className="border p-2 w-full my-2"
      />

      <button
        onClick={save}
        className="bg-green-500 text-white px-3 py-2"
      >
        Save
      </button>

    </div>

  );

}