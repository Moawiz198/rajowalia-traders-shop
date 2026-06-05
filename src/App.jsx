import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Storefront from './components/Storefront';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import CategoryPage from './components/CategoryPage';
import CursorGlow from './components/CursorGlow';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [cartCount, setCartCount] = useState(3);
  const [hasEnteredStore, setHasEnteredStore] = useState(false);
  
  // Admin authentication state
  const [isAdminAuth, setIsAdminAuth] = useState(localStorage.getItem('isAdmin') === 'true');

  const handleAdminLogin = () => {
    localStorage.setItem('isAdmin', 'true');
    setIsAdminAuth(true);
  };

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
    
    // Scale animation on the cart dot
    const dot = document.getElementById('cart-dot');
    if (dot) {
      dot.style.transform = 'scale(1.5)';
      setTimeout(() => {
        dot.style.transform = '';
      }, 300);
    }
  };

  if (!hasEnteredStore) {
    return <WelcomeScreen onEnter={() => setHasEnteredStore(true)} />;
  }

  return (
    <ProductProvider>
      <BrowserRouter>
        <CursorGlow />
        <Routes>
          <Route path="/" element={
            <Storefront cartCount={cartCount} onAddToCart={handleAddToCart} />
          } />
          <Route path="/admin" element={
            isAdminAuth ? <Admin /> : <AdminLogin onLogin={handleAdminLogin} />
          } />
          <Route path="/category/:categoryId" element={<CategoryPage cartCount={cartCount} onAddToCart={handleAddToCart} />} />
        </Routes>
      </BrowserRouter>
    </ProductProvider>
  );
}

export default App;
