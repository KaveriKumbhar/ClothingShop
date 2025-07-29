"use client";
import { useState, useEffect } from "react";
import useProducts from "../../../../hooks/useProducts";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminProductsPage() {
  const { products, loading, error } = useProducts();
  const [refresh, setRefresh] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("added")) {
      setMsg("Product added!");
      setTimeout(() => setMsg(""), 2000);
    }
  }, [searchParams]);

  async function refetch() {
    setRefresh(r => !r);
  }

  async function handleDelete(slug) {
    if (!confirm("Delete this product?")) return;
    setMsg("");
    const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setMsg("Product deleted!");
      refetch();
    } else {
      setMsg("Error deleting product");
    }
  }

  if (refresh) return <AdminProductsPage key={"refresh" + Date.now()} />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      {msg && <div className="mb-4 text-green-700">{msg}</div>}
      <button
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => router.push("/admin/products/add")}
      >
        Add Product
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
              <th className="p-2">Price</th>
              <th className="p-2">Image</th>
              <th className="p-2">Category</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.slug}>
                <td className="p-2">{product.name}</td>
                <td className="p-2">₹{product.price}</td>
                <td className="p-2">
                  <img src={product.image?.startsWith("/") || product.image?.startsWith("http") ? product.image : "/default.jpg"} alt={product.name} className="h-12 w-12 object-cover rounded" />
                </td>
                <td className="p-2">{product.category}</td>
                <td className="p-2 flex gap-2">
                  {product.slug && (
                    <button onClick={() => router.push(`/admin/products/edit/${product.slug}`)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                  )}
                  <button onClick={() => handleDelete(product.slug)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 