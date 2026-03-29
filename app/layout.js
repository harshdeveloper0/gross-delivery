import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-100">

        {/* ✅ Razorpay script सही तरीके से */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

        <CartProvider>
          <Navbar />

          <div className="max-w-6xl mx-auto p-4">
            {children}
          </div>

        </CartProvider>

      </body>
    </html>
  );
}