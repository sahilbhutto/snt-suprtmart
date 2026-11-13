import { Link } from "react-router-dom";

const AdminSidebar = () => (
  <aside className="hidden w-60 shrink-0 border-e border-border bg-surface p-4 md:block">
    <div className="mb-8 text-lg font-bold">SNT Admin</div>
    <nav className="grid gap-1 text-sm">
      <Link to="/admin" className="rounded-lg px-3 py-2 hover:bg-muted">
        Dashboard
      </Link>
      <Link to="/admin/products" className="rounded-lg px-3 py-2 hover:bg-muted">
        Products
      </Link>
      <Link to="/admin/orders" className="rounded-lg px-3 py-2 hover:bg-muted">
        Orders
      </Link>
    </nav>
  </aside>
);

export default AdminSidebar;
