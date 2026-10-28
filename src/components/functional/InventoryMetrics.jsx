import React from 'react';
import { Package, Layers, AlertTriangle, XCircle, DollarSign, ArrowUpRight } from 'lucide-react';
import CardWrapper from './CardWrapper';

/**
 * Task 1 & 5: InventoryMetrics Functional Component
 * Displays derived real-time metrics computed via useMemo in useInventory
 * Reuses CardWrapper (demonstrating props.children)
 */
const InventoryMetrics = ({ metrics }) => {
  const safeMetrics = metrics || {
    totalProducts: 0,
    totalUnits: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    inStockCount: 0,
    totalValue: 0,
  };

  const cards = [
    {
      title: 'Active Products',
      value: safeMetrics.totalProducts ?? 0,
      subtitle: `${safeMetrics.inStockCount ?? 0} healthy items in catalog`,
      icon: Package,
      color: 'var(--brand-accent)',
      bgColor: 'var(--brand-accent-light)',
    },
    {
      title: 'Total Stock Units',
      value: (safeMetrics.totalUnits ?? 0).toLocaleString(),
      subtitle: 'Aggregated volume across warehouses',
      icon: Layers,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.12)',
    },
    {
      title: 'Low Stock Alert',
      value: safeMetrics.lowStockCount ?? 0,
      subtitle: 'Threshold: under 10 remaining units',
      icon: AlertTriangle,
      color: '#d97706',
      bgColor: 'var(--status-low-bg)',
      highlight: (safeMetrics.lowStockCount ?? 0) > 0,
    },
    {
      title: 'Out of Stock',
      value: safeMetrics.outOfStockCount ?? 0,
      subtitle: 'Requires immediate replenishment',
      icon: XCircle,
      color: '#dc2626',
      bgColor: 'var(--status-out-bg)',
      highlight: (safeMetrics.outOfStockCount ?? 0) > 0,
    },
    {
      title: 'Portfolio Valuation',
      value: `$${(safeMetrics.totalValue ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subtitle: 'Based on current cost list price',
      icon: DollarSign,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.12)',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <CardWrapper
            key={idx}
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {card.title}
                </p>
                <h2
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-primary)',
                    marginTop: '0.35rem',
                  }}
                >
                  {card.value}
                </h2>
              </div>

              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: card.bgColor,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={20} />
              </div>
            </div>

            <div
              style={{
                marginTop: '1rem',
                fontSize: '0.75rem',
                color: card.highlight ? card.color : 'var(--text-muted)',
                fontWeight: card.highlight ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span>{card.subtitle}</span>
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default InventoryMetrics;
