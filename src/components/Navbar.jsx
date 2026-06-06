import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Navbar({ onOpenCart, onOpenWishlist, onOpenOrders }) {
  const navigate = useNavigate();
  const { currentUser, cart, logout, setAuthModalOpen } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartCount = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <nav>
      <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <span>Rajowalia <span style={{ fontSize: '14px', letterSpacing: '2px', color: 'var(--muted)' }}>TRADER'S</span></span>
      </div>
      <ul className="nav-links">
        <li><a onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Home</a></li>
        <li><a onClick={() => navigate('/category/Electronics')} style={{cursor: 'pointer'}}>Electronics</a></li>
        <li><a onClick={() => navigate('/category/Gadgets')} style={{cursor: 'pointer'}}>Gadgets</a></li>
        <li><a onClick={() => navigate('/category/Suits')} style={{cursor: 'pointer'}}>Suits</a></li>
        <li><a onClick={() => navigate('/category/Karyania')} style={{cursor: 'pointer'}}>Karyania</a></li>
        <li><a onClick={() => navigate('/category/Deals')} style={{cursor: 'pointer'}}>Deals</a></li>
      </ul>
      <div className="nav-actions">
        {/* Cart Trigger */}
        <div className="cart-icon" onClick={onOpenCart} style={{ cursor: 'pointer', userSelect: 'none', marginRight: '5px' }}>
          🛒
          <div className="cart-dot" id="cart-dot">{cartCount}</div>
        </div>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ 
                  color: '#fff', 
                  fontSize: '13px', 
                  cursor: 'pointer', 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: 'rgba(255,255,255,0.04)', 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  userSelect: 'none'
                }}
              >
                👤 {currentUser.name.split(' ')[0]}
              </div>
              
              {dropdownOpen && (
                <div style={{ 
                  position: 'absolute', 
                  top: '120%', 
                  right: 0, 
                  background: '#141416', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  borderRadius: '8px', 
                  width: '150px', 
                  zIndex: 1000, 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
                  padding: '5px' 
                }}>
                  <div 
                    onClick={() => { setDropdownOpen(false); onOpenWishlist(); }} 
                    style={{ color: '#94a3b8', padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    ♡ Wishlist
                  </div>
                  <div 
                    onClick={() => { setDropdownOpen(false); onOpenOrders(); }} 
                    style={{ color: '#94a3b8', padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    📄 My Orders
                  </div>
                  <div 
                    onClick={() => { setDropdownOpen(false); logout(); }} 
                    style={{ color: '#ef4444', padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', borderTop: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    Sign Out
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button className="nav-btn" onClick={() => setAuthModalOpen(true)}>Sign In</button>
        )}
      </div>
    </nav>
  );
}
