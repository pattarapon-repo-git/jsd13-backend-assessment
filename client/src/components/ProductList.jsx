// ProductList.jsx — renders the product list with edit/delete actions
export default function ProductList({ products, onEdit, onDelete, deletingId }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <p>No products yet. Add your first product above!</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <div className="product-header">
            <h3 className="product-name">{product.name}</h3>
            <span className="product-id">#{product.id}</span>
          </div>

          <div className="product-details">
            <div className="product-price">
              ฿{product.price.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </div>
            <div className="product-quantity">
              <span className="qty-label">Qty:</span>
              <span className="qty-value">{product.quantity}</span>
            </div>
          </div>

          <div className="product-actions">
            <button
              id={`edit-btn-${product.id}`}
              className="btn btn-edit"
              onClick={() => onEdit(product)}
              disabled={deletingId === product.id}
            >
              ✏️ Edit
            </button>
            <button
              id={`delete-btn-${product.id}`}
              className="btn btn-delete"
              onClick={() => onDelete(product.id)}
              disabled={deletingId === product.id}
            >
              {deletingId === product.id ? '⏳ Deleting...' : '🗑️ Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
