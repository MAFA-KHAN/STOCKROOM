import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Task 1 & 4: Toast Notification Functional Component
 * Displays visual notifications triggered by AuditLogger or user actions.
 */
const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} color="#16a34a" />;
      case 'warning':
        return <AlertTriangle size={18} color="#d97706" />;
      case 'error':
        return <AlertCircle size={18} color="#dc2626" />;
      default:
        return <Info size={18} color="#2563eb" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 2000,
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        padding: '0.875rem 1.125rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '380px',
        animation: 'toastSlide 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ flexShrink: 0 }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}
        >
          {toast.title}
        </div>
        {toast.message && (
          <div
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              marginTop: '0.2rem',
              lineHeight: 1.35,
            }}
          >
            {toast.message}
          </div>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="btn-icon"
        style={{ padding: '0.25rem', marginLeft: '0.5rem' }}
        aria-label="Dismiss toast"
      >
        <X size={15} />
      </button>
    </div>
  );
};

export default Toast;
