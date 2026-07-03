import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';

export default function OrdersModal({ isOpen, onClose }) {
  const { orders } = useContext(UserContext);
  const { language, t } = useContext(LanguageContext);

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

  const translateItemsString = (itemStr) => {
    if (!itemStr || language !== 'ur') return itemStr;
    let translated = itemStr;
    const keysToTranslate = [
      'Galaxy S24 Ultra 5G',
      'MacBook Air M3 2024',
      'Apple Watch Series 10',
      'Floral Summer Dress',
      'Silk Maxi Evening Gown',
      'Luxury Printed Lawn Suit',
      'Fine White Sugar 1kg',
      'Premium Brown Sugar 1kg',
      'Pure Organic Gurr 1kg'
    ];
    keysToTranslate.forEach((key) => {
      translated = translated.replaceAll(key, t(key));
    });
    return translated;
  };

  const translateStatusText = (statusText) => {
    if (!statusText) return '';
    if (statusText === 'Order Placed') return t('order_placed_status');
    if (statusText === 'In Process') return t('in_process_status');
    if (statusText === 'On Delivery') return t('on_delivery_status');
    if (statusText === 'Dispatched via TCS') return t('dispatched_status');
    if (statusText === 'Completed & Signed') return t('completed_status');
    return statusText;
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ direction: language === 'ur' ? 'rtl' : 'ltr' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', flexDirection: language === 'ur' ? 'row-reverse' : 'row' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '28px', letterSpacing: '1px', margin: 0 }}>{t('orders_title')}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '55vh', overflowY: 'auto', paddingRight: '5px' }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '3rem 0' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '1rem' }}>📄</span>
              {t('no_orders')}
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                {/* ID & Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '8px', flexDirection: language === 'ur' ? 'row-reverse' : 'row' }}>
                  <span style={{ color: '#ff4d1c', fontWeight: 'bold', fontSize: '15px' }}>{o.id}</span>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>{formatDate(o.created_at)}</span>
                </div>
                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', textAlign: language === 'ur' ? 'right' : 'left' }}>
                  <div><span style={{ color: '#64748b' }}>{t('items_label')}</span> {translateItemsString(o.item)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', flexDirection: language === 'ur' ? 'row-reverse' : 'row' }}>
                    <div><span style={{ color: '#64748b' }}>{t('method_label')}</span> <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{o.method}</span></div>
                    <div style={{ fontWeight: 'bold', color: '#4ade80' }}>PKR {Number(o.price || 0).toLocaleString()}</div>
                  </div>
                  {/* Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px', marginTop: '6px', border: '1px solid rgba(255,255,255,0.04)', flexDirection: language === 'ur' ? 'row-reverse' : 'row', justifyContent: 'flex-start' }}>
                    <span style={{ fontSize: '16px' }}>{o.status_icon || '📦'}</span>
                    <span style={{ fontWeight: 500 }}>{translateStatusText(o.status_text)}</span>
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
