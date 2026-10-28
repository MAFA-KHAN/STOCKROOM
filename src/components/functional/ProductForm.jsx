import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';

/**
 * Task 2 & 5: ProductForm Functional Component
 * Demonstrates:
 * - useState for form controls & validation state
 * - useRef for automatic input focus on mount and after submission
 * - Synthetic event handling (onSubmit, onChange)
 * - Callback prop onAddProduct for parent communication
 */
const ProductForm = ({ isOpen, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    price: '',
    quantity: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  // Requirement: useRef for shifting focus to product-title input
  const titleInputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleGenerateSku = () => {
    const prefix = (formData.category.slice(0, 4) || 'SKU').toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900);
    setFormData((prev) => ({
      ...prev,
      sku: `SKU-${prefix}-${randomNum}`,
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) < 0) {
      errs.price = 'Please enter a valid price';
    }
    if (
      formData.quantity === '' ||
      isNaN(formData.quantity) ||
      parseInt(formData.quantity, 10) < 0
    ) {
      errs.quantity = 'Stock quantity cannot be negative';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAddProduct({
      ...formData,
      sku: formData.sku.trim() || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
    });

    // Reset form
    setFormData({
      name: '',
      sku: '',
      category: 'Electronics',
      price: '',
      quantity: '',
      description: '',
    });

    // Requirement: Shift focus back to input after successful submission
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 25, 23, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-modal)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          animation: 'toastSlide 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-app)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Add New Product
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Enter product parameters to update warehouse inventory
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Product Name (ref attached here) */}
          <div className="form-group">
            <label className="form-label">
              Product Title <span style={{ color: 'var(--status-out-text)' }}>*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              name="name"
              placeholder="e.g. Ergonomic Mechanical Keyboard"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              style={{
                borderColor: errors.name ? 'var(--status-out-border)' : undefined,
              }}
            />
            {errors.name && (
              <span style={{ fontSize: '0.75rem', color: 'var(--status-out-text)', marginTop: '0.25rem', display: 'block' }}>
                {errors.name}
              </span>
            )}
          </div>

          {/* SKU & Category Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">SKU Code</label>
                <button
                  type="button"
                  onClick={handleGenerateSku}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.72rem',
                    color: 'var(--brand-accent)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    marginBottom: '0.25rem',
                  }}
                >
                  <Sparkles size={12} /> Auto
                </button>
              </div>
              <input
                type="text"
                name="sku"
                placeholder="SKU-ELEC-101"
                className="form-control font-mono"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Apparel">Apparel</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Price & Quantity Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Unit Price ($) <span style={{ color: 'var(--status-out-text)' }}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                placeholder="49.99"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                style={{
                  borderColor: errors.price ? 'var(--status-out-border)' : undefined,
                }}
              />
              {errors.price && (
                <span style={{ fontSize: '0.75rem', color: 'var(--status-out-text)', marginTop: '0.25rem', display: 'block' }}>
                  {errors.price}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Initial Stock Units <span style={{ color: 'var(--status-out-text)' }}>*</span>
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="25"
                className="form-control"
                value={formData.quantity}
                onChange={handleChange}
                style={{
                  borderColor: errors.quantity ? 'var(--status-out-border)' : undefined,
                }}
              />
              {errors.quantity && (
                <span style={{ fontSize: '0.75rem', color: 'var(--status-out-text)', marginTop: '0.25rem', display: 'block' }}>
                  {errors.quantity}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Brief specification or product highlights..."
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
