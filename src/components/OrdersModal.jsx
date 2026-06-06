import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function OrdersModal({ isOpen, onClose }) {
  const { orders } = useContext(UserContext);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ color: '#fff' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '28px', letterSpacing: '1px', margin: 0 }}>My Invoices & Orders</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '55vh', overflowY: 'auto', paddingRight: '5px' }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '3rem 0' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '1rem' }}>📄</span>
              No orders found.
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                {/* ID & Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '8px' }}>
                  <span style={{ color: '#ff4d1c', fontWeight: 'bold', fontSize: '15px' }}>{o.id}</span>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>{formatDate(o.created_at)}</span>
                </div>
                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                  <div style={{ color: '#e2e8f0' }}><span style={{ color: '#64748b' }}>Items:</span> {o.item}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <div><span style={{ color: '#64748b' }}>Method:</span> <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{o.method}</span></div>
                    <div style={{ fontWeight: 'bold', color: '#4ade80' }}>PKR {Number(o.price || 0).toLocaleString()}</div>
                  </div>
                  {/* Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px', marginTop: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '16px' }}>{o.status_icon || '📦'}</span>
                    <span style={{ color: '#f8fafc', fontWeight: 500 }}>{o.status_text}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
