import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { ProductContext } from '../context/ProductContext';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import WishlistModal from './WishlistModal';
import OrdersModal from './OrdersModal';
import AuthModal from './AuthModal';

export default function MainLayout({ children }) {
  const { language } = useContext(LanguageContext);
  const { settings } = useContext(ProductContext);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  return (
    <div className={language === 'ur' ? 'rtl' : ''} style={{ direction: language === 'ur' ? 'rtl' : 'ltr' }}>
      <Navbar 
        onOpenCart={() => setCartOpen(true)} 
        onOpenWishlist={() => setWishlistOpen(true)} 
        onOpenOrders={() => setOrdersOpen(true)} 
      />
      
      {settings.holidayMode && (
        <div style={{ 
          background: 'linear-gradient(90deg, #b91c1c, #7f1d1d)', 
          color: '#fff', 
          textAlign: 'center', 
          padding: '10px 15px', 
          fontSize: '12px', 
          fontWeight: 600, 
          letterSpacing: '0.5px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          zIndex: 99,
          position: 'relative'
        }}>
          <span>📢</span>
          <span>{language === 'ur' ? settings.holidayTextUr : settings.holidayTextEn}</span>
        </div>
      )}
      
      {children}
      
      <Footer />

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistModal isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <OrdersModal isOpen={ordersOpen} onClose={() => setOrdersOpen(false)} />
      
      {/* Deferred signup auth modal */}
      <AuthModal />
    </div>
  );
}
