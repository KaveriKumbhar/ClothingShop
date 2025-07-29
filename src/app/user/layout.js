import Navbar from "../../../components/Navbar";
import UserSidebar from "../../../components/UserSidebar";
import ProtectedUserLayout from "../../../components/ProtectedUserLayout";

export default function Layout({ children }) {
  return (
    <ProtectedUserLayout>
      <div className="flex min-h-screen">
        <UserSidebar />
        <main className="flex-1 p-4 sm:p-8 bg-background overflow-y-auto">{children}</main>
      </div>
    </ProtectedUserLayout>
  );
} 