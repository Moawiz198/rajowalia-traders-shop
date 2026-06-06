import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function WishlistModal({ isOpen, onClose }) {
  const { wishlist, toggleWishlist, addToCart } = useContext(UserContext);

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally trigger an effect or close
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ color: '#fff' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '28px', letterSpacing: '1px', margin: 0 }}>My Wishlist</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '50vh', overflowY: 'auto' }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '3rem 0' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '1rem' }}>♡</span>
              Your wishlist is empty.
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.productId} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Image */}
                <div style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '24px' }}>{item.product.emoji}</span>
                  )}
                </div>
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{item.product.name}</div>
                  <div style={{ fontSize: '12px', color: '#ffd700', fontWeight: 'bold' }}>PKR {item.product.price.toLocaleString()}</div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleAddToCart(item.product)} 
                    className="hq-btn"
                    style={{ padding: '6px 12px', fontSize: '11px', background: 'linear-gradient(90deg, #ff6b00, #ff4d1c)' }}
                  >
                    + Cart
                  </button>
                  <button 
                    onClick={() => toggleWishlist(item.product)} 
                    className="hq-btn"
                    style={{ padding: '6px 12px', fontSize: '11px', background: '#334155' }}
                  >
                    Remove
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
