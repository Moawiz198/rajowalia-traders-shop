import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { UserProvider, UserContext } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import Storefront from './components/Storefront';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import CategoryPage from './components/CategoryPage';
import ProductPage from './components/ProductPage';
import CursorGlow from './components/CursorGlow';
import WelcomeScreen from './components/WelcomeScreen';

function AppContent() {
  const [hasEntered, setHasEntered] = useState(false);
  
  // Admin authentication state
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  const handleAdminLogin = () => {
    setIsAdminAuth(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuth(false);
  };

  if (!hasEntered) {
    return <WelcomeScreen onEnter={() => setHasEntered(true)} />;
  }

  return (
    <BrowserRouter>
      <CursorGlow />
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/admin" element={
          isAdminAuth ? <Admin onLogout={handleAdminLogout} /> : <AdminLogin onLogin={handleAdminLogin} />
        } />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ProductProvider>
          <UserProvider>
            <AppContent />
          </UserProvider>
        </ProductProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
