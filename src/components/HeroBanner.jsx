
function HeroBanner() {
  function handleShopNow() {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="hero-section">
      <div className="container hero-content">
        <div className="hero-copy">
          <span className="hero-label">BIG SAVINGS EVENT</span>

          <h1>
            Great Deals.
            <br />
            Better Everyday.
          </h1>

          <p>
            Discover your favourite products at prices
            you will love.
          </p>

          <button className="hero-btn" onClick={handleShopNow}>
            Shop Now <span>→</span>
          </button>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-circle">
            <span className="hero-gift">🎁</span>
            <span className="hero-percent">UP TO</span>
            <strong>50% OFF</strong>
          </div>

          <span className="float-item float-one">🛍️</span>
          <span className="float-item float-two">🎧</span>
          <span className="float-item float-three">👟</span>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
