
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const API = "http://localhost:5000";

function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    discount: "",
    category: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Beauty",
    "Sports",
    "Groceries",
    "Accessories",
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!image) {
      setMessage("Please select a product image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("image", image);

      const response = await fetch(`${API}/api/products`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Product add failed.");
      }

      setMessage("Product successfully added!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">

      <div className="add-product-heading">
        <div>
          <h1>Add New Product</h1>
          <p>Add a new product to your Daraz store.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="product-form">

        <div className="form-section">
          <h2>Product Information</h2>

          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter product description"
            value={form.description}
            onChange={handleChange}
            rows="4"
          />

          <label>Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <h2>Pricing & Inventory</h2>

          <div className="product-form-grid">

            <div>
              <label>Price (Rs.) *</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="5000"
                required
              />
            </div>

            <div>
              <label>Old Price (Rs.)</label>
              <input
                type="number"
                name="oldPrice"
                min="0"
                step="0.01"
                value={form.oldPrice}
                onChange={handleChange}
                placeholder="6000"
              />
            </div>

            <div>
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                min="0"
                max="100"
                value={form.discount}
                onChange={handleChange}
                placeholder="10"
              />
            </div>

            <div>
              <label>Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="50"
                required
              />
            </div>

          </div>
        </div>

        <div className="form-section">
          <h2>Product Image</h2>

          <label className="image-upload-box">
            {preview ? (
              <img src={preview} alt="Product preview" />
            ) : (
              <>
                <span>📷</span>
                <strong>Click to upload image</strong>
                <small>JPG, PNG, WEBP (Maximum 5MB)</small>
              </>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImage}
              hidden
            />
          </label>
        </div>

        {message && (
          <p className="product-form-message">{message}</p>
        )}

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
            disabled={loading}
          >
            {loading ? "Saving Product..." : "Save Product"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddProduct;
