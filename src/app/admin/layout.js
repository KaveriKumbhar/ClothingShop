import Navbar from "../../../components/Navbar";
import AdminSidebar from "../../../components/AdminSidebar";
import ProtectedAdminLayout from "../../../components/ProtectedAdminLayout";

export default function AdminLayout({ children }) {
  return (
    <ProtectedAdminLayout>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-8 bg-background overflow-y-auto">{children}</main>
      </div>
    </ProtectedAdminLayout>
  );
} 