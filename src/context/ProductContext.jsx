import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const ProductContext = createContext();

const initialProducts = [
  { id: 1, emoji: '📱', brand: 'Samsung', name: 'Galaxy S24 Ultra 5G', price: 289999, oldPrice: 350000, badge: 'HOT', stars: 5, inStock: true, discountPercentage: 17, category: 'Electronics' },
  { id: 2, emoji: '💻', brand: 'Apple', name: 'MacBook Air M3 2024', price: 449000, oldPrice: null, badge: 'NEW', stars: 5, inStock: true, discountPercentage: 0, category: 'Gadgets' },
  { id: 3, emoji: '👟', brand: 'Nike', name: 'Air Jordan Retro High', price: 18500, oldPrice: 24000, badge: 'SALE', stars: 4, inStock: true, discountPercentage: 22, category: 'Suits' },
  { id: 4, emoji: '⌚', brand: 'Apple', name: 'Apple Watch Series 10', price: 89999, oldPrice: null, badge: 'HOT', stars: 5, inStock: false, discountPercentage: 0, category: 'Gadgets' },
];

const mapFromDb = (p) => ({
  id: p.id,
  emoji: p.emoji || '',
  image: p.image || '',
  brand: p.brand || '',
  name: p.name || '',
  price: Number(p.price || 0),
  oldPrice: p.old_price ? Number(p.old_price) : null,
  badge: p.badge || '',
  stars: Number(p.stars || 5),
  inStock: p.in_stock !== false,
  discountPercentage: Number(p.discount_percentage || 0),
  category: p.category || 'Electronics'
});

const mapToDb = (p) => ({
  emoji: p.emoji,
  image: p.image,
  brand: p.brand,
  name: p.name,
  price: p.price,
  old_price: p.oldPrice || null,
  badge: p.badge || null,
  stars: p.stars,
  in_stock: p.inStock,
  discount_percentage: p.discountPercentage || 0,
  category: p.category
});

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        throw error;
      }
      if (data && data.length > 0) {
        setProducts(data.map(mapFromDb));
      } else {
        // Seed initialProducts locally if Supabase is empty or connection fails
        setProducts(initialProducts);
      }
    } catch (err) {
      console.warn('Failed to load products from Supabase, using local defaults:', err.message);
      setProducts(initialProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    const dbProduct = mapToDb(product);
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setProducts((prev) => [...prev, mapFromDb(data[0])]);
      } else {
        setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
      }
    } catch (err) {
      console.error('Failed to add product to Supabase:', err.message);
      setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
    }
  };

  const removeProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to remove product from Supabase:', err.message);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const updateProduct = async (id, updatedData) => {
    const dbData = mapToDb({ ...updatedData });
    try {
      const { error } = await supabase
        .from('products')
        .update(dbData)
        .eq('id', id);

      if (error) throw error;
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
    } catch (err) {
      console.error('Failed to update product in Supabase:', err.message);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, removeProduct, updateProduct, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

