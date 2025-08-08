"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AddressForm from "../../../../../../components/AddressForm.js";

export default function EditAddressPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [address, setAddress] = useState(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchAddress() {
      try {
        const res = await fetch(`/api/user/addresses/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setAddress(data);
        } else {
          setMsg("Address not found");
        }
      } catch (err) {
        setMsg("Error loading address");
      } finally {
        setInitialLoading(false);
      }
    }
    fetchAddress();
  }, [params.slug]);

  async function handleSubmit(formData) {
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`/api/user/addresses/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMsg("Address updated successfully!");
        setTimeout(() => router.push("/user/address"), 1000);
      } else {
        const data = await res.json();
        setMsg(data.error || "Error updating address");
      }
    } catch (err) {
      setMsg("Error updating address");
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!address) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Address Not Found</h2>
          <p className="text-gray-600 mb-4">The address you are looking for does not exist.</p>
          <button
            onClick={() => router.push("/user/address")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Addresses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Edit Address</h2>
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
          initialData={address}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Update Address"
        />
      </div>
    </div>
  );
} 