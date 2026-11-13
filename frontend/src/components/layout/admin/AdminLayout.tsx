import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const AdminLayout = () => (
  <div className="flex min-h-screen bg-background text-foreground">
    <AdminSidebar />
    <div className="flex flex-1 flex-col">
      <AdminTopbar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;
