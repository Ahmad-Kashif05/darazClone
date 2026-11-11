
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/useCart";
import { getProducts } from "../services/productService";

import Navbar from "../components/Navbar";
import CategoryMenu from "../components/CategoryMenu";
import ProductCard from "../components/ProductCard";
import HeroBanner from "../components/HeroBanner";
import Footer from "../components/Footer";

function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { cartCount, addToCart } = useCart();

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

  
const filteredProducts = useMemo(() => {
  return products.filter((product) => {
    const matchesSearch = (product.name || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      (product.category || "").trim().toLowerCase() ===
        selectedCategory.trim().toLowerCase();

    return matchesSearch && matchesCategory;
  });
}, [products, search, selectedCategory]);


  function clearFilters() {
    setSearch("");
    setSelectedCategory("All");
  }

  return (
    <>
      <Navbar
        cartCount={cartCount}
        search={search}
        setSearch={setSearch}
      />

      <main>
        <HeroBanner />

        <CategoryMenu
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <section className="flash-sale-section" id="products">
          <div className="container">
            <div className="flash-sale-bar">
              <div>
                <span className="sale-eyebrow">
                  DON'T MISS OUT
                </span>
                <h2>
                  Flash Sale <span>⚡</span>
                </h2>
              </div>
              <p>Deals you don't want to miss</p>
            </div>

            <div className="product-section-heading">
              <h2>
                {selectedCategory === "All"
                  ? "Just For You"
                  : selectedCategory}
              </h2>
              <span>
                {filteredProducts.length} products
              </span>
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
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span>🔎</span>
                <h3>No products found</h3>
                <p>
                  Try a different search or category.
                </p>
                <button onClick={clearFilters}>
                  Show all products
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
