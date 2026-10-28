import React from 'react';
import { Trash2, Plus, Minus, Tag, DollarSign, Box } from 'lucide-react';
import CardWrapper from './CardWrapper';

/**
 * Task 2 & 4: ProductCard Functional Component
 * Demonstrates:
 * - Props and callback props (onUpdateStock, onDeleteProduct)
 * - JSX vs. Dynamic JavaScript Expressions ({ ... })
 * - Conditional Rendering using ternary operators and logical &&
 * - Reusable CardWrapper container with props.children
 */
const ProductCard = ({ product, onUpdateStock, onDeleteProduct }) => {
  const { id, sku, name, category, price, quantity, description } = product;

  // Stock status logic (Conditional Rendering)
  const isOutOfStock = quantity === 0;
  const isLowStock = quantity > 0 && quantity < 10;
  const isInStock = quantity >= 10;

  return (
    <CardWrapper
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: '1.25rem',
      }}
    >
      <div>
        {/* Top Meta: Category & Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--brand-accent)',
              backgroundColor: 'var(--brand-accent-light)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {category}
          </span>

          {/* Conditional stock status badge */}
          {isOutOfStock ? (
            <span className="status-pill status-out-stock">
              <span className="status-dot"></span>
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="status-pill status-low-stock">
              <span className="status-dot"></span>
              Low Stock ({quantity})
            </span>
          ) : (
            <span className="status-pill status-in-stock">
              <span className="status-dot"></span>
              In Stock ({quantity})
            </span>
          )}
        </div>

        {/* Product Title & SKU */}
        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: '0.25rem',
          }}
        >
          {name}
        </h3>

        <div
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            fontFamily: 'monospace',
            marginBottom: '0.75rem',
          }}
        >
          {sku}
        </div>

        {/* Description (Logical && check) */}
        {description && (
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Bottom Section: Price & Inventory Stepper */}
      <div
        style={{
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            UNIT PRICE
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ${price.toFixed(2)}
          </div>
        </div>

        {/* Quantity Controls & Quick Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => onUpdateStock(id, Math.max(0, quantity - 1))}
              disabled={quantity <= 0}
              className="btn-icon"
              style={{
                padding: '0.35rem 0.5rem',
                opacity: quantity <= 0 ? 0.4 : 1,
                cursor: quantity <= 0 ? 'not-allowed' : 'pointer',
              }}
              title="Decrease quantity by 1"
            >
              <Minus size={14} />
            </button>

            <span
              style={{
                minWidth: '28px',
                textAlign: 'center',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: isOutOfStock ? 'var(--status-out-text)' : 'var(--text-primary)',
              }}
            >
              {quantity}
            </span>

            <button
              onClick={() => onUpdateStock(id, quantity + 1)}
              className="btn-icon"
              style={{ padding: '0.35rem 0.5rem' }}
              title="Increase quantity by 1"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Delete Action */}
          <button
            onClick={() => {
              if (window.confirm(`Delete "${name}" from inventory?`)) {
                onDeleteProduct(id);
              }
            }}
            className="btn-icon"
            style={{
              color: 'var(--text-muted)',
              padding: '0.45rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--status-out-text)';
              e.currentTarget.style.backgroundColor = 'var(--status-out-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Delete product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </CardWrapper>
  );
};

export default ProductCard;
