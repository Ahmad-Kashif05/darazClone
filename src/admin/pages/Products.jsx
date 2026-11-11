
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

const API = "http://localhost:5000";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from backend
  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}/api/products`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Products fetch failed"
          );
        }

        if (!ignore) {
          setProducts(result.products || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Product delete failed"
        );
      }

      setProducts((previous) =>
        previous.filter((product) => product._id !== id)
      );

      alert("Product deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="admin-products">
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div className="admin-products">

      {/* Page Heading */}
      <div className="dashboard-heading">
        <div>
          <h1>Manage Products</h1>
          <p>Manage all products in your Daraz store.</p>
        </div>

        <Link
          to="/admin/add-product"
          className="add-product-btn"
        >
          + Add New Product
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="admin-message">
          {error}
        </div>
      )}

      {/* Products Table */}
      {!error && products.length === 0 ? (
        <div className="recent-orders">
          <h2>No Products Found</h2>
          <p>Add your first product to your store.</p>
        </div>
      ) : (
        !error && (
          <div className="recent-orders">
            <h2>All Products ({products.length})</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Old Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>

                      <td>
                        {product.image ? (
                          <img
                            src={`${API}${product.image}`}
                            alt={product.name}
                            width="55"
                            height="55"
                            style={{
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>

                      <td>{product.name}</td>

                      <td>{product.category}</td>

                      <td>
                        Rs. {product.price}
                      </td>

                      <td>
                        Rs. {product.oldPrice || 0}
                      </td>

                      <td>
                        {product.stock}
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

    </div>
  );
}

export default Products;
