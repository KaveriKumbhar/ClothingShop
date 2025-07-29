"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function UserAddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      const res = await fetch("/api/user/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      } else {
        setMsg("Error loading addresses");
      }
    } catch (err) {
      setMsg("Error loading addresses");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(addressSlug) {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      const res = await fetch(`/api/user/addresses?slug=${addressSlug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMsg("Address deleted!");
        fetchAddresses();
      } else {
        setMsg("Error deleting address");
      }
    } catch (err) {
      setMsg("Error deleting address");
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <Link
          href="/user/address/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Address
        </Link>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded ${msg.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/user/address/edit/${address.slug}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(address.slug)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No addresses found. Add your first address to get started.</p>
          <Link
            href="/user/address/add"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Your First Address
          </Link>
        </div>
      )}
    </div>
  );
} 