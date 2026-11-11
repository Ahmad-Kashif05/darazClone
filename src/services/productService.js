
const API_URL = "http://localhost:5000/api/products";

export async function getProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Products load nahi ho sake.");
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (data.success === false) {
    throw new Error(data.message || "Products load nahi ho sake.");
  }

  return data.products || [];
}
