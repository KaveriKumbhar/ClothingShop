"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Dummy hook for now; replace with real useCategories when available
function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);
  return { categories, loading, error };
}

export default function AdminCategoriesPage() {
  const { categories, loading, error } = useCategories();
  const [refresh, setRefresh] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("added")) {
      setMsg("Category added!");
      setTimeout(() => setMsg(""), 2000);
    }
  }, [searchParams]);

  async function refetch() {
    setRefresh(r => !r);
  }

  async function handleDelete(slug) {
    if (!confirm("Delete this category?")) return;
    setMsg("");
    const res = await fetch(`/api/categories/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setMsg("Category deleted!");
      refetch();
    } else {
      setMsg("Error deleting category");
    }
  }

  if (refresh) return <AdminCategoriesPage key={"refresh" + Date.now()} />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
      {msg && <div className="mb-4 text-green-700">{msg}</div>}
      <button
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => router.push("/admin/categories/add")}
      >
        Add Category
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.slug}>
                <td className="p-2">{category.name}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => router.push(`/admin/categories/edit/${category.slug}`)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(category.slug)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 