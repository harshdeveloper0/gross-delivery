"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cart, inc, dec, removeItem, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // ✅ total

  let total = 0;

  cart.forEach((i) => {
    total += i.price * i.qty;
  });

  let delivery = 0;

  if (total > 0 && total < 150) {
    delivery = 10;
  }

  const finalTotal = total + delivery;

  // ✅ autofill

  useEffect(() => {
    const phone = localStorage.getItem("phone");

    if (!phone) return;

    fetch("/api/users?phone=" + phone)
      .then((res) => res.json())
      .then((u) => {
        if (!u) return;

        setName(u.name || "");
        setPhone(u.phone || "");
        setAddress(u.address || "");
      });
  }, []);

  function loadRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
  // ✅ PLACE ORDER

 async function placeOrder() {

  const loaded = await loadRazorpay();

  if (!loaded) {
    alert("Razorpay failed to load");
    return;
  }

  if (!window.Razorpay) {
    alert("Razorpay not available");
    return;
  }

  const res = await fetch("/api/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: finalTotal,
    }),
  });

  const order = await res.json();

  const options = {
    key: "rzp_test_xxxxx", // hardcode
    amount: order.amount,
    currency: "INR",
    name: "QuickApp",
    order_id: order.id,

    handler: async function (response) {

      await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          total,
          delivery,
          finalTotal,
          paymentId: response.razorpay_payment_id,
          customer: { name, phone, address },
        }),
      });

      alert("Payment success");

    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

  return (
    <div className="max-w-3xl mx-auto p-4 pb-28">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 && <p className="text-gray-500">Cart empty hai 😅</p>}

      {cart.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between bg-white p-3 rounded mb-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
              {item.image ? (
                <img src={item.image} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gray-400">
                  No img
                </div>
              )}
            </div>

            <div>
              <p className="font-semibold text-sm">{item.name}</p>

              <p className="text-gray-600 text-sm">₹{item.price}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => dec(item._id)}
              className="bg-gray-200 px-2 rounded"
            >
              -
            </button>

            <span>{item.qty}</span>

            <button
              onClick={() => inc(item._id)}
              className="bg-gray-200 px-2 rounded"
            >
              +
            </button>

            <button
              onClick={() => removeItem(item._id)}
              className="text-red-500 text-lg ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-green-600 text-white p-4 flex justify-between items-center shadow-lg">
          <div>
            <p>Total: ₹{finalTotal}</p>
          </div>

          <button
            onClick={placeOrder}
            className="bg-white text-green-600 px-4 py-2 rounded font-semibold"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
