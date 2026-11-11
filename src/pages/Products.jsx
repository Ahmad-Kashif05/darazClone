
import { useEffect, useState } from "react";
import { useCart } from "../context/useCart";
import { getProducts } from "../services/productService";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

function Products() {
  const { cartCount, addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        const productList = Array.isArray(data)
          ? data
          : data?.products || [];

        if (active) {
          setProducts(
            productList.map((product) => ({
              ...product,
              id: product._id || product.id,
              price: Number(product.price) || 0,
              oldPrice: Number(product.oldPrice) || 0,
              discount: Number(product.discount) || 0,
              rating: Number(product.rating) || 0,
              sold: Number(product.sold) || 0,
            }))
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Products load nahi ho sake."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Navbar cartCount={cartCount} />

      <main className="flash-sale-section">
        <div className="container">
          <div className="product-section-heading">
            <h2>All Products</h2>
            <span>{products.length} products</span>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Products load ho rahe hain...</h3>
              <p>Please wait.</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h3>Products load nahi ho sake</h3>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No products available</h3>
              <p>MongoDB mein abhi koi product nahi hai.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Products;
