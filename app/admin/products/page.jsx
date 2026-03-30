"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");

  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 🔥 LOAD DATA
  async function load() {

    const p = await api("/api/products");
    const pdata = await p.json();
    setProducts(pdata);

    const c = await api("/api/categories");
    const cdata = await c.json();
    setCategories(cdata);
  }

  useEffect(() => {
    load();
  }, []);

  // 🔥 MULTI IMAGE UPLOAD
  async function upload(e) {

    const files = Array.from(e.target.files);

    if (!files.length) return;

    setUploading(true);

    let uploaded = [];

    for (let file of files.slice(0, 4)) {

      const reader = new FileReader();

      const base64 = await new Promise((res) => {
        reader.onload = () => res(reader.result);
        reader.readAsDataURL(file);
      });

      const r = await api("/api/upload", {
        method: "POST",
        body: JSON.stringify({ file: base64 }),
      });

      const data = await r.json();

      uploaded.push(data.url);
    }

    setImages(uploaded);
    setUploading(false);
  }

  // 🔥 ADD
  async function add() {

    if (uploading) return;

    await api("/api/products", {
      method: "POST",
      body: JSON.stringify({
        name,
        price,
        stock,
        category,
        description,
        images,
      }),
    });

    reset();
    load();
  }

  // 🔥 UPDATE
  async function update() {

    await api("/api/products", {
      method: "PATCH",
      body: JSON.stringify({
        id: editId,
        name,
        price,
        stock,
        category,
        description,
        images,
      }),
    });

    reset();
    load();
  }

  // 🔥 DELETE
  async function del(id) {

    await api("/api/products?id=" + id, {
      method: "DELETE",
    });

    load();
  }

  // 🔥 EDIT
  function edit(p) {

    setEditId(p._id);

    setName(p.name);
    setPrice(p.price);
    setStock(p.stock);
    setCategory(p.category);

    setDescription(p.description || "");
    setImages(p.images || []);
  }

  // 🔥 RESET
  function reset() {

    setEditId(null);

    setName("");
    setPrice("");
    setStock("");
    setCategory("");

    setDescription("");
    setImages([]);
  }

  return (

    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        Admin Products
      </h1>

      {/* 🔥 FORM */}
      <div className="flex flex-wrap gap-2 mb-4">

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border p-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2"
        >
          <option value="">Category</option>

          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />

        {/* IMAGE UPLOAD */}
        <input type="file" multiple onChange={upload} />

        {/* PREVIEW */}
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <img key={i} src={img} className="w-16 h-16 object-cover rounded" />
          ))}
        </div>

        {/* BUTTON */}
        {editId ? (
          <button
            onClick={update}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Update
          </button>
        ) : (
          <button
            onClick={add}
            disabled={uploading}
            className="bg-green-600 text-white px-4 py-2"
          >
            {uploading ? "Uploading..." : "Add"}
          </button>
        )}

      </div>

      {/* 🔥 PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {products.map((p) => (

          <div key={p._id} className="bg-white border p-3 rounded">

            {/* IMAGE */}
            {p.images?.[0] && (
              <img
                src={p.images[0]}
                className="h-24 w-full object-cover mb-2"
              />
            )}

            <b>{p.name}</b>

            <p>₹{p.price}</p>

            <p className="text-sm text-gray-500">
              {p.description}
            </p>

            <p className="text-xs">
              stock: {p.stock}
            </p>

            <p className="text-xs">
              cat: {p.category}
            </p>

            <div className="mt-2 flex gap-2">

              <button
                onClick={() => edit(p)}
                className="text-blue-500"
              >
                Edit
              </button>

              <button
                onClick={() => del(p._id)}
                className="text-red-500"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}