"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserDashboard() {
  const [counts, setCounts] = useState({ wishlist: 0, addresses: 0, orders: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
    fetchActivities();
  }, []);

  async function fetchOverview() {
    try {
      const [wishlistRes, addressesRes] = await Promise.all([
        fetch("/api/user/wishlist"),
        fetch("/api/user/addresses")
      ]);
      const wishlist = wishlistRes.ok ? await wishlistRes.json() : [];
      const addresses = addressesRes.ok ? await addressesRes.json() : [];
      // Try to fetch orders, but handle 404 gracefully
      let orders = null;
      try {
        const ordersRes = await fetch("/api/user/orders");
        if (ordersRes.ok) orders = await ordersRes.json();
      } catch {}
      setCounts({
        wishlist: Array.isArray(wishlist) ? wishlist.length : wishlist.length || 0,
        addresses: Array.isArray(addresses) ? addresses.length : addresses.length || 0,
        orders: Array.isArray(orders) ? orders.length : orders === null ? null : orders.length || 0
      });
    } catch {
      setError("Failed to load overview stats");
    } finally {
      setLoading(false);
    }
  }

  async function fetchActivities() {
    setActivitiesLoading(true);
    try {
      const res = await fetch("/api/user/activities");
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      } else {
        setActivities([]);
      }
    } catch {
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
      <div className={`grid grid-cols-1 sm:grid-cols-2${counts.orders !== null ? ' lg:grid-cols-3' : ''} gap-6 mb-12`}>
        <div className="bg-card rounded-xl shadow border border-border p-6 text-center">
          <h2 className="text-lg font-semibold text-primary mb-2">Wishlist</h2>
          <div className="text-4xl font-bold text-card-foreground">{loading ? "-" : counts.wishlist}</div>
        </div>
        <div className="bg-card rounded-xl shadow border border-border p-6 text-center">
          <h2 className="text-lg font-semibold text-primary mb-2">Addresses</h2>
          <div className="text-4xl font-bold text-card-foreground">{loading ? "-" : counts.addresses}</div>
        </div>
        {counts.orders !== null && (
          <div className="bg-card rounded-xl shadow border border-border p-6 text-center">
            <h2 className="text-lg font-semibold text-primary mb-2">Orders</h2>
            <div className="text-4xl font-bold text-card-foreground">{loading ? "-" : counts.orders}</div>
            <Link 
              href="/user/orders" 
              className="inline-block mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View All Orders →
            </Link>
          </div>
        )}
      </div>
      {error && <p className="text-destructive">{error}</p>}

      {/* Recent Activities Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        {activitiesLoading ? (
          <p>Loading...</p>
        ) : activities.length === 0 ? (
          <p className="text-muted-foreground">No recent activities.</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((activity) => (
              <li key={activity._id} className="bg-card rounded-lg p-4 border border-border shadow flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                <span className="font-medium">{renderActivityText(activity)}</span>
                <span className="ml-auto text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Helper to render activity text
function renderActivityText(activity) {
  switch (activity.type) {
    case "wishlist_add":
      return `Added product to wishlist`;
    case "wishlist_remove":
      return `Removed product from wishlist`;
    case "order_placed":
      return `Placed an order`;
    case "address_added":
      return `Added a new address`;
    case "address_updated":
      return `Updated an address`;
    case "address_deleted":
      return `Deleted an address`;
    default:
      return activity.type;
  }
} 