
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/useCart";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function formatPrice(price) {
  return `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;
}

function OrderSuccess() {
  const location = useLocation();
  const { cart, cartCount, removeFromCart } = useCart();

  const order =
    location.state?.order ||
    (() => {
      try {
        return JSON.parse(localStorage.getItem("lastOrder")) || null;
      } catch {
        return null;
      }
    })();

  useEffect(() => {
    if (!order) return;

    const orderedIds = new Set(
      (order.items || []).map((item) =>
        String(
          item.product?._id ||
          item.product ||
          item.productId ||
          item._id ||
          item.id ||
          ""
        )
      )
    );

    cart.forEach((item) => {
      if (orderedIds.has(String(item.id))) {
        removeFromCart(item.id);
      }
    });
  }, [order, cart, removeFromCart]);

  return (
    <>
      <Navbar cartCount={cartCount} />

      <main className="success-page">
        <section className="success-card">
          <div className="success-check">✓</div>

          <h1>
            {order
              ? "Order Placed Successfully!"
              : "No Order Found"}
          </h1>

          <p>
            {order
              ? "Thank you for shopping with us. Your order has been received."
              : "Abhi koi order details available nahi hain. Aap products browse kar sakte hain."}
          </p>

          {order && (
            <div className="order-details">
              <h3>Order Details</h3>

              <p>
                <strong>Order ID:</strong>{" "}
                {order._id || order.id || "Confirmed"}
              </p>

              <p>
                <strong>Total:</strong>{" "}
                {formatPrice(
                  order.totalAmount ??
                  order.total ??
                  0
                )}
              </p>

              <p>
                <strong>Payment Method:</strong>{" "}
                {order.paymentMethod || "Cash on Delivery"}
              </p>

              <p>
                <strong>Order Status:</strong>{" "}
                {order.status || "Pending"}
              </p>

              {order.customer?.name && (
                <p>
                  <strong>Customer:</strong>{" "}
                  {order.customer.name}
                </p>
              )}

              {order.createdAt && (
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString("en-PK")}
                </p>
              )}
            </div>
          )}

          <div className="success-actions">
            <Link to="/" className="success-btn">
              Continue Shopping
            </Link>

            <Link
              to="/products"
              className="success-btn secondary"
            >
              View Products
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default OrderSuccess;
