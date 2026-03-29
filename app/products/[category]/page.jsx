"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {

  const { category } = useParams();

  const [products, setProducts] = useState([]);

  useEffect(() => {

    fetch("/api/products?category=" + category)
      .then(res => res.json())
      .then(setProducts);

  }, []);

  return (

    <div>

      <h2>{category}</h2>

      {products.map(p => (

        <div key={p._id}>
          {p.name} - {p.price}
        </div>

      ))}

    </div>

  );

}