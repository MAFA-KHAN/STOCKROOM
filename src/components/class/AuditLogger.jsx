import React from 'react';
import { History, ShieldCheck, Trash2, ArrowUpRight, AlertCircle, RefreshCw, X } from 'lucide-react';

/**
 * Task 3: Class Component & Lifecycle Implementation
 * Demonstrates proficiency in React Class Component architecture:
 * - this.state & this.setState()
 * - componentDidMount(): Hydrates audit log entries from localStorage
 * - componentDidUpdate(): Persists new logs and dispatches toast notifications without infinite loops
 * - componentWillUnmount(): Performs cleanup of interval timers
 */
class AuditLogger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      filter: 'ALL',
      lastRefreshed: new Date().toLocaleTimeString(),
      autoRefreshCount: 0,
    };

    this.timerId = null;
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleClearLogs = this.handleClearLogs.bind(this);
  }

  // Lifecycle Method 1: componentDidMount
  componentDidMount() {
    try {
      const savedLogs = localStorage.getItem('stockroom_audit_logs');
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs);
        if (Array.isArray(parsed)) {
          this.setState({ logs: parsed });
        }
      }
    } catch (err) {
      console.error('AuditLogger: Error reading from localStorage', err);
    }

    // Interval to refresh timestamp every 30 seconds (cleaned up in unmount)
    this.timerId = setInterval(() => {
      this.setState((prev) => ({
        lastRefreshed: new Date().toLocaleTimeString(),
        autoRefreshCount: prev.autoRefreshCount + 1,
      }));
    }, 30000);
  }

  // Lifecycle Method 2: componentDidUpdate
  componentDidUpdate(prevProps, prevState) {
    // Check if new incoming audit log was passed via props from App/useInventory
    if (this.props.incomingAction && this.props.incomingAction !== prevProps.incomingAction) {
      const newEntry = {
        id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        ...this.props.incomingAction,
      };

      this.setState((prev) => {
        const updatedLogs = [newEntry, ...prev.logs].slice(0, 50); // Keep last 50
        return { logs: updatedLogs };
      });
    }

    // Persist logs whenever local state.logs changes, and trigger notification
    if (prevState.logs !== this.state.logs) {
      try {
        localStorage.setItem('stockroom_audit_logs', JSON.stringify(this.state.logs));
      } catch (err) {
        console.error('AuditLogger: Failed to persist to localStorage', err);
      }

      // If a new log was just added (length increased), trigger visual notification
      if (this.state.logs.length > prevState.logs.length && this.props.onTriggerToast) {
        const newest = this.state.logs[0];
        this.props.onTriggerToast({
          type: newest.type === 'DELETE' ? 'warning' : 'success',
          title: `Audit: ${newest.type.replace('_', ' ')}`,
          message: `${newest.item} — ${newest.details}`,
        });
      }
    }
  }

  // Lifecycle Method 3: componentWillUnmount
  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  handleFilterChange(type) {
    this.setState({ filter: type });
  }

  handleClearLogs() {
    if (window.confirm('Are you sure you want to clear the audit history?')) {
      this.setState({ logs: [] });
      localStorage.removeItem('stockroom_audit_logs');
    }
  }

  render() {
    const { isOpen, onClose } = this.props;
    const { logs, filter, lastRefreshed } = this.state;

    if (!isOpen) return null;

    const filteredLogs = logs.filter((log) => {
      if (filter === 'ALL') return true;
      return log.type === filter;
    });

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 25, 23, 0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
        onClick={onClose}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '520px',
            height: '100%',
            backgroundColor: 'var(--bg-elevated)',
            borderLeft: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-modal)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 200ms cubic-bezier(0.16, 1, 0.3, 1)',
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
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--brand-accent-light)',
                  color: 'var(--brand-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <History size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Audit Trail
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Synchronized at {lastRefreshed}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-icon"
              aria-label="Close Audit Drawer"
              style={{ padding: '0.4rem' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Controls & Filter Pills */}
          <div
            style={{
              padding: '0.875rem 1.5rem',
              backgroundColor: 'var(--bg-card)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {['ALL', 'CREATE', 'STOCK_UPDATE', 'DELETE'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => this.handleFilterChange(tab)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: '1px solid',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    backgroundColor:
                      filter === tab ? 'var(--brand-accent)' : 'transparent',
                    color: filter === tab ? '#ffffff' : 'var(--text-secondary)',
                    borderColor:
                      filter === tab ? 'var(--brand-accent)' : 'var(--border-subtle)',
                  }}
                >
                  {tab === 'ALL'
                    ? 'All Events'
                    : tab === 'CREATE'
                    ? 'Additions'
                    : tab === 'STOCK_UPDATE'
                    ? 'Stock'
                    : 'Deletions'}
                </button>
              ))}
            </div>

            {logs.length > 0 && (
              <button
                onClick={this.handleClearLogs}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
                title="Clear stored logs"
              >
                <Trash2 size={13} />
                Clear
              </button>
            )}
          </div>

          {/* Log List View */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {filteredLogs.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '240px',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                }}
              >
                <ShieldCheck size={36} style={{ marginBottom: '0.75rem', opacity: 0.6 }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>No operations recorded</p>
                <p style={{ fontSize: '0.75rem' }}>
                  Add, update, or remove items to generate audit log records.
                </p>
              </div>
            ) : (
              filteredLogs.map((entry) => {
                const isCreate = entry.type === 'CREATE';
                const isDelete = entry.type === 'DELETE';

                return (
                  <div
                    key={entry.id}
                    style={{
                      padding: '0.875rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.375rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        className={`status-pill ${
                          isCreate
                            ? 'status-in-stock'
                            : isDelete
                            ? 'status-out-stock'
                            : 'status-low-stock'
                        }`}
                      >
                        <span className="status-dot"></span>
                        {entry.type.replace('_', ' ')}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {entry.item}
                      {entry.sku && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 400,
                            color: 'var(--text-muted)',
                            marginLeft: '0.5rem',
                            fontFamily: 'monospace',
                          }}
                        >
                          [{entry.sku}]
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {entry.details}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AuditLogger;
