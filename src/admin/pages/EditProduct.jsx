
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddProduct.css";

const API = "http://localhost:5000";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    discount: "",
    category: "",
    stock: "",
    sold: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API}/api/products`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Products fetch nahi ho sake.");
        }

        const product = result.products.find(
          (item) => item._id === id
        );

        if (!product) {
          throw new Error("Product nahi mila.");
        }

        setForm({
          name: product.name,
          description: product.description || "",
          price: product.price,
          oldPrice: product.oldPrice || 0,
          discount: product.discount || 0,
          category: product.category,
          stock: product.stock,
          sold: product.sold || 0,
        });

        setPreview(
          product.image ? `${API}${product.image}` : ""
        );

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(`${API}/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Update failed.");
      }

      navigate("/admin/products");

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading product...</p>;

  if (error && !form.name) {
    return <p className="products-error">{error}</p>;
  }

  return (
    <div className="add-product-page">
      <div className="add-product-heading">
        <h1>Edit Product</h1>
        <p>Update your product information.</p>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Product Information</h2>

          {[
            ["name", "Product Name"],
            ["description", "Description"],
            ["category", "Category"],
            ["price", "Price"],
            ["oldPrice", "Old Price"],
            ["discount", "Discount"],
            ["stock", "Stock"],
            ["sold", "Sold"],
          ].map(([key, label]) => (
            <div key={key}>
              <label>{label}</label>

              {key === "description" ? (
                <textarea
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                />
              ) : (
                <input
                  name={key}
                  type={
                    ["price", "oldPrice", "discount", "stock", "sold"].includes(key)
                      ? "number"
                      : "text"
                  }
                  min={
                    ["price", "oldPrice", "discount", "stock", "sold"].includes(key)
                      ? 0
                      : undefined
                  }
                  max={key === "discount" ? 100 : undefined}
                  value={form[key]}
                  onChange={handleChange}
                  required={["name", "category", "price"].includes(key)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="form-section">
          <h2>Product Image</h2>

          {preview && (
            <img
              src={preview}
              alt="Product"
              style={{
                width: 180,
                height: 180,
                objectFit: "contain",
                display: "block",
                marginBottom: 15,
              }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              if (!file.type.startsWith("image/")) {
                setError("Please select an image.");
                return;
              }

              if (file.size > 5 * 1024 * 1024) {
                setError("Image must be less than 5MB.");
                return;
              }

              setImage(file);
              setPreview(URL.createObjectURL(file));
              setError("");
            }}
          />
        </div>

        {error && <p className="products-error">{error}</p>}

        <div className="product-form-actions">
          <button
            type="button"
            className="cancel-product-btn"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-product-btn"
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
