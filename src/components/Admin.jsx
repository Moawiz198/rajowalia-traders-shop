import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { supabase } from '../lib/supabase';

// Mock/fallback datasets for Demo Mode
const mockOrders = [
  { id: '#LX-9402', customer: 'Zainab Ahmed', location: 'Lahore', sector: 'Electronics', item: 'iPhone 16', price: 399999, method: 'PREPAID', status_icon: '🚚', status_text: 'In Transit via TCS' },
  { id: '#LX-9401', customer: 'Muhammad Ali', location: 'Karachi', sector: 'Karyana', item: 'Restock Bundle', price: 8450, method: 'COD', status_icon: '📦', status_text: 'Packing Phase' },
  { id: '#LX-9400', customer: 'Hamza Khan', location: 'Islamabad', sector: 'Electronics', item: 'Sony XM5', price: 52000, method: 'COD', status_icon: '⚠️', status_text: 'Pending Call Verification' },
  { id: '#LX-9399', customer: 'Ayesha Umar', location: 'Multan', sector: 'Women Dresses', item: 'Silk Gown', price: 18500, method: 'PREPAID', status_icon: '✅', status_text: 'Dispatched' },
];

const mockCustomers = [
  { id: 1, name: 'Zainab Ahmed', email: 'zainab@example.com', phone: '+92 300 1234567', location: 'Lahore', total_orders: 12 },
  { id: 2, name: 'Muhammad Ali', email: 'ali@example.com', phone: '+92 321 7654321', location: 'Karachi', total_orders: 8 },
  { id: 3, name: 'Hamza Khan', email: 'hamza@example.com', phone: '+92 333 9876543', location: 'Islamabad', total_orders: 5 },
];

const mockCategories = [
  { id: 1, name: 'Electronics', emoji: '📱' },
  { id: 4, name: 'Women Dresses', emoji: '👗' },
  { id: 7, name: 'Karyania', emoji: '🛒' },
];

const mockDiscounts = [
  { id: 1, code: 'LUXE50', discount_percent: 50, active: true },
  { id: 2, code: 'WELCOME10', discount_percent: 10, active: true },
  { id: 3, code: 'WINTER15', discount_percent: 15, active: false },
];

const mockShipping = [
  { id: 1, name: 'TCS Express', rate: 250, duration: '1-2 Days' },
  { id: 2, name: 'Leopard Courier', rate: 200, duration: '2-3 Days' },
  { id: 3, name: 'M&P Logistics', rate: 180, duration: '2-4 Days' },
];

