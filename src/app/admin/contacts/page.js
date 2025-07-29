"use client";
import { useEffect, useState } from "react";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
      } else {
        setError("Failed to load user contacts");
      }
    } catch {
      setError("Failed to load user contacts");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">User Contacts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : contacts.length === 0 ? (
        <p className="text-muted-foreground">No user contacts yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-border rounded-lg">
            <thead>
              <tr className="bg-accent text-accent-foreground">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Mobile</th>
                <th className="px-4 py-2 text-left">Message</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c._id} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{c.name}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.mobile}</td>
                  <td className="px-4 py-2 max-w-xs truncate">{c.message}</td>
                  <td className="px-4 py-2 text-sm text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 