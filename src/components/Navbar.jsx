
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ cartCount = 0, search, setSearch }) {
  const [localSearch, setLocalSearch] = useState("");

  const searchValue =
    typeof search === "string" ? search : localSearch;

  function handleSearch(value) {
    if (setSearch) {
      setSearch(value);
    } else {
      setLocalSearch(value);
    }
  }

  return (
    <>
      <div className="top-strip">
        <div className="container top-links">
          <span>Become a Seller</span>
          <span>Help & Support</span>
          <span>Download App</span>
        </div>
      </div>

      <header className="main-header">
        <div className="container header-content">
          <Link className="logo" to="/" aria-label="Home">
            daraz<span>.</span>
          </Link>

          <form
            className="search-box"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="search"
              placeholder="Search in Daraz"
              aria-label="Search products"
              value={searchValue}
              onChange={(event) =>
                handleSearch(event.target.value)
              }
            />

            <button type="submit" aria-label="Search">
              🔍
            </button>
          </form>

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/cart" className="cart-btn">
            🛒 <span>Cart</span>
            <b>{cartCount}</b>
          </Link>
        </div>
      </header>
    </>
  );
}

export default Navbar;
