import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const ProductContext = createContext();

const initialProducts = [
  { id: 1, emoji: '📱', brand: 'Samsung', name: 'Galaxy S24 Ultra 5G', price: 289999, oldPrice: 350000, badge: 'HOT', condition: 'New', stars: 5, inStock: true, discountPercentage: 17, category: 'Electronics' },
  { id: 2, emoji: '💻', brand: 'Apple', name: 'MacBook Air M3 2024', price: 449000, oldPrice: null, badge: 'NEW', condition: 'New', stars: 5, inStock: true, discountPercentage: 0, category: 'Electronics' },
  { id: 4, emoji: '⌚', brand: 'Apple', name: 'Apple Watch Series 10', price: 89999, oldPrice: null, badge: 'HOT', condition: 'New', stars: 5, inStock: false, discountPercentage: 0, category: 'Electronics' },
  { id: 6, emoji: '👗', brand: 'H&M', name: 'Floral Summer Dress', price: 4500, oldPrice: null, badge: '', condition: 'New', stars: 5, inStock: true, discountPercentage: 0, category: 'Dresses' },
  { id: 7, emoji: '💃', brand: 'Zara', name: 'Silk Maxi Evening Gown', price: 14500, oldPrice: 18000, badge: 'HOT', condition: 'New', stars: 5, inStock: true, discountPercentage: 19, category: 'Dresses' },
  { id: 8, emoji: '👘', brand: 'Sana Safinaz', name: 'Luxury Printed Lawn Suit', price: 8900, oldPrice: 12000, badge: 'SALE', condition: 'New', stars: 4, inStock: true, discountPercentage: 25, category: 'Dresses' },
  
  // Karyana Products
  { id: 10, emoji: '🍬', brand: 'Refined', name: 'Fine White Sugar 1kg', price: 150, oldPrice: null, badge: '', condition: 'New', stars: 4, inStock: true, discountPercentage: 0, category: 'Karyania - Sugar' },
  { id: 15, emoji: '🟤', brand: 'Organic Desi', name: 'Premium Brown Sugar 1kg', price: 220, oldPrice: null, badge: 'NEW', condition: 'New', stars: 5, inStock: true, discountPercentage: 0, category: 'Karyania - Brown Sugar' },
  { id: 16, emoji: '🪵', brand: 'Desi Pure', name: 'Pure Organic Gurr 1kg', price: 280, oldPrice: 320, badge: 'BEST', condition: 'New', stars: 5, inStock: true, discountPercentage: 12, category: 'Karyania - Gurr' }
];

const mapFromDb = (p) => {
  let condition = 'New';
  let badge = p.badge || '';
  let description = '';
  if (badge.includes('|')) {
    const parts = badge.split('|');
    condition = parts[0] || 'New';
    badge = parts[1] || '';
    description = parts[2] || '';
  } else if (badge.toLowerCase() === 'used') {
    condition = 'Used';
    badge = '';
  } else if (badge.toLowerCase() === 'new') {
    condition = 'New';
    badge = '';
  }
  return {
    id: p.id,
    emoji: p.emoji || '',
    image: p.image || '',
    brand: p.brand || '',
    name: p.name || '',
    price: Number(p.price || 0),
    oldPrice: p.old_price ? Number(p.old_price) : null,
    badge: badge,
    condition: condition,
    description: description,
    stars: Number(p.stars || 5),
    inStock: (p.in_stock !== false) && (p.stock === null || p.stock === undefined || Number(p.stock) > 0),
    discountPercentage: Number(p.discount_percentage || 0),
    category: p.category || 'Electronics',
    weightOptions: p.weight_options || '',
    stock: p.stock === null || p.stock === undefined ? 10 : Number(p.stock)
  };
};

const mapToDb = (p) => ({
  emoji: p.emoji,
  image: p.image,
  brand: p.brand,
  name: p.name,
  price: p.price,
  old_price: p.oldPrice || null,
  badge: `${p.condition || 'New'}|${p.badge || ''}|${p.description || ''}`,
  stars: p.stars,
  in_stock: p.inStock,
  discount_percentage: p.discountPercentage || 0,
  category: p.category,
  weight_options: p.weightOptions || null,
  stock: p.stock !== undefined ? Number(p.stock) : 10
});

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    storeName: 'Rajowalia Traders',
    phone: '+92 300 1234567',
    email: 'hq@rajowalia.com',
    currency: 'PKR',
    maintenance: false,
    promoEnabled: true,
    holidayMode: false,
    holidayTextEn: 'Deliveries may be delayed by 2-3 days due to holidays.',
    holidayTextUr: 'تعطیلات کی وجہ سے ڈیلیوری میں 2 سے 3 دن کی تاخیر ہو سکتی ہے۔',
    durationRykEn: '48 Hours',
    durationRykUr: '48 گھنٹے',
    durationPkEn: '3-5 Days',
    durationPkUr: '3 سے 5 دن',
    web3formsKey: ''
  });

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const dbSettings = {};
        data.forEach(item => {
          dbSettings[item.key] = item.value === 'true' ? true : item.value === 'false' ? false : item.value;
        });
        setSettings(prev => ({ ...prev, ...dbSettings }));
      }
    } catch (err) {
      console.warn('Failed to load settings from Supabase:', err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      if (data) setCategories(data);
    } catch (err) {
      console.warn('Failed to load categories from Supabase:', err.message);
    }
  };

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
      if (data) {
        setProducts(data.map(mapFromDb));
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
    fetchCategories();
    fetchSettings();
    fetchCategories();
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
        alert('Product successfully added to Supabase!');
      } else {
        setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
      }
    } catch (err) {
      console.error('Failed to add product to Supabase:', err.message);
      alert('Database Save Error: ' + err.message + '\n\nPlease make sure you have run the ALTER TABLE sql commands in your Supabase SQL Editor!');
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
      alert('Product successfully updated in Supabase!');
    } catch (err) {
      console.error('Failed to update product in Supabase:', err.message);
      alert('Database Save Error: ' + err.message + '\n\nPlease make sure you have run the ALTER TABLE sql commands in your Supabase SQL Editor!');
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
    }
  };

  return (
    <ProductContext.Provider value={{ products, categories, settings, loading, addProduct, removeProduct, updateProduct, fetchProducts, fetchCategories, fetchSettings }}>
      {children}
    </ProductContext.Provider>
  );
};

