
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Checkout.css";

function formatPrice(price) {
  return `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;
}

function Checkout() {
  const { cart, cartCount, cartTotal } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim()
    ) {
      setError("Please fill in all delivery details.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            items: cart.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Order place nahi ho saka."
        );
      }

      localStorage.setItem(
        "lastOrder",
        JSON.stringify(data.order)
      );

      navigate("/order-success", {
        state: { order: data.order },
      });
    } catch (err) {
      setError(
        err.message ||
          "Server se connection nahi ho saka. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar cartCount={cartCount} />

      <main className="checkout-page">
        <div className="checkout-container">
          <Link to="/cart" className="checkout-back">
            ← Back to Cart
          </Link>

          <h1>Checkout</h1>
          <p className="checkout-subtitle">
            Enter your delivery details to continue.
          </p>

          {cart.length === 0 ? (
            <div className="checkout-empty">
              <h2>Your cart is empty</h2>
              <Link to="/products">Continue Shopping</Link>
            </div>
          ) : (
            <div className="checkout-layout">
              <form
                className="checkout-form"
                onSubmit={handleSubmit}
              >
                <h2>Delivery Information</h2>

                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />

                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="03XXXXXXXXX"
                  autoComplete="tel"
                  required
                />

                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  autoComplete="address-level2"
                  required
                />

                <label htmlFor="address">
                  Complete Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House number, street, area..."
                  autoComplete="street-address"
                  rows={4}
                  required
                />

                <div className="payment-method">
                  <h3>Payment Method</h3>
                  <p>💵 Cash on Delivery</p>
                  <span>Pay when your parcel arrives.</span>
                </div>

                {error && (
                  <p className="checkout-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="place-order-btn"
                  disabled={submitting}
                >
                  {submitting
                    ? "Placing Order..."
                    : `Place Order · ${formatPrice(cartTotal)}`}
                </button>
              </form>

              <aside className="checkout-summary">
                <h2>Order Summary</h2>

                {cart.map((item) => (
                  <div
                    className="checkout-product"
                    key={item.id}
                  >
                    <img src={item.image} alt={item.name} />

                    <div>
                      <h3>{item.name}</h3>
                      <p>Qty: {item.quantity}</p>
                    </div>

                    <strong>
                      {formatPrice(
                        item.price * item.quantity
                      )}
                    </strong>
                  </div>
                ))}

                <div className="checkout-total">
                  <span>Total ({cartCount} items)</span>
                  <strong>{formatPrice(cartTotal)}</strong>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;
