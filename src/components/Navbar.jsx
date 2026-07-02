import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar({ onOpenCart, onOpenWishlist, onOpenOrders }) {
  const navigate = useNavigate();
  const { currentUser, cart, wishlist, logout, setAuthModalOpen, requireAuth } = useContext(UserContext);
  const { language, setLanguage, t } = useContext(LanguageContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clothingDropdownOpen, setClothingDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const cartCount = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const wishlistCount = wishlist ? wishlist.length : 0;

  return (
    <nav style={{ direction: language === 'ur' ? 'rtl' : 'ltr' }}>
      <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '50%', width: '32px', height: '32px', padding: '6px' }}>
          <svg viewBox="0 0 300 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <path d="M 100 100 Q 100 50 150 50 Q 200 50 200 100" stroke="#000000" strokeWidth="22" strokeLinecap="round" fill="none"/>
            <path d="M 60 100 L 40 240 Q 40 260 60 260 L 240 260 Q 260 260 260 240 L 240 100 Z" stroke="#000000" strokeWidth="22" fill="none" strokeLinejoin="round"/>
            <path d="M 200 60 Q 280 100 260 200" stroke="rgba(0,0,0,0.25)" strokeWidth="12" strokeLinecap="round" fill="none"/>
            <path d="M 96 98 L 204 98" stroke="#000000" strokeWidth="16" fill="none"/>
          </svg>
        </div>
        <span>{t('app_name')} <span style={{ fontSize: '14px', letterSpacing: '2px', color: 'var(--muted)' }}>{language === 'en' ? "TRADER'S" : "ٹریڈرز"}</span></span>
      </div>
      <ul className="nav-links">
        <li><a onClick={() => navigate('/')} style={{cursor: 'pointer'}}>{t('home')}</a></li>
        <li><a onClick={() => navigate('/category/Electronics')} style={{cursor: 'pointer'}}>{t('electronics')}</a></li>
        <li><a onClick={() => navigate('/category/Women Dresses')} style={{cursor: 'pointer'}}>{t('dresses')}</a></li>
        <li><a onClick={() => navigate('/category/Karyania')} style={{cursor: 'pointer'}}>{t('karyania')}</a></li>
        <li><a onClick={() => navigate('/category/Deals')} style={{cursor: 'pointer'}}>{t('deals')}</a></li>
      </ul>
      
      {/* Search Input (Desktop) */}
      <div className="nav-search-bar-desktop" style={{ display: 'flex', alignItems: 'center', position: 'relative', marginRight: '15px', marginLeft: language === 'ur' ? '15px' : '0' }}>
        <span style={{ 
          position: 'absolute', 
          left: language === 'ur' ? 'auto' : '10px', 
          right: language === 'ur' ? '10px' : 'auto', 
          color: 'var(--muted)', 
          fontSize: '13px', 
          display: 'flex', 
          alignItems: 'center', 
          pointerEvents: 'none' 
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </span>
        <input 
          type="text" 
          placeholder={t('search')} 
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              navigate(`/category/All?search=${encodeURIComponent(searchVal)}`);
            }
          }}
          className="nav-search-input"
          style={{
            paddingLeft: language === 'ur' ? '12px' : '32px',
            paddingRight: language === 'ur' ? '32px' : '12px',
            textAlign: language === 'ur' ? 'right' : 'left'
          }}
        />
      </div>

      <div className="nav-actions">
        {/* Theme Toggler */}
        <button 
          onClick={toggleTheme}
          style={{
            background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            color: theme === 'dark' ? '#fff' : '#000',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginRight: '6px',
            marginLeft: '6px'
          }}
          onMouseEnter={e => e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Language Switcher */}
        <div style={{ display: 'flex', gap: '4px', marginRight: '6px', marginLeft: '6px' }}>
          <button 
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            style={{
              background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              color: theme === 'dark' ? '#fff' : '#000',
              border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              borderRadius: '20px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseEnter={e => e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
          >
            {language === 'en' ? 'اردو' : 'EN'}
          </button>
        </div>

        {/* Wishlist Trigger */}
        <div 
          onClick={() => requireAuth(onOpenWishlist)} 
          style={{ cursor: 'pointer', userSelect: 'none', marginRight: '8px', position: 'relative', display: 'flex', alignItems: 'center' }}
        >
          {wishlistCount > 0 ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#ff4d1c" stroke="#ff4d1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          )}
          {wishlistCount > 0 && (
            <div className="cart-dot" style={{ background: 'var(--accent)', top: '-4px', right: '-8px' }}>{wishlistCount}</div>
          )}
        </div>

        {/* Cart Trigger */}
        <div className="cart-icon" onClick={onOpenCart} style={{ cursor: 'pointer', userSelect: 'none', marginRight: '10px' }}>
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
                  color: theme === 'dark' ? '#fff' : '#000', 
                  fontSize: '13px', 
                  cursor: 'pointer', 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  userSelect: 'none'
                }}
              >
                👤 {currentUser.name.split(' ')[0]}
              </div>
              
              {dropdownOpen && (
                <div style={{ 
                  position: 'absolute', 
                  top: '120%', 
                  right: language === 'ur' ? 'auto' : 0,
                  left: language === 'ur' ? 0 : 'auto', 
                  background: theme === 'dark' ? '#141416' : '#ffffff', 
                  border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)', 
                  borderRadius: '8px', 
                  width: '150px', 
                  zIndex: 1000, 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)', 
                  padding: '5px' 
                }}>
                  <div 
                    onClick={() => { setDropdownOpen(false); onOpenWishlist(); }} 
                    style={{ color: theme === 'dark' ? '#94a3b8' : '#475569', padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s', textAlign: language === 'ur' ? 'right' : 'left' }}
                    onMouseEnter={e => e.target.style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    ♡ {t('wishlist')}
                  </div>
                  <div 
                    onClick={() => { setDropdownOpen(false); onOpenOrders(); }} 
                    style={{ color: theme === 'dark' ? '#94a3b8' : '#475569', padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s', textAlign: language === 'ur' ? 'right' : 'left' }}
                    onMouseEnter={e => e.target.style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    📄 {t('my_orders')}
                  </div>
                  <div 
                    onClick={() => { setDropdownOpen(false); logout(); }} 
                    style={{ color: '#ef4444', padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', borderTop: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)', transition: 'background 0.2s', textAlign: language === 'ur' ? 'right' : 'left' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    {t('sign_out')}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button className="nav-btn" onClick={() => setAuthModalOpen(true)}>{t('sign_in')}</button>
        )}
        
        {/* Mobile Hamburger Menu Icon */}
        <div 
          className="mobile-hamburger"
          onClick={() => setMobileMenuOpen(true)}
          style={{ cursor: 'pointer', display: 'none', alignItems: 'center', fontSize: '20px', marginLeft: '10px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              right: language === 'ur' ? 'auto' : 0,
              left: language === 'ur' ? 0 : 'auto',
              direction: language === 'ur' ? 'rtl' : 'ltr'
            }}
          >
            <div className="mobile-drawer-header" style={{ flexDirection: language === 'ur' ? 'row-reverse' : 'row' }}>
              <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '50%', width: '32px', height: '32px', padding: '6px' }}>
                  <svg viewBox="0 0 300 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                    <path d="M 100 100 Q 100 50 150 50 Q 200 50 200 100" stroke="#000000" strokeWidth="22" strokeLinecap="round" fill="none"/>
                    <path d="M 60 100 L 40 240 Q 40 260 60 260 L 240 260 Q 260 260 260 240 L 240 100 Z" stroke="#000000" strokeWidth="22" fill="none" strokeLinejoin="round"/>
                    <path d="M 200 60 Q 280 100 260 200" stroke="rgba(0,0,0,0.25)" strokeWidth="12" strokeLinecap="round" fill="none"/>
                    <path d="M 96 98 L 204 98" stroke="#000000" strokeWidth="16" fill="none"/>
                  </svg>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 600, fontFamily: "'Bebas Neue', sans-serif" }}>Rajowalia</span>
              </div>
              <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18 M6 6 l12 12"/>
                </svg>
              </button>
            </div>
            
            {/* Mobile Search */}
            <div style={{ padding: '15px' }}>
              <div className="nav-search-bar" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                <span style={{ 
                  position: 'absolute', 
                  left: language === 'ur' ? 'auto' : '12px', 
                  right: language === 'ur' ? '12px' : 'auto', 
                  color: 'var(--muted)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  pointerEvents: 'none' 
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                </span>
                <input 
                  type="text" 
                  placeholder={t('search')} 
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setMobileMenuOpen(false);
                      navigate(`/category/All?search=${encodeURIComponent(searchVal)}`);
                    }
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    paddingLeft: language === 'ur' ? '12px' : '36px',
                    paddingRight: language === 'ur' ? '36px' : '12px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    width: '100%',
                    textAlign: language === 'ur' ? 'right' : 'left'
                  }}
                />
              </div>
            </div>

            <ul className="mobile-drawer-links" style={{ overflowY: 'auto', textAlign: language === 'ur' ? 'right' : 'left' }}>
              <li><a onClick={() => { setMobileMenuOpen(false); navigate('/'); }}>{t('home')}</a></li>
              <li><a onClick={() => { setMobileMenuOpen(false); navigate('/category/Electronics'); }}>{t('electronics')}</a></li>
              <li><a onClick={() => { setMobileMenuOpen(false); navigate('/category/Women Dresses'); }}>{t('dresses')}</a></li>
              <li><a onClick={() => { setMobileMenuOpen(false); navigate('/category/Karyania'); }}>{t('karyania')}</a></li>
              <li><a onClick={() => { setMobileMenuOpen(false); navigate('/category/Deals'); }}>{t('deals')}</a></li>
            </ul>

            <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {currentUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: language === 'ur' ? 'right' : 'left' }}>
                  <div style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>👤 {currentUser.name}</div>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); onOpenWishlist(); }}
                    style={{ 
                      background: 'transparent', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      color: '#fff', 
                      padding: '10px', 
                      borderRadius: '6px', 
                      fontSize: '13px', 
                      cursor: 'pointer', 
                      textAlign: language === 'ur' ? 'right' : 'left' 
                    }}
                  >
                    ♡ {t('wishlist')}
                  </button>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); onOpenOrders(); }}
                    style={{ 
                      background: 'transparent', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      color: '#fff', 
                      padding: '10px', 
                      borderRadius: '6px', 
                      fontSize: '13px', 
                      cursor: 'pointer', 
                      textAlign: language === 'ur' ? 'right' : 'left' 
                    }}
                  >
                    📄 {t('my_orders')}
                  </button>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {t('sign_out')}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }}
                  style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                >
                  {t('sign_in')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
