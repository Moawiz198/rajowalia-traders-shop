import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ cartCount }) {
  const navigate = useNavigate();

  return (
    <nav>
      <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
        {/* If you save the uploaded image as 'logo.png' in the 'public' folder, it will appear here: */}
        {/* <img src="/logo.png" alt="Logo" style={{ height: '40px' }} /> */}
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
        <div className="cart-icon">
          🛒
          <div className="cart-dot" id="cart-dot">{cartCount}</div>
        </div>
        <button className="nav-btn">Sign In</button>
      </div>
    </nav>
  );
}
