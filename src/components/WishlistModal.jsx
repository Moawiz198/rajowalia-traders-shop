import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';

export default function WishlistModal({ isOpen, onClose }) {
  const { wishlist, toggleWishlist, addToCart } = useContext(UserContext);
  const { language, t } = useContext(LanguageContext);

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally trigger an effect or close
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ direction: language === 'ur' ? 'rtl' : 'ltr' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', flexDirection: language === 'ur' ? 'row-reverse' : 'row' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '28px', letterSpacing: '1px', margin: 0 }}>{t('wishlist')}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '50vh', overflowY: 'auto' }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '3rem 0' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '1rem' }}>♡</span>
              {t('wishlist_empty')}
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.productId} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', flexDirection: language === 'ur' ? 'row-reverse' : 'row' }}>
                {/* Image */}
                <div style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '24px' }}>{item.product.emoji}</span>
                  )}
                </div>
                {/* Info */}
                <div style={{ flex: 1, textAlign: language === 'ur' ? 'right' : 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{t(item.product.name)}</div>
                  <div style={{ fontSize: '12px', color: '#ffd700', fontWeight: 'bold' }}>PKR {item.product.price.toLocaleString()}</div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexDirection: language === 'ur' ? 'row-reverse' : 'row' }}>
                  <button 
                    onClick={() => handleAddToCart(item.product)} 
                    className="hq-btn"
                    style={{ padding: '6px 12px', fontSize: '11px', background: 'linear-gradient(90deg, #ff6b00, #ff4d1c)' }}
                  >
                    {t('cart_add')}
                  </button>
                  <button 
                    onClick={() => toggleWishlist(item.product)} 
                    className="hq-btn"
                    style={{ padding: '6px 12px', fontSize: '11px', background: '#334155' }}
                  >
                    {t('remove_btn')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
