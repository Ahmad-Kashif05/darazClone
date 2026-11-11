
import { categories } from "../data/categories";

function CategoryMenu({
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <section className="category-section">
      <div className="container">
        <div className="section-heading">
          <h2>Categories</h2>

          {selectedCategory !== "All" && (
            <button
              className="clear-filter"
              onClick={() => setSelectedCategory("All")}
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="category-grid">
          {categories.map((category) => {
            const isActive =
              selectedCategory.trim().toLowerCase() ===
              category.name.trim().toLowerCase();

            return (
              <button
                type="button"
                className={`category-card ${
                  isActive ? "active" : ""
                }`}
                key={category.name}
                onClick={() =>
                  setSelectedCategory(
                    isActive ? "All" : category.name
                  )
                }
              >
                <span className="category-icon">
                  {category.icon}
                </span>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategoryMenu;
