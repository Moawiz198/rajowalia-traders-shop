import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <>
      <footer>
        <div className="footer-brand">
          <div className="nav-logo" style={{ marginBottom: '12px' }}>
            Rajowalia <span style={{ fontSize: '14px', letterSpacing: '2px', color: 'var(--muted)' }}>TRADER'S</span>
          </div>
          <p>Pakistan's most exciting multi-category store. Shop electronics, fashion, groceries & more.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><a onClick={() => navigate('/category/Electronics')} style={{cursor: 'pointer'}}>Electronics</a></li>
            <li><a onClick={() => navigate('/category/Gadgets')} style={{cursor: 'pointer'}}>Gadgets</a></li>
            <li><a onClick={() => navigate('/category/Suits')} style={{cursor: 'pointer'}}>Fashion</a></li>
            <li><a onClick={() => navigate('/category/Karyania')} style={{cursor: 'pointer'}}>Karyania</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li><a href="https://wa.me/923046999198?text=Hi%2C%20I%20order%20from%20rajowalia%20traders%20and%20i%20want%20to%20return%20this%20order" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>Returns</a></li>
            <li><a href="https://wa.me/923046999198?text=Hi%2C%20I%20have%20a%20question%20about%20Rajowalia%20Trader%27s" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>FAQs</a></li>
            <li><a href="https://wa.me/923046999198?text=Hi%2C%20I%20need%20some%20help" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a>About Us</a></li>
            <li><a>Careers</a></li>
            <li><a>Blog</a></li>
            <li><a>Sellers</a></li>
          </ul>
        </div>
      </footer>
      <div className="footer-bottom">
        <p>© 2026 Rajowalia Trader's. All rights reserved.</p>
        <p>Karachi, Pakistan <span onClick={() => navigate('/admin')} style={{ cursor: 'default', userSelect: 'none' }}>🇵🇰</span></p>
      </div>
    </>
  );
}
