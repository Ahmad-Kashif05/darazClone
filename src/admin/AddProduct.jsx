
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const API = "http://localhost:5000";

const initialForm = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  discount: "",
  category: "",
  stock: "",
};

function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Clean up image preview URL
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Handle form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessageType("error");
      setMessage("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessageType("error");
      setMessage("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setPreview("");

    const input = document.getElementById("product-image");

    if (input) input.value = "";
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      if (Number(form.price) < 0) {
        throw new Error("Price cannot be negative.");
      }

      if (Number(form.oldPrice || 0) < 0) {
        throw new Error("Old price cannot be negative.");
      }

      if (
        Number(form.discount || 0) < 0 ||
        Number(form.discount || 0) > 100
      ) {
        throw new Error("Discount must be between 0 and 100.");
      }

      if (Number(form.stock || 0) < 0) {
        throw new Error("Stock cannot be negative.");
      }

      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (image) {
        data.append("image", image);
      }

      const response = await fetch(`${API}/api/products`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Product upload failed."
        );
      }

      setMessageType("success");
      setMessage("Product successfully added to your store!");

      setForm(initialForm);
      setImage(null);
      setPreview("");

      const input = document.getElementById("product-image");

      if (input) input.value = "";

    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">

      <div className="dashboard-heading">
        <div>
          <h1>Add New Product</h1>
          <p>
            Add a new product to your Daraz online store.
          </p>
        </div>

        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/admin/products")}
        >
          ← All Products
        </button>
      </div>

      {message && (
        <div className={`admin-message ${messageType}`}>
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="product-form"
      >

        {/* PRODUCT INFORMATION */}

        <div className="form-section">
          <h2>Product Information</h2>

          <div className="form-group">
            <label>Product Name *</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Living">Home & Living</option>
              <option value="Beauty">Beauty</option>
              <option value="Sports">Sports</option>
              <option value="Groceries">Groceries</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* PRICE INFORMATION */}

        <div className="form-section">
          <h2>Pricing & Inventory</h2>

          <div className="form-row">

            <div className="form-group">
              <label>Price (Rs.) *</label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Old Price (Rs.)</label>

              <input
                type="number"
                name="oldPrice"
                value={form.oldPrice}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Discount (%)</label>

              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Stock Quantity</label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>

          </div>
        </div>

        {/* PRODUCT IMAGE */}

        <div className="form-section">
          <h2>Product Image</h2>

          <div className="image-upload-box">

            {!preview ? (
              <label
                htmlFor="product-image"
                className="upload-label"
              >
                <span className="upload-icon">📸</span>

                <strong>Click to upload product image</strong>

                <span>
                  PNG, JPG, WEBP (Maximum 5MB)
                </span>

                <input
                  id="product-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImage}
                  hidden
                />
              </label>
            ) : (
              <div className="preview-container">

                <img
                  src={preview}
                  alt="Product preview"
                  className="product-preview"
                />

                <div>
                  <p>{image?.name}</p>

                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={removeImage}
                  >
                    Remove Image
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* SUBMIT */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin/products")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default AddProduct;
