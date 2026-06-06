import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { UserProvider, UserContext } from './context/UserContext';
import Storefront from './components/Storefront';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import CategoryPage from './components/CategoryPage';
import CursorGlow from './components/CursorGlow';
import WelcomeScreen from './components/WelcomeScreen';

function AppContent() {
  const { currentUser } = useContext(UserContext);
  
  // Admin authentication state
  const [isAdminAuth, setIsAdminAuth] = useState(localStorage.getItem('isAdmin') === 'true');

  const handleAdminLogin = () => {
    localStorage.setItem('isAdmin', 'true');
    setIsAdminAuth(true);
  };

  if (!currentUser) {
    return <WelcomeScreen />;
  }

  return (
    <BrowserRouter>
      <CursorGlow />
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/admin" element={
          isAdminAuth ? <Admin /> : <AdminLogin onLogin={handleAdminLogin} />
        } />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ProductProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ProductProvider>
  );
}

export default App;
