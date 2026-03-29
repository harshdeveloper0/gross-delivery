"use client";

import { useEffect, useState } from "react";

export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const [editId, setEditId] = useState(null);

  const [uploading, setUploading] = useState(false);



  async function load() {

    const p = await fetch("/api/products");
    const pdata = await p.json();
    setProducts(pdata);

    const c = await fetch("/api/categories");
    const cdata = await c.json();
    setCategories(cdata);

  }


  useEffect(() => {
    load();
  }, []);



  async function upload(e) {

    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: reader.result,
        }),
      });

      const data = await res.json();

      setImage(data.url);

      setUploading(false);

    };

  }



  async function add() {

    if (uploading) return;

    await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        stock,
        image,
        category,
      }),
    });

    reset();
    load();

  }



  async function update() {

    await fetch("/api/products", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editId,
        name,
        price,
        stock,
        image,
        category,
      }),
    });

    reset();
    load();

  }



  async function del(id) {

    await fetch("/api/products?id=" + id, {
      method: "DELETE",
    });

    load();

  }



  function edit(p) {

    setEditId(p._id);

    setName(p.name);
    setPrice(p.price);
    setStock(p.stock);
    setImage(p.image);
    setCategory(p.category);

  }



  function reset() {

    setEditId(null);

    setName("");
    setPrice("");
    setStock("");
    setImage("");
    setCategory("");

  }



  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Admin Products
      </h1>



      <div className="flex gap-2 flex-wrap mb-4">

        <input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border p-2"
        />


        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2"
        >

          <option value="">
            Select Category
          </option>

          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}

        </select>



        <input
          type="file"
          onChange={upload}
        />



        {editId ? (

          <button
            onClick={update}
            className="bg-blue-500 text-white px-3"
          >
            Update
          </button>

        ) : (

          <button
            onClick={add}
            disabled={uploading}
            className="bg-green-600 text-white px-3"
          >

            {uploading ? "Uploading..." : "Add"}

          </button>

        )}

      </div>



      <div className="grid grid-cols-3 gap-4">

        {products.map((p) => (

          <div
            key={p._id}
            className="border p-3 rounded"
          >

            {p.image && (
              <img
                src={p.image}
                className="h-24 w-full object-cover mb-2"
              />
            )}

            <b>{p.name}</b>

            <p>₹{p.price}</p>

            <p>stock: {p.stock}</p>

            <p>cat: {p.category}</p>

            <button
              onClick={() => edit(p)}
              className="text-blue-500 mr-2"
            >
              edit
            </button>

            <button
              onClick={() => del(p._id)}
              className="text-red-500"
            >
              delete
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}