"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DeliveryProtected({ children }) {

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {

    const role = localStorage.getItem("role");

    if (role === "delivery") {
      setAllowed(true);
    } else {
      router.replace("/");
    }

    setLoading(false);

  }, []);

  if (loading) {
    return <p className="p-4">Checking access...</p>;
  }

  if (!allowed) return null;

  return children;
}