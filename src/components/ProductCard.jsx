
import { Link } from "react-router-dom";

function formatPrice(price) {
  return `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;
}

function ProductCard({ product, onAddToCart }) {
  if (!product) return null;

  return (
    <article className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-image-wrap"
        style={{ display: "block" }}
      >
        <img
          className="product-image"
          src={product.image || ""}
          alt={product.name || "Product"}
          loading="lazy"
        />

        <span className="discount-badge">
          -{product.discount || 0}%
        </span>
      </Link>

      <div className="product-info">
        <h3 title={product.name}>
          <Link
            to={`/products/${product.id}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {product.name}
          </Link>
        </h3>

        <p className="product-price">
          {formatPrice(product.price)}
        </p>

        {Number(product.oldPrice) > 0 && (
          <p className="old-price">
            <del>{formatPrice(product.oldPrice)}</del>
            <span>-{product.discount || 0}%</span>
          </p>
        )}

        <div className="product-meta">
          <span>⭐ {product.rating || 0}</span>
          <span>
            {Number(product.sold || 0).toLocaleString()} sold
          </span>
        </div>

        <button
          type="button"
          className="add-cart-btn"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
