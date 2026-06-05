import React, { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

const initialProducts = [
  { id: 1, emoji: '📱', brand: 'Samsung', name: 'Galaxy S24 Ultra 5G', price: 289999, oldPrice: 350000, badge: 'HOT', stars: 5, inStock: true, discountPercentage: 17, category: 'Electronics' },
  { id: 2, emoji: '💻', brand: 'Apple', name: 'MacBook Air M3 2024', price: 449000, oldPrice: null, badge: 'NEW', stars: 5, inStock: true, discountPercentage: 0, category: 'Gadgets' },
  { id: 3, emoji: '👟', brand: 'Nike', name: 'Air Jordan Retro High', price: 18500, oldPrice: 24000, badge: 'SALE', stars: 4, inStock: true, discountPercentage: 22, category: 'Suits' },
  { id: 4, emoji: '⌚', brand: 'Apple', name: 'Apple Watch Series 10', price: 89999, oldPrice: null, badge: 'HOT', stars: 5, inStock: false, discountPercentage: 0, category: 'Gadgets' },
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('luxeProducts');
    if (saved) {
      return JSON.parse(saved);
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('luxeProducts', JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
