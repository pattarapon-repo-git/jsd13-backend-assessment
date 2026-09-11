// ProductForm.jsx — handles both Add and Edit modes
import { useState, useEffect } from 'react';

const EMPTY_FORM = { name: '', price: '', quantity: '' };

export default function ProductForm({ editingProduct, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // When editing product changes, populate the form
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        price: String(editingProduct.price),
        quantity: String(editingProduct.quantity),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editingProduct]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (form.price === '') {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(form.price)) || Number(form.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (form.quantity !== '' && (isNaN(Number(form.quantity)) || Number(form.quantity) < 0)) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      name: form.name.trim(),
      price: Number(form.price),
      quantity: form.quantity !== '' ? Number(form.quantity) : 1,
    });
  };

  const isEditing = !!editingProduct;

  return (
    <div className="form-card">
      <h2 className="form-title">
        {isEditing ? '✏️ Edit Product' : '➕ Add New Product'}
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="product-name">Product Name</label>
          <input
            id="product-name"
            name="name"
            type="text"
            placeholder="e.g. Mechanical Keyboard"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
            disabled={isSubmitting}
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="product-price">Price (฿)</label>
            <input
              id="product-price"
              name="price"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className={errors.price ? 'input-error' : ''}
              disabled={isSubmitting}
            />
            {errors.price && <span className="error-msg">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="product-quantity">Quantity</label>
            <input
              id="product-quantity"
              name="quantity"
              type="number"
              placeholder="1"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              className={errors.quantity ? 'input-error' : ''}
              disabled={isSubmitting}
            />
            {errors.quantity && <span className="error-msg">{errors.quantity}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button
            id="submit-btn"
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Saving...' : isEditing ? '💾 Save Changes' : '➕ Add Product'}
          </button>
          {isEditing && (
            <button
              id="cancel-btn"
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
