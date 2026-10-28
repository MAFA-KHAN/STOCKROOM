import React from 'react';

/**
 * Task 2: Reusable CardWrapper container utilizing props.children
 * Supports customizable titles, badges, actions, and consistent surface elevation.
 */
const CardWrapper = ({ children, className = '', title, subtitle, action, style = {} }) => {
  return (
    <div className={`card-wrapper ${className}`} style={{ padding: '1.5rem', ...style }}>
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default CardWrapper;
