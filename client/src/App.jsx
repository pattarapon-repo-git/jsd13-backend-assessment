import { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import { getProducts, createProduct, updateProduct, deleteProduct } from './api';
import './index.css';

export default function App() {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // ─── Fetch products on mount ─────────────────────────────────────────────────
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // ─── Add or Edit product ─────────────────────────────────────────────────────
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Edit existing product
        const updated = await updateProduct(editingProduct.id, formData);
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setEditingProduct(null);
        showSuccess(`✅ "${updated.name}" updated successfully!`);
      } else {
        // Add new product
        const created = await createProduct(formData);
        setProducts((prev) => [...prev, created]);
        showSuccess(`✅ "${created.name}" added successfully!`);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete product ──────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const product = products.find((p) => p.id === id);
    if (!window.confirm(`Delete "${product?.name}"? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showSuccess(`🗑️ "${product?.name}" deleted.`);
    } catch (err) {
      setError(err.message || 'Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  // ─── UI ──────────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🛒</span>
            <div>
              <h1 className="app-title">Product Manager</h1>
              <p className="app-subtitle">Shopping Cart Assessment</p>
            </div>
          </div>
          <div className="header-stats">
            <span className="stat">
              <span className="stat-value">{products.length}</span>
              <span className="stat-label">Products</span>
            </span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Success Banner */}
        {successMsg && (
          <div className="banner banner-success" role="alert">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <ProductForm
          editingProduct={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditingProduct(null)}
          isSubmitting={isSubmitting}
        />

        {/* Product List Section */}
        <section className="list-section">
          <div className="list-header">
            <h2 className="section-title">📋 Products</h2>
            <button
              id="refresh-btn"
              className="btn btn-ghost"
              onClick={fetchProducts}
              disabled={loading}
            >
              {loading ? '⏳' : '🔄'} Refresh
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="banner banner-error" role="alert">
              <strong>⚠️ Error:</strong> {error}
              <button
                id="retry-btn"
                className="btn btn-ghost"
                onClick={fetchProducts}
                style={{ marginLeft: '1rem' }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && (
            <ProductList
              products={products}
              onEdit={setEditingProduct}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          )}
        </section>
      </main>
    </div>
  );
}
