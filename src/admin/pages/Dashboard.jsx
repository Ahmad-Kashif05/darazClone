
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const API = "http://localhost:5000";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          `${API}/api/admin/dashboard`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Dashboard loading failed");
        }

        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `Rs. ${data.stats.totalRevenue.toLocaleString()}`,
      icon: "💰",
      color: "#e8f8ee",
    },
    {
      title: "Total Orders",
      value: data.stats.totalOrders,
      icon: "📦",
      color: "#e8f0ff",
    },
    {
      title: "Total Products",
      value: data.stats.totalProducts,
      icon: "🛍️",
      color: "#fff0e8",
    },
    {
      title: "Total Customers",
      value: data.stats.totalCustomers,
      icon: "👥",
      color: "#f3eaff",
    },
  ];

  return (
    <div className="dashboard">

      <div className="dashboard-heading">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome to your Daraz admin panel.</p>
        </div>

        <Link to="/admin/add-product" className="dashboard-add-btn">
          + Add New Product
        </Link>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <div className="stat-card" key={item.title}>
            <div
              className="stat-icon"
              style={{ background: item.color }}
            >
              {item.icon}
            </div>

            <p>{item.title}</p>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      <div className="stats-grid secondary-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fff4dc" }}>
            ⏳
          </div>
          <p>Pending Orders</p>
          <h2>{data.stats.pendingOrders}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e8f8ee" }}>
            ✅
          </div>
          <p>Delivered Orders</p>
          <h2>{data.stats.deliveredOrders}</h2>
        </div>
      </div>

      <div className="recent-orders">
        <div className="section-heading">
          <h2>Recent Orders</h2>
          <Link to="/admin/orders">View All</Link>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Products</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.recentOrders.length > 0 ? (
                data.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6).toUpperCase()}</td>
                    <td>{order.customer.name}</td>
                    <td>{order.customer.phone}</td>
                    <td>
                      {order.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </td>
                    <td>
                      Rs. {order.totalAmount.toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={`status ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="recent-orders">
        <div className="section-heading">
          <h2>Low Stock Products</h2>
          <Link to="/admin/products">Manage Products</Link>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {data.lowStockProducts.length > 0 ? (
                data.lowStockProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>Rs. {product.price.toLocaleString()}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">All products have sufficient stock.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
