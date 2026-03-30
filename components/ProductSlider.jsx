"use client";

import { useState } from "react";

export default function ProductSlider({ images }) {

  const [index, setIndex] = useState(0);

  function next() {
    setIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }

  function prev() {
    setIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="h-60 bg-gray-100 flex items-center justify-center rounded">
        No images
      </div>
    );
  }

  return (
    <div className="relative">

      {/* IMAGE */}
      <img
        src={images[index]}
        className="w-full h-64 object-cover rounded-xl"
      />

      {/* LEFT */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 px-2 py-1 rounded shadow"
      >
        ◀
      </button>

      {/* RIGHT */}
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 px-2 py-1 rounded shadow"
      >
        ▶
      </button>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              i === index ? "bg-green-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

    </div>
  );
}