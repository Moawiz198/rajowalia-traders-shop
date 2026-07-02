import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import WishlistModal from './WishlistModal';
import OrdersModal from './OrdersModal';
import AuthModal from './AuthModal';

export default function MainLayout({ children }) {
  const { language } = useContext(LanguageContext);
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
