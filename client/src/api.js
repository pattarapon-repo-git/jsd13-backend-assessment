// Central API helper — base URL comes from .env so it's never hardcoded
const BASE_URL = import.meta.env.VITE_API_URL;

// Helper to handle fetch responses and throw meaningful errors
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
};

// GET /products — supports optional query params like { name, sort }
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${BASE_URL}/products?${query}` : `${BASE_URL}/products`;
  const res = await fetch(url);
  return handleResponse(res);
};

// GET /products/:id
export const getProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse(res);
};

// POST /products
export const createProduct = async (productData) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return handleResponse(res);
};

// PUT /products/:id
export const updateProduct = async (id, productData) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return handleResponse(res);
};

// DELETE /products/:id
export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
};
