
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import { useCart } from "../context/useCart";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function formatPrice(price) {
  return `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;
}

function ProductDetails() {
  const { id } = useParams();
  const { cartCount, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        const productList = Array.isArray(data)
          ? data
          : data?.products || [];

        const foundProduct = productList.find(
          (item) => String(item._id || item.id) === id
        );

        if (active) {
          if (foundProduct) {
            setProduct({
              ...foundProduct,
              id: foundProduct._id || foundProduct.id,
              price: Number(foundProduct.price) || 0,
              oldPrice: Number(foundProduct.oldPrice) || 0,
              discount: Number(foundProduct.discount) || 0,
              rating: Number(foundProduct.rating) || 0,
              sold: Number(foundProduct.sold) || 0,
            });
          } else {
            setProduct(null);
          }
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Product load nahi ho saka."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <>
      <Navbar cartCount={cartCount} />

      <main className="container" style={{ padding: "35px 0" }}>
        <Link to="/products">← Back to Products</Link>

        {loading ? (
          <div className="empty-state">
            <h3>Product load ho raha hai...</h3>
          </div>
        ) : error ? (
          <div className="empty-state">
            <h3>Product load nahi ho saka</h3>
            <p>{error}</p>
          </div>
        ) : !product ? (
          <div className="empty-state">
            <h2>Product not found</h2>
            <p>Ye product MongoDB mein nahi mila.</p>
          </div>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "30px",
              marginTop: "25px",
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
            }}
          >
            <div>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    maxHeight: "420px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <p>Image available nahi hai.</p>
              )}
            </div>

            <div>
              <h1>{product.name}</h1>

              <p>⭐ {product.rating} / 5</p>

              <h2 style={{ color: "#f85606" }}>
                {formatPrice(product.price)}
              </h2>

              {product.oldPrice > 0 && (
                <p>
                  <del>{formatPrice(product.oldPrice)}</del>{" "}
                  <span style={{ color: "#f85606" }}>
                    {product.discount}% OFF
                  </span>
                </p>
              )}

              <p>
                Category: <strong>{product.category}</strong>
              </p>

              <p>Available stock: {product.stock ?? 0}</p>

              <h3>Product Description</h3>
              <p>
                {product.description ||
                  "Is product ki additional description abhi available nahi hai."}
              </p>

              <button
                type="button"
                onClick={() => addToCart(product)}
                style={{
                  marginTop: "15px",
                  padding: "12px 22px",
                  background: "#f85606",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </button>

              <p>
                <Link to="/cart">View Cart</Link>
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default ProductDetails;
