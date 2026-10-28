import React, { useState, useMemo } from 'react';
import { Search, Filter, LayoutGrid, List, AlertCircle, Plus } from 'lucide-react';
import ProductCard from './ProductCard';

/**
 * Task 2 & 4 & 5: ProductList Functional Component
 * Demonstrates:
 * - useState for search queries, categories, stock filter, view modes
 * - useMemo for optimized multi-criteria filtering
 * - Array.prototype.map() with unique key props
 * - Empty inventory and search states with short-circuit && and ternary operators
 */
const ProductList = ({
  products,
  onUpdateStock,
  onDeleteProduct,
  onOpenAddProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'price' | 'quantity'

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Requirement: useMemo for high-performance inventory filtering
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search filter (name or SKU)
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query);

        // Category filter
        const matchesCategory =
          selectedCategory === 'ALL' || product.category === selectedCategory;

        // Stock status filter
        let matchesStock = true;
        if (stockFilter === 'IN_STOCK') matchesStock = product.quantity >= 10;
        if (stockFilter === 'LOW_STOCK')
          matchesStock = product.quantity > 0 && product.quantity < 10;
        if (stockFilter === 'OUT_OF_STOCK') matchesStock = product.quantity === 0;

        return matchesQuery && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return b.price - a.price;
        if (sortBy === 'quantity') return b.quantity - a.quantity;
        return a.name.localeCompare(b.name);
      });
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Search & Filter Control Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: 'var(--bg-card)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Search input with icon */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 280px',
            maxWidth: '380px',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Filter Pills & Selectors */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Category Dropdown */}
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: 'auto', padding: '0.55rem 0.85rem' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Stock Filter Dropdown */}
          <select
            className="form-control"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            style={{ width: 'auto', padding: '0.55rem 0.85rem' }}
          >
            <option value="ALL">All Stock Levels</option>
            <option value="IN_STOCK">In Stock (≥10)</option>
            <option value="LOW_STOCK">Low Stock (1-9)</option>
            <option value="OUT_OF_STOCK">Out of Stock (0)</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', padding: '0.55rem 0.85rem' }}
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="price">Sort: Price (High-Low)</option>
            <option value="quantity">Sort: Stock Volume</option>
          </select>

          {/* Grid vs Table View Mode Switcher */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-app)',
              padding: '0.2rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className="btn-icon"
              style={{
                padding: '0.35rem 0.5rem',
                backgroundColor: viewMode === 'grid' ? 'var(--bg-card)' : 'transparent',
                boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
                color: viewMode === 'grid' ? 'var(--brand-accent)' : 'var(--text-muted)',
              }}
              title="Grid Cards View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className="btn-icon"
              style={{
                padding: '0.35rem 0.5rem',
                backgroundColor: viewMode === 'table' ? 'var(--bg-card)' : 'transparent',
                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
                color: viewMode === 'table' ? 'var(--brand-accent)' : 'var(--text-muted)',
              }}
              title="Compact Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Rendering: Empty State vs Product Display */}
      {filteredProducts.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px dashed var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-app)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={24} />
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            No Matching Products Found
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '1.25rem' }}>
            {searchQuery || selectedCategory !== 'ALL' || stockFilter !== 'ALL'
              ? 'Try modifying your search term or adjusting filters to find what you are looking for.'
              : 'Your inventory catalog is currently empty. Start by adding your first product.'}
          </p>

          {products.length === 0 ? (
            <button onClick={onOpenAddProduct} className="btn btn-primary">
              <Plus size={16} />
              Add First Product
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setStockFilter('ALL');
              }}
              className="btn btn-secondary"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdateStock={onUpdateStock}
              onDeleteProduct={onDeleteProduct}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            overflowX: 'auto',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.875rem',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '0.875rem 1.25rem' }}>SKU & Name</th>
                <th style={{ padding: '0.875rem 1.25rem' }}>Category</th>
                <th style={{ padding: '0.875rem 1.25rem' }}>Unit Price</th>
                <th style={{ padding: '0.875rem 1.25rem' }}>Stock Status</th>
                <th style={{ padding: '0.875rem 1.25rem' }}>Quantity</th>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const isOut = product.quantity === 0;
                const isLow = product.quantity > 0 && product.quantity < 10;

                return (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {product.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {product.sku}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                      {product.category}
                    </td>
                    <td
                      style={{
                        padding: '1rem 1.25rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {isOut ? (
                        <span className="status-pill status-out-stock">
                          <span className="status-dot"></span> Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="status-pill status-low-stock">
                          <span className="status-dot"></span> Low Stock
                        </span>
                      ) : (
                        <span className="status-pill status-in-stock">
                          <span className="status-dot"></span> In Stock
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() =>
                            onUpdateStock(product.id, Math.max(0, product.quantity - 1))
                          }
                          disabled={product.quantity <= 0}
                          className="btn-icon"
                          style={{
                            padding: '0.2rem 0.4rem',
                            opacity: product.quantity <= 0 ? 0.4 : 1,
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                          {product.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateStock(product.id, product.quantity + 1)}
                          className="btn-icon"
                          style={{ padding: '0.2rem 0.4rem' }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${product.name}"?`)) {
                            onDeleteProduct(product.id);
                          }
                        }}
                        className="btn btn-danger-outline"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