export default function Admin({ onLogout }) {
  const { products, addProduct, removeProduct, updateProduct } = useContext(ProductContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Database States
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [shipping, setShipping] = useState([]);
  const [settings, setSettings] = useState({
    storeName: 'Rajowalia Traders',
    phone: '+92 300 1234567',
    email: 'hq@rajowalia.com',
    currency: 'PKR',
    maintenance: false,
    promoEnabled: true,
  });

  // Product Inventory Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    emoji: '', image: '', brand: '', name: '', price: '', oldPrice: '', 
    badge: '', condition: 'New', stars: '5', inStock: true, discountPercentage: '0', 
    category: 'Electronics', weightOptions: '', stock: '10'
  });

  const [tempPrimary, setTempPrimary] = useState('Electronics');
  const [tempSub, setTempSub] = useState('');
  const [customSub, setCustomSub] = useState('');

  const getAvailableSubsForPrimary = (prim) => {
    const subs = new Set();
    
    // Default subcategories
    if (prim === 'Karyania') {
      ['Sugar', 'Brown Sugar', 'Gurr'].forEach(s => subs.add(s));
    } else if (prim === 'Women Dresses') {
      ['Lawn', 'Silk', 'Evening Gown'].forEach(s => subs.add(s));
    } else if (prim === 'Electronics') {
      ['Gadgets', 'Accessories', 'Smartwatches'].forEach(s => subs.add(s));
    }

    // Dynamic ones from categories state
    categories.forEach(cat => {
      if (cat.name.startsWith(`${prim} - `)) {
        const sub = cat.name.replace(`${prim} - `, '').trim();
        if (sub) subs.add(sub);
      } else if (cat.name.startsWith(`${prim}-`)) {
        const sub = cat.name.replace(`${prim}-`, '').trim();
        if (sub) subs.add(sub);
      }
    });

    return Array.from(subs);
  };

  const availableSubs = getAvailableSubsForPrimary(tempPrimary);

  const handlePrimaryChange = (e) => {
    const prim = e.target.value;
    setTempPrimary(prim);
    setTempSub('');
    setCustomSub('');
    setFormData(prev => ({ ...prev, category: prim }));
  };

  const handleSubChange = (e) => {
    const sub = e.target.value;
    setTempSub(sub);
    if (sub === 'custom') {
      setFormData(prev => ({ 
        ...prev, 
        category: customSub ? `${tempPrimary} - ${customSub.trim()}` : tempPrimary 
      }));
    } else {
      setCustomSub('');
      setFormData(prev => ({ 
        ...prev, 
        category: sub ? `${tempPrimary} - ${sub}` : tempPrimary 
      }));
    }
  };

  // Generic Form States for other modules
  const [orderForm, setOrderForm] = useState({ customer: '', location: '', sector: 'Electronics', item: '', price: '', method: 'COD', status_icon: '📦', status_text: 'Pending Call' });
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '', location: '', totalOrders: '0' });
  const [categoryForm, setCategoryForm] = useState({ parent: 'Karyania', sub: '', emoji: '' });
  const [discountForm, setDiscountForm] = useState({ code: '', discountPercent: '', active: true });
  const [shippingForm, setShippingForm] = useState({ name: '', rate: '', duration: '' });
  const [subscribers, setSubscribers] = useState([]);

  // Verify DB Connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const url = import.meta.env.VITE_SUPABASE_URL;
      if (!url || url.includes('YOUR_PROJECT_REF') || url.includes('placeholder')) {
        setDbStatus('Demo Mode (Unconfigured)');
        setIsDemoMode(true);
        return;
      }
      try {
        const { error } = await supabase.from('products').select('id').limit(1);
        if (error) throw error;
        setDbStatus('Connected');
        setIsDemoMode(false);
      } catch (err) {
        console.warn('Supabase check failed, falling back to Demo Mode:', err.message);
        setDbStatus('Demo Mode (Connection Error)');
        setIsDemoMode(true);
      }
    };
    checkConnection();
  }, []);

  // Fetch lists depending on active tab
  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'orders') fetchOrders();
    if (activeTab === 'customers') fetchCustomers();
    if (activeTab === 'categories') fetchCategories();
    if (activeTab === 'discounts') fetchDiscounts();
    if (activeTab === 'shipping') fetchShipping();
    if (activeTab === 'settings') fetchSettings();
    if (activeTab === 'subscribers') fetchSubscribers();
  }, [activeTab, isDemoMode]);

  // DB Fetching Functions
  const fetchOrders = async () => {
    if (isDemoMode) {
      setOrders(mockOrders);
      return;
    }
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Fetch orders failed:', err.message);
      setOrders(mockOrders);
    }
  };

  const fetchCustomers = async () => {
    if (isDemoMode) {
      setCustomers(mockCustomers);
      return;
    }
    try {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Fetch customers failed:', err.message);
      setCustomers(mockCustomers);
    }
  };

  const fetchCategories = async () => {
    if (isDemoMode) {
      setCategories(mockCategories);
      return;
    }
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Fetch categories failed:', err.message);
      setCategories(mockCategories);
    }
  };

  const fetchDiscounts = async () => {
    if (isDemoMode) {
      setDiscounts(mockDiscounts);
      return;
    }
    try {
      const { data, error } = await supabase.from('discounts').select('*').order('code');
      if (error) throw error;
      setDiscounts(data || []);
    } catch (err) {
      console.error('Fetch discounts failed:', err.message);
      setDiscounts(mockDiscounts);
    }
  };

  const fetchShipping = async () => {
    if (isDemoMode) {
      setShipping(mockShipping);
      return;
    }
    try {
      const { data, error } = await supabase.from('shipping').select('*').order('name');
      if (error) throw error;
      setShipping(data || []);
    } catch (err) {
      console.error('Fetch shipping failed:', err.message);
      setShipping(mockShipping);
    }
  };

  const fetchSettings = async () => {
    if (isDemoMode) {
      const saved = localStorage.getItem('luxeSettings');
      if (saved) setSettings(JSON.parse(saved));
      return;
    }
    try {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = {};
        data.forEach(item => {
          let val = item.value;
          if (val === 'true') val = true;
          if (val === 'false') val = false;
          mapped[item.key] = val;
        });
        setSettings(prev => ({ ...prev, ...mapped }));
      }
    } catch (err) {
      console.error('Fetch settings failed:', err.message);
    }
  };

  const fetchSubscribers = async () => {
    if (isDemoMode) {
      const saved = localStorage.getItem('luxeSubscribers');
      setSubscribers(saved ? JSON.parse(saved) : [
        { id: 1, email: 'customer1@example.com', created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, email: 'customer2@example.com', created_at: new Date(Date.now() - 172800000).toISOString() }
      ]);
      return;
    }
    try {
      const { data, error } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setSubscribers(data || []);
    } catch (err) {
      console.error('Fetch subscribers failed:', err.message);
      const saved = localStorage.getItem('luxeSubscribers');
      setSubscribers(saved ? JSON.parse(saved) : []);
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (isDemoMode) {
      setSubscribers(prev => {
        const filtered = prev.filter(s => s.id !== id);
        localStorage.setItem('luxeSubscribers', JSON.stringify(filtered));
        return filtered;
      });
      return;
    }
    try {
      const { error } = await supabase.from('subscribers').delete().eq('id', id);
      if (error) throw error;
      setSubscribers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete subscriber: ' + err.message);
    }
  };

  const copySubscriberEmails = () => {
    if (subscribers.length === 0) {
      alert('No subscribers to copy!');
      return;
    }
    const list = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(list);
    alert('Subscriber emails copied to clipboard! You can paste them in the BCC field of your email client.');
  };

  const emailSubscribers = () => {
    if (subscribers.length === 0) {
      alert('No subscribers to email!');
      return;
    }
    const list = subscribers.map(s => s.email).join(',');
    window.open(`mailto:?bcc=${encodeURIComponent(list)}&subject=Special Deals from Rajowalia Traders`);
  };

  // Mutations
  const handleAddOrder = async (e) => {
    if (e) e.preventDefault();
    const newOrder = {
      id: `#LX-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: orderForm.customer || 'Guest Customer',
      location: orderForm.location || 'Unknown',
      sector: orderForm.sector,
      item: orderForm.item || 'Generic Item',
      price: Number(orderForm.price || 0),
      method: orderForm.method,
      status_icon: orderForm.status_icon,
      status_text: orderForm.status_text
    };

    if (isDemoMode) {
      setOrders(prev => [newOrder, ...prev]);
      setOrderForm({ customer: '', location: '', sector: 'Electronics', item: '', price: '', method: 'COD', status_icon: '📦', status_text: 'Pending Call' });
      return;
    }
    try {
      const { error } = await supabase.from('orders').insert([newOrder]);
      if (error) throw error;
      setOrders(prev => [newOrder, ...prev]);
      setOrderForm({ customer: '', location: '', sector: 'Electronics', item: '', price: '', method: 'COD', status_icon: '📦', status_text: 'Pending Call' });
    } catch (err) {
      alert('Failed to insert order: ' + err.message);
    }
  };

  const handleUpdateOrderStatus = async (id, statusText, statusIcon) => {
    if (isDemoMode) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status_text: statusText, status_icon: statusIcon } : o));
      return;
    }
    try {
      const { error } = await supabase.from('orders').update({ status_text: statusText, status_icon: statusIcon }).eq('id', id);
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status_text: statusText, status_icon: statusIcon } : o));
    } catch (err) {
      alert('Failed to update order: ' + err.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (isDemoMode) {
      setOrders(prev => prev.filter(o => o.id !== id));
      return;
    }
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      alert('Failed to delete order: ' + err.message);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const newCust = {
      name: customerForm.name,
      email: customerForm.email,
      phone: customerForm.phone,
      location: customerForm.location,
      total_orders: Number(customerForm.totalOrders || 0)
    };

    if (isDemoMode) {
      setCustomers(prev => [...prev, { ...newCust, id: Date.now() }]);
      setCustomerForm({ name: '', email: '', phone: '', location: '', totalOrders: '0' });
      return;
    }
    try {
      const { data, error } = await supabase.from('customers').insert([newCust]).select();
      if (error) throw error;
      if (data && data[0]) setCustomers(prev => [...prev, data[0]]);
      setCustomerForm({ name: '', email: '', phone: '', location: '', totalOrders: '0' });
    } catch (err) {
      alert('Failed to add customer: ' + err.message);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (isDemoMode) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      return;
    }
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete customer: ' + err.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.sub) return;

    const subVal = categoryForm.sub.trim();
    let urduTrans = '';
    
    try {
      const lowerSub = subVal.toLowerCase();
      const dictMatch = {
        'sugar': 'چینی', 'brown sugar': 'شکر', 'gurr': 'گڑ', 'lawn': 'لان', 'silk': 'سلک',
        'evening gown': 'شام کا لباس', 'gadgets': 'آلات', 'accessories': 'سامان', 'smartwatches': 'اسمارٹ واچز',
        'mobiles': 'موبائلز', 'dresses': 'کپڑے', 'electronics': 'الیکٹرانکس', 'karyania': 'کریانہ',
        'rice': 'چاول', 'flour': 'آٹا', 'spices': 'مصالحے', 'oil': 'تیل', 'ghee': 'گھی',
        'tea': 'چائے', 'milk': 'دودھ', 'watches': 'گھڑیاں', 'laptops': 'لیپ ٹاپس'
      }[lowerSub];

      if (dictMatch) {
        urduTrans = dictMatch;
      } else {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ur&dt=t&q=${encodeURIComponent(subVal)}`);
        const json = await res.json();
        if (json && json[0] && json[0][0] && json[0][0][0]) {
          urduTrans = json[0][0][0];
        }
      }
    } catch (err) {
      console.warn('Auto translation failed:', err);
    }

    const finalName = urduTrans 
      ? `${categoryForm.parent} - ${subVal} | ${urduTrans}`
      : `${categoryForm.parent} - ${subVal}`;

    const newCat = {
      name: finalName,
      emoji: categoryForm.emoji || '📁'
    };

    if (isDemoMode) {
      setCategories(prev => [...prev, { ...newCat, id: Date.now() }]);
      setCategoryForm({ parent: 'Karyania', sub: '', emoji: '' });
      return;
    }
    try {
      const { data, error } = await supabase.from('categories').insert([newCat]).select();
      if (error) throw error;
      if (data && data[0]) setCategories(prev => [...prev, data[0]]);
      setCategoryForm({ parent: 'Karyania', sub: '', emoji: '' });
    } catch (err) {
      alert('Failed to add category: ' + err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (isDemoMode) {
      setCategories(prev => prev.filter(c => c.id !== id));
      return;
    }
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete category: ' + err.message);
    }
  };

  const handleAddDiscount = async (e) => {
    e.preventDefault();
    const newDisc = {
      code: discountForm.code.toUpperCase(),
      discount_percent: Number(discountForm.discountPercent),
      active: discountForm.active
    };

    if (isDemoMode) {
      setDiscounts(prev => [...prev, { ...newDisc, id: Date.now() }]);
      setDiscountForm({ code: '', discountPercent: '', active: true });
      return;
    }
    try {
      const { data, error } = await supabase.from('discounts').insert([newDisc]).select();
      if (error) throw error;
      if (data && data[0]) setDiscounts(prev => [...prev, data[0]]);
      setDiscountForm({ code: '', discountPercent: '', active: true });
    } catch (err) {
      alert('Failed to add discount code: ' + err.message);
    }
  };

  const handleToggleDiscount = async (id, currentStatus) => {
    const nextStatus = !currentStatus;
    if (isDemoMode) {
      setDiscounts(prev => prev.map(d => d.id === id ? { ...d, active: nextStatus } : d));
      return;
    }
    try {
      const { error } = await supabase.from('discounts').update({ active: nextStatus }).eq('id', id);
      if (error) throw error;
      setDiscounts(prev => prev.map(d => d.id === id ? { ...d, active: nextStatus } : d));
    } catch (err) {
      alert('Failed to update discount: ' + err.message);
    }
  };

  const handleDeleteDiscount = async (id) => {
    if (isDemoMode) {
      setDiscounts(prev => prev.filter(d => d.id !== id));
      return;
    }
    try {
      const { error } = await supabase.from('discounts').delete().eq('id', id);
      if (error) throw error;
      setDiscounts(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      alert('Failed to delete discount: ' + err.message);
    }
  };

  const handleAddShipping = async (e) => {
    e.preventDefault();
    const newShip = {
      name: shippingForm.name,
      rate: Number(shippingForm.rate),
      duration: shippingForm.duration
    };

    if (isDemoMode) {
      setShipping(prev => [...prev, { ...newShip, id: Date.now() }]);
      setShippingForm({ name: '', rate: '', duration: '' });
      return;
    }
    try {
      const { data, error } = await supabase.from('shipping').insert([newShip]).select();
      if (error) throw error;
      if (data && data[0]) setShipping(prev => [...prev, data[0]]);
      setShippingForm({ name: '', rate: '', duration: '' });
    } catch (err) {
      alert('Failed to add courier: ' + err.message);
    }
  };

  const handleDeleteShipping = async (id) => {
    if (isDemoMode) {
      setShipping(prev => prev.filter(s => s.id !== id));
      return;
    }
    try {
      const { error } = await supabase.from('shipping').delete().eq('id', id);
      if (error) throw error;
      setShipping(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete courier: ' + err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (isDemoMode) {
      localStorage.setItem('luxeSettings', JSON.stringify(settings));
      alert('Settings saved locally (Demo mode).');
      return;
    }
    try {
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from('settings')
          .upsert({ key, value: String(value) }, { onConflict: 'key' });
        if (error) throw error;
      }
      localStorage.setItem('luxeSettings', JSON.stringify(settings));
      alert('Settings successfully saved to Supabase!');
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    }
  };

  // Inventory logic (original code updated)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const productData = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      stars: Number(formData.stars),
      discountPercentage: Number(formData.discountPercentage),
      stock: Number(formData.stock || 0)
    };

    if (editingId) {
      updateProduct(editingId, productData);
      setEditingId(null);
    } else {
      addProduct(productData);
    }
    
    // reset form
    setFormData({
      emoji: '', image: '', brand: '', name: '', price: '', oldPrice: '', 
      badge: '', condition: 'New', stars: '5', inStock: true, discountPercentage: '0', 
      category: 'Electronics', weightOptions: '', stock: '10'
    });
    setTempPrimary('Electronics');
    setTempSub('');
    setCustomSub('');
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    const cat = p.category || 'Electronics';
    let prim = cat;
    let sub = '';
    if (cat.includes(' - ')) {
      const parts = cat.split(' - ');
      prim = parts[0];
      sub = parts[1];
    } else if (cat.includes('-')) {
      const parts = cat.split('-');
      prim = parts[0];
      sub = parts[1];
    }
    setTempPrimary(prim);
    
    const currentSubs = getAvailableSubsForPrimary(prim);
    if (sub && !currentSubs.includes(sub)) {
      setTempSub('custom');
      setCustomSub(sub);
    } else {
      setTempSub(sub);
      setCustomSub('');
    }

    setFormData({
      emoji: p.emoji || '', image: p.image || '', brand: p.brand, name: p.name, price: p.price.toString(),
      oldPrice: p.oldPrice ? p.oldPrice.toString() : '',
      badge: p.badge || '', condition: p.condition || 'New', stars: p.stars.toString(), inStock: p.inStock,
      discountPercentage: p.discountPercentage.toString(), category: p.category,
      weightOptions: p.weightOptions || '',
      stock: (p.stock !== undefined ? p.stock : 10).toString()
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      emoji: '', image: '', brand: '', name: '', price: '', oldPrice: '', 
      badge: '', condition: 'New', stars: '5', inStock: true, discountPercentage: '0', 
      category: 'Electronics', weightOptions: '', stock: '10'
    });
    setTempPrimary('Electronics');
    setTempSub('');
    setCustomSub('');
  };

  const placeRandomTestOrder = () => {
    const testNames = ['Aslam Khan', 'Sana Malik', 'Bilal Shah', 'Faisal Riaz', 'Khadija Bibi'];
    const testLocs = ['Karachi', 'Faisalabad', 'Peshawar', 'Rawalpindi', 'Quetta'];
    const testSectors = ['Electronics', 'Women Dresses', 'Karyania'];
    const testItems = ['Samsung S24 Ultra', 'Sony Headphones', 'Silk Maxi Evening Gown', 'Grocery Bulk Restock'];
    
    const randomOrder = {
      customer: testNames[Math.floor(Math.random() * testNames.length)],
      location: testLocs[Math.floor(Math.random() * testLocs.length)],
      sector: testSectors[Math.floor(Math.random() * testSectors.length)],
      item: testItems[Math.floor(Math.random() * testItems.length)],
      price: Math.floor(2500 + Math.random() * 250000),
      method: Math.random() > 0.5 ? 'PREPAID' : 'COD',
      status_icon: '📦',
      status_text: 'Order Placed'
    };

    setOrderForm(randomOrder);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleAddOrder(fakeEvent);
    }, 100);
  };

  return (
    <div className="hq-layout">
      {/* SIDEBAR */}
      <div className="hq-sidebar">
        <div className="hq-brand">
          Rajowalia <span className="hq-tag">HQ</span>
        </div>
        
        <div className="hq-nav-section">
          <div className="hq-nav-title">Core Management</div>
          <div className={`hq-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </div>
          <div className={`hq-nav-link ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            📦 Inventory Items
          </div>
          <div className={`hq-nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            📄 Orders & Invoices
          </div>
          <div className={`hq-nav-link ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
            👥 Customer Base
          </div>
          <div className={`hq-nav-link ${activeTab === 'subscribers' ? 'active' : ''}`} onClick={() => setActiveTab('subscribers')}>
            📧 Subscribers List
          </div>
        </div>

        <div className="hq-nav-section">
          <div className="hq-nav-title">Store Configuration</div>
          <div className={`hq-nav-link ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
            📁 Category Mappings
          </div>
          <div className={`hq-nav-link ${activeTab === 'discounts' ? 'active' : ''}`} onClick={() => setActiveTab('discounts')}>
            🎫 Discount Codes
          </div>
          <div className={`hq-nav-link ${activeTab === 'shipping' ? 'active' : ''}`} onClick={() => setActiveTab('shipping')}>
            🚚 Shipping Couriers
          </div>
          <div className={`hq-nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            ⚙️ System Settings
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div className="hq-nav-link" onClick={() => { if (onLogout) onLogout(); navigate('/'); }}>
            ← Back to Storefront
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="hq-main">
        {/* HEADER CONTROLS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '36px', letterSpacing: '1px', textTransform: 'uppercase' }}>{activeTab} Console</h1>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Manage storefront system properties and inventory parameters</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dbStatus === 'Connected' ? '#22c55e' : '#eab308', display: 'inline-block' }}></span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Database: <span style={{ color: dbStatus === 'Connected' ? '#4ade80' : '#facc15' }}>{dbStatus}</span></span>
          </div>
        </div>

        {/* 1. DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Metric Blocks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="hq-card" style={{ marginBottom: 0, padding: '1.5rem' }}>
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Total Products</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '5px', color: '#ff4d1c' }}>{products.length}</div>
              </div>
              <div className="hq-card" style={{ marginBottom: 0, padding: '1.5rem' }}>
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Active Orders</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '5px', color: '#ff4d1c' }}>{orders.length}</div>
              </div>
              <div className="hq-card" style={{ marginBottom: 0, padding: '1.5rem' }}>
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Customer Base</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '5px', color: '#ff4d1c' }}>{customers.length}</div>
              </div>
              <div className="hq-card" style={{ marginBottom: 0, padding: '1.5rem' }}>
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Est. Revenue</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '5px', color: '#4ade80' }}>
                  {orders.reduce((sum, o) => {
                    const val = typeof o.price === 'number' ? o.price : Number(String(o.price || 0).replace(/[^0-9.-]+/g,""));
                    return sum + (isNaN(val) ? 0 : val);
                  }, 0).toLocaleString()} PKR
                </div>
              </div>
            </div>

            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">LIVE ORDER STREAM</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={placeRandomTestOrder} className="hq-btn" style={{ background: '#334155' }}>Create Test Order</button>
                  <button onClick={fetchOrders} className="hq-btn">Refresh</button>
                </div>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table className="hq-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Sector Category</th>
                      <th>Price Bracket</th>
                      <th>Method</th>
                      <th>Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No orders found</td>
                      </tr>
                    ) : (
                      orders.map((o, i) => (
                        <tr key={i}>
                          <td style={{ color: '#ff4d1c', fontWeight: 'bold' }}>{o.id}</td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#fff' }}>{o.customer}</div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>({o.location})</div>
                          </td>
                          <td>
                            <div style={{ color: '#fff' }}>{o.sector}</div>
                            <div style={{ color: '#94a3b8', fontSize: '12px' }}>({o.item})</div>
                          </td>
                          <td>PKR {Number(o.price || 0).toLocaleString()}</td>
                          <td>
                            <span className={`hq-badge ${String(o.method).toLowerCase()}`}>{o.method}</span>
                          </td>
                          <td>
                            <div className="hq-status">
                              <span>{o.status_icon || '📦'}</span>
                              <span>{o.status_text}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. INVENTORY VIEW */}
        {activeTab === 'inventory' && (
          <div>
            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">{editingId ? 'EDIT INVENTORY ITEM' : 'ADD NEW INVENTORY ITEM'}</h2>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Primary Category</label>
                  <select value={tempPrimary} onChange={handlePrimaryChange} className="hq-input">
                    <option value="Electronics">Electronics</option>
                    <option value="Women Dresses">Women Dresses</option>
                    <option value="Karyania">Karyania</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Sub-Category (Dynamic)</label>
                  <select value={tempSub} onChange={handleSubChange} className="hq-input">
                    <option value="">None / General</option>
                    {availableSubs.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                    <option value="custom">[ Write Custom Subcategory... ]</option>
                  </select>
                  {tempSub === 'custom' && (
                    <div style={{ marginTop: '8px' }}>
                      <input 
                        type="text" 
                        value={customSub} 
                        onChange={(e) => {
                          setCustomSub(e.target.value);
                          setFormData(prev => ({ 
                            ...prev, 
                            category: e.target.value ? `${tempPrimary} - ${e.target.value.trim()}` : tempPrimary 
                          }));
                        }} 
                        placeholder="Type custom subcategory name" 
                        className="hq-input" 
                        required 
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Product Image / Emoji</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        {formData.emoji || '📷'}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hq-input" style={{ padding: '5px' }} />
                      <input type="text" name="emoji" value={formData.emoji} onChange={handleChange} placeholder="Or enter emoji (e.g. 📱)" className="hq-input" />
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Brand Name</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Samsung" className="hq-input" required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Product Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Galaxy S24" className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Price (PKR)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="289999" className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Old Price (Optional)</label>
                  <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange} placeholder="350000" className="hq-input" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Discount %</label>
                  <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} placeholder="e.g. 20" className="hq-input" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Badge (e.g. HOT)</label>
                  <input type="text" name="badge" value={formData.badge} onChange={handleChange} className="hq-input" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Product Condition</label>
                  <select name="condition" value={formData.condition} onChange={handleChange} className="hq-input">
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Stock Quantity</label>
                  <input type="number" name="stock" value={formData.stock || ''} onChange={handleChange} placeholder="e.g. 10" className="hq-input" min="0" required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Weight / Size Options (Comma-separated, optional)</label>
                  <input type="text" name="weightOptions" value={formData.weightOptions || ''} onChange={handleChange} placeholder="e.g. 500g, 1kg, 2kg or S, M, L" className="hq-input" />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button type="submit" className="hq-btn">{editingId ? 'Update Item' : 'Add Item'}</button>
                  {editingId && <button type="button" onClick={cancelEdit} className="hq-btn" style={{ background: '#334155' }}>Cancel</button>}
                </div>
              </form>
            </div>

            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">CURRENT INVENTORY</h2>
              </div>
              <table className="hq-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                            {p.image ? <img src={p.image} alt="prod" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '24px' }}>{p.emoji}</span>}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#fff' }}>{p.name}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {p.brand} • {p.category} • <span style={{ color: p.condition === 'Used' ? '#ffd700' : '#4ade80', fontWeight: 600 }}>{p.condition || 'New'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#fff' }}>PKR {p.price.toLocaleString()}</td>
                      <td>
                        <span className="hq-badge" style={{ background: p.inStock ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: p.inStock ? '#4ade80' : '#ef4444' }}>
                          {p.inStock ? `${p.stock !== undefined ? p.stock : 10} Left` : 'Sold Out'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleEdit(p)} className="hq-btn" style={{ background: '#334155', marginRight: '10px' }}>Edit</button>
                        <button onClick={() => removeProduct(p.id)} className="hq-btn" style={{ background: '#ef4444' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ORDERS VIEW */}
        {activeTab === 'orders' && (
          <div>
            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">MANUAL ORDER INVOICING</h2>
              </div>
              <form onSubmit={handleAddOrder} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Customer Name</label>
                  <input type="text" value={orderForm.customer} onChange={e => setOrderForm({...orderForm, customer: e.target.value})} placeholder="e.g. Zainab Ahmed" className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Customer Location</label>
                  <input type="text" value={orderForm.location} onChange={e => setOrderForm({...orderForm, location: e.target.value})} placeholder="e.g. Lahore" className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Sector Category</label>
                  <select value={orderForm.sector} onChange={e => setOrderForm({...orderForm, sector: e.target.value})} className="hq-input">
                    <option value="Electronics">Electronics</option>
                    <option value="Gadgets">Gadgets</option>
                    <option value="Suits">Suits</option>
                    <option value="Karyana">Karyana</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Item Description</label>
                  <input type="text" value={orderForm.item} onChange={e => setOrderForm({...orderForm, item: e.target.value})} placeholder="e.g. iPhone 16" className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Amount (PKR)</label>
                  <input type="number" value={orderForm.price} onChange={e => setOrderForm({...orderForm, price: e.target.value})} placeholder="e.g. 399999" className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Payment Method</label>
                  <select value={orderForm.method} onChange={e => setOrderForm({...orderForm, method: e.target.value})} className="hq-input">
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="PREPAID">Prepaid Card/Bank</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Fulfillment Status Description</label>
                  <input type="text" value={orderForm.status_text} onChange={e => setOrderForm({...orderForm, status_text: e.target.value})} placeholder="e.g. In Transit via TCS" className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Status Icon (Emoji)</label>
                  <input type="text" value={orderForm.status_icon} onChange={e => setOrderForm({...orderForm, status_icon: e.target.value})} placeholder="e.g. 🚚, 📦, ✅" className="hq-input" required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="hq-btn">Generate Invoice / Order</button>
                </div>
              </form>
            </div>

            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">INVOICES & COMPLETED TRANSFERS</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="hq-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Sector & Item</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Fulfillment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, idx) => (
                      <tr key={idx}>
                        <td style={{ color: '#ff4d1c', fontWeight: 'bold' }}>{o.id}</td>
                        <td>
                          <div style={{ color: '#fff', fontWeight: 600 }}>{o.customer}</div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>{o.location}</div>
                        </td>
                        <td>
                          <div style={{ color: '#fff' }}>{o.sector}</div>
                          <div style={{ color: '#94a3b8', fontSize: '12px' }}>{o.item}</div>
                        </td>
                        <td>PKR {Number(o.price || 0).toLocaleString()}</td>
                        <td>
                          <span className={`hq-badge ${String(o.method).toLowerCase()}`}>{o.method}</span>
                        </td>
                        <td>
                          <div className="hq-status">
                            <span>{o.status_icon || '📦'}</span>
                            <span>{o.status_text}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'Dispatched via TCS', '🚚')} className="hq-btn" style={{ padding: '5px 8px', fontSize: '10px', background: '#334155' }}>Dispatch</button>
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'Completed & Signed', '✅')} className="hq-btn" style={{ padding: '5px 8px', fontSize: '10px', background: '#22c55e' }}>Complete</button>
                            <button onClick={() => handleDeleteOrder(o.id)} className="hq-btn" style={{ padding: '5px 8px', fontSize: '10px', background: '#ef4444' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. CUSTOMERS VIEW */}
        {activeTab === 'customers' && (
          <div>
            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">CREATE CUSTOMER ACCOUNT</h2>
              </div>
              <form onSubmit={handleAddCustomer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Full Name</label>
                  <input type="text" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} placeholder="e.g. Zainab Ahmed" className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Email Address</label>
                  <input type="email" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} placeholder="e.g. name@example.com" className="hq-input" style={{ width: '100%', padding: '10px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Contact Phone</label>
                  <input type="text" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} placeholder="e.g. +92 300 1234567" className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>City/Location</label>
                  <input type="text" value={customerForm.location} onChange={e => setCustomerForm({...customerForm, location: e.target.value})} placeholder="e.g. Lahore" className="hq-input" required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="hq-btn">Add Customer Profile</button>
                </div>
              </form>
            </div>

            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">CUSTOMER DIRECTORY</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="hq-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Purchase Count</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c, idx) => (
                      <tr key={idx}>
                        <td style={{ color: '#fff', fontWeight: 600 }}>{c.name}</td>
                        <td style={{ color: '#94a3b8' }}>{c.email}</td>
                        <td style={{ color: '#94a3b8' }}>{c.phone}</td>
                        <td style={{ color: '#fff' }}>{c.location}</td>
                        <td style={{ color: '#ff4d1c', fontWeight: 'bold' }}>{c.total_orders || 0} orders</td>
                        <td>
                          <button onClick={() => handleDeleteCustomer(c.id)} className="hq-btn" style={{ padding: '5px 10px', fontSize: '11px', background: '#ef4444' }}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. CATEGORY MAPPINGS */}
        {activeTab === 'categories' && (
          <div>
            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">ADD NEW SECTOR CATEGORY</h2>
              </div>
              <form onSubmit={handleAddCategory} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Parent Category / Department</label>
                  <select 
                    value={categoryForm.parent} 
                    onChange={e => setCategoryForm({...categoryForm, parent: e.target.value})} 
                    className="hq-input" 
                    required
                  >
                    <option value="Karyania">Karyania</option>
                    <option value="Women Dresses">Women Dresses</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Subcategory Name</label>
                  <input 
                    type="text" 
                    value={categoryForm.sub} 
                    onChange={e => setCategoryForm({...categoryForm, sub: e.target.value})} 
                    placeholder="e.g. Sugar, Gadgets, Lawn" 
                    className="hq-input" 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Emoji Indicator</label>
                  <input 
                    type="text" 
                    value={categoryForm.emoji} 
                    onChange={e => setCategoryForm({...categoryForm, emoji: e.target.value})} 
                    placeholder="e.g. 📱, 👗, 🌾" 
                    className="hq-input" 
                    required 
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="hq-btn">Save Category Mapping</button>
                </div>
              </form>
            </div>

            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">MAPPED STORE SECTORS</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="hq-table">
                  <thead>
                    <tr>
                      <th>Emoji</th>
                      <th>Category Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, idx) => (
                      <tr key={idx}>
                        <td style={{ fontSize: '24px' }}>{cat.emoji}</td>
                        <td style={{ color: '#fff', fontWeight: 600 }}>{cat.name}</td>
                        <td>
                          <button onClick={() => handleDeleteCategory(cat.id)} className="hq-btn" style={{ padding: '5px 10px', fontSize: '11px', background: '#ef4444' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. DISCOUNT CODES */}
        {activeTab === 'discounts' && (
          <div>
            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">CREATE DISCOUNT CODE</h2>
              </div>
              <form onSubmit={handleAddDiscount} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Coupon Code</label>
                  <input type="text" value={discountForm.code} onChange={e => setDiscountForm({...discountForm, code: e.target.value})} placeholder="e.g. LUXE20" className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Discount Percentage (%)</label>
                  <input type="number" value={discountForm.discountPercent} onChange={e => setDiscountForm({...discountForm, discountPercent: e.target.value})} placeholder="e.g. 20" className="hq-input" required />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" id="disc-active" checked={discountForm.active} onChange={e => setDiscountForm({...discountForm, active: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#ff4d1c' }} />
                  <label htmlFor="disc-active" style={{ fontSize: '13px', color: '#94a3b8', cursor: 'pointer' }}>Set Code as Active Immediately</label>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="hq-btn">Generate Coupon Code</button>
                </div>
              </form>
            </div>

            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">ACTIVE PROMO CODES</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="hq-table">
                  <thead>
                    <tr>
                      <th>Coupon Code</th>
                      <th>Discount Percent</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discounts.map((disc, idx) => (
                      <tr key={idx}>
                        <td style={{ color: '#ff4d1c', fontWeight: 'bold', letterSpacing: '1px' }}>{disc.code}</td>
                        <td style={{ color: '#fff' }}>{disc.discount_percent}% OFF</td>
                        <td>
                          <span className="hq-badge" style={{ background: disc.active ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', color: disc.active ? '#4ade80' : '#64748b' }}>
                            {disc.active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleToggleDiscount(disc.id, disc.active)} className="hq-btn" style={{ padding: '5px 10px', fontSize: '11px', background: '#334155' }}>
                              {disc.active ? 'Disable' : 'Enable'}
                            </button>
                            <button onClick={() => handleDeleteDiscount(disc.id)} className="hq-btn" style={{ padding: '5px 10px', fontSize: '11px', background: '#ef4444' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. SHIPPING COURIERS */}
        {activeTab === 'shipping' && (
          <div>
            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">ADD SHIPPING COURIER</h2>
              </div>
              <form onSubmit={handleAddShipping} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Courier Service Name</label>
                  <input type="text" value={shippingForm.name} onChange={e => setShippingForm({...shippingForm, name: e.target.value})} placeholder="e.g. TCS Express" className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Shipping Rate (PKR)</label>
                  <input type="number" value={shippingForm.rate} onChange={e => setShippingForm({...shippingForm, rate: e.target.value})} placeholder="e.g. 250" className="hq-input" required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Estimated Transit Duration</label>
                  <input type="text" value={shippingForm.duration} onChange={e => setShippingForm({...shippingForm, duration: e.target.value})} placeholder="e.g. 1-2 Days" className="hq-input" required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="hq-btn">Register Courier Service</button>
                </div>
              </form>
            </div>

            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">SHIPPING PARTNERS</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="hq-table">
                  <thead>
                    <tr>
                      <th>Partner Name</th>
                      <th>Rate Bracket</th>
                      <th>Transit Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipping.map((s, idx) => (
                      <tr key={idx}>
                        <td style={{ color: '#fff', fontWeight: 600 }}>{s.name}</td>
                        <td style={{ color: '#4ade80', fontWeight: 'bold' }}>PKR {Number(s.rate).toLocaleString()}</td>
                        <td style={{ color: '#94a3b8' }}>{s.duration}</td>
                        <td>
                          <button onClick={() => handleDeleteShipping(s.id)} className="hq-btn" style={{ padding: '5px 10px', fontSize: '11px', background: '#ef4444' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 8. SYSTEM CONFIGURATION */}
        {activeTab === 'settings' && (
          <div>
            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">HQ CORE SYSTEM CONSTANTS</h2>
              </div>
              <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Storefront Name</label>
                  <input type="text" value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Contact Support Phone</label>
                  <input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="hq-input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Support Notification Email</label>
                  <input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="hq-input" style={{ width: '100%', padding: '10px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Base Currency Symbol</label>
                  <input type="text" value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="hq-input" required />
                </div>
                
                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" id="settings-maintenance" checked={settings.maintenance} onChange={e => setSettings({...settings, maintenance: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#ff4d1c' }} />
                    <label htmlFor="settings-maintenance" style={{ fontSize: '13px', color: '#94a3b8', cursor: 'pointer' }}>Enable Store Maintenance Mode (Locks Storefront)</label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" id="settings-promo" checked={settings.promoEnabled} onChange={e => setSettings({...settings, promoEnabled: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#ff4d1c' }} />
                    <label htmlFor="settings-promo" style={{ fontSize: '13px', color: '#94a3b8', cursor: 'pointer' }}>Enable Header Promo Banners on Main Storefront</label>
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <button type="submit" className="hq-btn">Write to Constants Database</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 9. SUBSCRIBERS VIEW */}
        {activeTab === 'subscribers' && (
          <div>
            <div className="hq-card">
              <div className="hq-card-header" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <h2 className="hq-card-title">NEWSLETTER SUBSCRIBERS ({subscribers.length})</h2>
                  <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Emails of users who subscribed to get exclusive deals</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={copySubscriberEmails} className="hq-btn" style={{ background: '#334155' }}>📋 Copy All for BCC</button>
                  <button onClick={emailSubscribers} className="hq-btn">✉️ Send Email to All</button>
                  <button onClick={fetchSubscribers} className="hq-btn" style={{ background: 'rgba(255,255,255,0.05)' }}>🔄 Refresh</button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="hq-table">
                  <thead>
                    <tr>
                      <th>Subscriber Email</th>
                      <th>Subscribed On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No subscribers found.</td>
                      </tr>
                    ) : (
                      subscribers.map((s, idx) => (
                        <tr key={s.id || idx}>
                          <td style={{ color: '#fff', fontWeight: 600 }}>{s.email}</td>
                          <td style={{ color: '#94a3b8' }}>
                            {new Date(s.created_at).toLocaleDateString()} {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td>
                            <button onClick={() => handleDeleteSubscriber(s.id)} className="hq-btn" style={{ padding: '5px 10px', fontSize: '11px', background: '#ef4444' }}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
