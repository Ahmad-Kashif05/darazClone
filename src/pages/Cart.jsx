
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Cart.css";

function formatPrice(price) {
  return `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;
}

function Cart() {
  const {
    cart,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <>
      <Navbar cartCount={cartCount} />

      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-heading">
            <div>
              <p className="cart-eyebrow">YOUR SHOPPING BAG</p>
              <h1>Shopping Cart</h1>
              <p className="cart-subtitle">
                Review your items before checkout.
              </p>
            </div>

            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>

          {cart.length === 0 ? (
            <section className="cart-empty">
              <div className="empty-cart-icon">🛍️</div>
              <h2>Your cart is empty</h2>
              <p>
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/products" className="shop-now-btn">
                Start Shopping
              </Link>
            </section>
          ) : (
            <div className="cart-layout">
              <section className="cart-items-panel">
                <div className="cart-items-header">
                  <h2>Your Items</h2>
                  <span>{cartCount} items</span>
                </div>

                <div className="cart-items-list">
                  {cart.map((item) => (
                    <article className="cart-item-row" key={item.id}>
                      <div className="cart-item-image">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.style.visibility = "hidden";
                          }}
                        />
                      </div>

                      <div className="cart-item-details">
                        <h3>{item.name}</h3>

                        <p className="cart-item-category">
                          {item.category || "General"}
                        </p>

                        <p className="cart-unit-price">
                          {formatPrice(item.price)}{" "}
                          <span>per item</span>
                        </p>

                        <button
                          className="cart-remove-mobile"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="cart-quantity">
                        <span className="quantity-label">Quantity</span>
                        <div className="quantity-control">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-total">
                        <span className="quantity-label">Subtotal</span>
                        <strong>
                          {formatPrice(item.price * item.quantity)}
                        </strong>

                        <button
                          className="cart-remove-desktop"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="cart-summary">
                <h2>Order Summary</h2>

                <div className="summary-line">
                  <span>Items ({cartCount})</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>

                <div className="summary-line">
                  <span>Shipping</span>
                  <span className="shipping-note">
                    Calculated at checkout
                  </span>
                </div>

                <div className="summary-divider" />

                <div className="summary-total">
                  <span>Subtotal</span>
                  <strong>{formatPrice(cartTotal)}</strong>
                </div>

                <p className="summary-note">
                  Shipping charges, if any, will be confirmed at checkout.
                </p>

                <Link to="/checkout" className="checkout-btn">
                  Proceed to Checkout →
                </Link>

                <div className="secure-checkout">
                  🔒 Secure checkout
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

export default Cart;
