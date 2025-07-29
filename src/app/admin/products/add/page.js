"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AddOrEditProductPage() {
  const params = useParams();
  const isEdit = !!params?.slug;
  const [form, setForm] = useState({ name: "", price: "", image: "", category: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef();
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEdit) {
      async function fetchProduct() {
        const res = await fetch(`/api/products/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name,
            price: data.price,
            image: data.image,
            category: data.category,
          });
          setImagePreview(data.image);
        }
      }
      fetchProduct();
    }
  }, [isEdit, params]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const payload = { ...form, price: Number(form.price) };
    let res;
    if (isEdit) {
      res = await fetch(`/api/products/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setLoading(false);
    if (res.ok) {
      setMsg(isEdit ? "Product updated!" : "Product added!");
      setTimeout(() => router.push("/admin/products?" + (isEdit ? "updated=1" : "added=1")), 1000);
    } else {
      let data;
      try {
        data = await res.json();
      } catch (err) {
        setMsg("Server error. Please try again later.");
        return;
      }
      setMsg(data.error || (isEdit ? "Error updating product" : "Error adding product"));
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMsg("");
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/products/upload", {
      method: "POST",
      body: formData,
    });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      setForm(f => ({ ...f, image: data.filePath }));
      setImagePreview(data.filePath);
      setMsg("Image uploaded!");
    } else {
      setMsg("Image upload failed");
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? "Edit Product" : "Add Product"}</h2>
      {msg && <div className="mb-4 text-green-700">{msg}</div>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" step="0.01" className="border p-2 rounded" required />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="border p-2 rounded"
          disabled={uploading}
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded border mx-auto" />
        )}
        <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading || uploading}>{loading ? (isEdit ? "Saving..." : "Saving...") : uploading ? "Uploading..." : (isEdit ? "Update Product" : "Add Product")}</button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => router.push("/admin/products")}>Cancel</button>
        </div>
      </form>
    </div>
  );
} 