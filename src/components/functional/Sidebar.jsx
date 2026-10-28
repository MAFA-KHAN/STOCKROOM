import React from 'react';
import { Package, LayoutDashboard, History, BarChart3, Boxes, Layers, CheckCircle2 } from 'lucide-react';

const Sidebar = ({ activeTab, onSelectTab, onOpenAuditLog, metrics }) => {
  const navItems = [
    { id: 'dashboard', label: 'Inventory Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Product Catalog', icon: Boxes, badge: metrics.totalProducts },
    { id: 'audit', label: 'Audit Trail', icon: History, action: onOpenAuditLog },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-sidebar)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '1.5rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--brand-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(40, 125, 98, 0.35)',
          }}
        >
          <Package size={22} />
        </div>
        <div>
          <div
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#ffffff',
              lineHeight: 1.1,
            }}
          >
            STOCKROOM
          </div>
          <div
            style={{
              fontSize: '0.68rem',
              color: 'rgba(255, 255, 255, 0.55)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: '0.15rem',
            }}
          >
            Intelligence SaaS
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '1.25rem 0.875rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <div
          style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'rgba(255, 255, 255, 0.4)',
            padding: '0 0.75rem 0.5rem',
          }}
        >
          Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  onSelectTab(item.id);
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive ? 'rgba(40, 125, 98, 0.22)' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'var(--transition)',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isActive ? 'var(--brand-accent)' : 'currentColor'} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: isActive ? 'var(--brand-accent)' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Health Status Footer */}
      <div
        style={{
          padding: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
          <CheckCircle2 size={14} color="#4ade80" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>
            System Operational
          </span>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.45)' }}>
          Local Client-Side Storage Active
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
