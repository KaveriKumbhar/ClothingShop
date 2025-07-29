"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AddressForm from "../../../../../components/AddressForm.js";

export default function AddAddressPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleSubmit(formData) {
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMsg("Address added successfully!");
        setTimeout(() => router.push("/user/address"), 1000);
      } else {
        const data = await res.json();
        setMsg(data.error || "Error adding address");
      }
    } catch (err) {
      setMsg("Error adding address");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Add New Address</h2>
        <button
          onClick={() => router.push("/user/address")}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Addresses
        </button>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded ${msg.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {msg}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <AddressForm
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Add Address"
        />
      </div>
    </div>
  );
} 