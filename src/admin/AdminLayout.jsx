
import { Outlet, NavLink } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <h2 className="admin-logo">
          daraz<span>.</span>
          <small>ADMIN PANEL</small>
        </h2>

        <nav className="admin-nav">
          <NavLink to="/admin" end>
            📊 Dashboard
          </NavLink>

          <NavLink to="/admin/products">
            📦 Products
          </NavLink>

          <NavLink to="/admin/add-product">
            ➕ Add Product
          </NavLink>

          <NavLink to="/admin/orders">
            🛒 Orders
          </NavLink>

          <NavLink to="/admin/users">
            👥 Customers
          </NavLink>

          <NavLink to="/admin/categories">
            🏷️ Categories
          </NavLink>

          <NavLink to="/admin/settings">
            ⚙️ Settings
          </NavLink>
        </nav>

        <NavLink to="/" className="back-store">
          ← Back to Store
        </NavLink>

      </aside>

      <main className="admin-main">

        <header className="admin-header">
          <h2>Admin Dashboard</h2>
          <span>Administrator 👤</span>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>

      </main>

    </div>
  );
}

export default AdminLayout;
