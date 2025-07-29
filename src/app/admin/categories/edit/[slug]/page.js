"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AddOrEditCategoryPage() {
  const params = useParams();
  const isEdit = !!params?.slug;
  const [form, setForm] = useState({ name: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isEdit) {
      async function fetchCategory() {
        const res = await fetch(`/api/categories/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setForm({ name: data.name });
        }
      }
      fetchCategory();
    }
  }, [isEdit, params]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    let res;
    if (isEdit) {
      res = await fetch(`/api/categories/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setLoading(false);
    if (res.ok) {
      setMsg(isEdit ? "Category updated!" : "Category added!");
      setTimeout(() => router.push("/admin/categories?" + (isEdit ? "updated=1" : "added=1")), 1000);
    } else {
      const data = await res.json();
      setMsg(data.error || (isEdit ? "Error updating category" : "Error adding category"));
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? "Edit Category" : "Add Category"}</h2>
      {msg && <div className="mb-4 text-green-700">{msg}</div>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Category Name" className="border p-2 rounded" required />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? (isEdit ? "Saving..." : "Saving...") : (isEdit ? "Update Category" : "Add Category")}</button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => router.push("/admin/categories")}>Cancel</button>
        </div>
      </form>
    </div>
  );
} 