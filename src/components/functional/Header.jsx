import React from 'react';
import { Plus, Sun, Moon, History, Menu, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Task 2: Header Functional Component
 * Demonstrates props, callback props, and ThemeContext consumption via useTheme
 */
const Header = ({ onOpenAddProduct, onOpenAuditLog, onToggleSidebar, metrics }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        height: '72px',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-card)',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          className="btn-icon"
          style={{ display: 'none' }}
          id="mobile-sidebar-toggle"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              Inventory Operations
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--brand-accent-light)',
                color: 'var(--brand-accent)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Live Sync
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Real-time stock monitoring & catalog control
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Audit Log Trigger */}
        <button
          onClick={onOpenAuditLog}
          className="btn btn-secondary"
          title="Open Audit Logger (Class Component)"
          style={{ fontSize: '0.8125rem', padding: '0.5rem 0.875rem' }}
        >
          <History size={16} />
          <span>Audit Log</span>
        </button>

        {/* Theme Toggle (useContext) */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onOpenAddProduct}
          className="btn btn-primary"
          style={{ padding: '0.55rem 1rem' }}
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
