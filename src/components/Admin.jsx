import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';

export default function Admin() {
  const { products, addProduct, removeProduct, updateProduct } = useContext(ProductContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    emoji: '', image: '', brand: '', name: '', price: '', oldPrice: '', 
    badge: '', stars: '5', inStock: true, discountPercentage: '0', 
    category: 'Electronics'
  });

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
    if (!formData.name || !formData.price || !formData.emoji) return;

    const productData = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      stars: Number(formData.stars),
      discountPercentage: Number(formData.discountPercentage)
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
      badge: '', stars: '5', inStock: true, discountPercentage: '0', 
      category: 'Electronics'
    });
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      emoji: p.emoji || '', image: p.image || '', brand: p.brand, name: p.name, price: p.price.toString(),
      oldPrice: p.oldPrice ? p.oldPrice.toString() : '',
      badge: p.badge || '', stars: p.stars.toString(), inStock: p.inStock,
      discountPercentage: p.discountPercentage.toString(), category: p.category
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      emoji: '', image: '', brand: '', name: '', price: '', oldPrice: '', 
      badge: '', stars: '5', inStock: true, discountPercentage: '0', 
      category: 'Electronics'
    });
  };

  const hqOrders = [
    { id: '#LX-9402', customer: 'Zainab Ahmed', loc: 'Lahore', sector: 'Electronics', item: 'iPhone 16', price: '399,999', method: 'PREPAID', statusIcon: '🚚', statusText: 'In Transit via TCS' },
    { id: '#LX-9401', customer: 'Muhammad Ali', loc: 'Karachi', sector: 'Karyana', item: 'Restock Bundle', price: '8,450', method: 'COD', statusIcon: '📦', statusText: 'Packing Phase' },
    { id: '#LX-9400', customer: 'Hamza Khan', loc: 'Islamabad', sector: 'Gadgets', item: 'Sony XM5', price: '52,000', method: 'COD', statusIcon: '⚠️', statusText: 'Pending Call Verification' },
    { id: '#LX-9399', customer: 'Ayesha Umar', loc: 'Multan', sector: 'Suits', item: 'Air Jordan', price: '18,500', method: 'PREPAID', statusIcon: '✅', statusText: 'Dispatched' },
  ];

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
          <div className="hq-nav-link" onClick={() => navigate('/')}>
            ← Back to Storefront
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="hq-main">
        {activeTab === 'dashboard' && (
          <div className="hq-card">
            <div className="hq-card-header">
              <h2 className="hq-card-title">LIVE ORDER STREAMS</h2>
              <button className="hq-btn">Process Batches</button>
            </div>
            
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
                {hqOrders.map((o, i) => (
                  <tr key={i}>
                    <td style={{ color: '#ff4d1c', fontWeight: 'bold' }}>{o.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{o.customer}</div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>({o.loc})</div>
                    </td>
                    <td>
                      <div style={{ color: '#fff' }}>{o.sector}</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>({o.item})</div>
                    </td>
                    <td>PKR {o.price}</td>
                    <td>
                      <span className={`hq-badge ${o.method.toLowerCase()}`}>{o.method}</span>
                    </td>
                    <td>
                      <div className="hq-status">
                        <span>{o.statusIcon}</span>
                        <span>{o.statusText}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div>
            <div className="hq-card">
              <div className="hq-card-header">
                <h2 className="hq-card-title">{editingId ? 'EDIT INVENTORY ITEM' : 'ADD NEW INVENTORY ITEM'}</h2>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>Sector Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="hq-input">
                    <option value="Electronics">Electronics</option>
                    <option value="Gadgets">Gadgets</option>
                    <option value="Suits">Suits</option>
                    <option value="Karyania">Karyania</option>
                  </select>
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
                      <input type="text" name="emoji" value={formData.emoji} onChange={handleChange} placeholder="Or enter an emoji (e.g. 📱)" className="hq-input" />
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
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{p.brand} • {p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#fff' }}>PKR {p.price.toLocaleString()}</td>
                      <td>
                        <span className="hq-badge" style={{ background: p.inStock ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: p.inStock ? '#4ade80' : '#ef4444' }}>
                          {p.inStock ? 'In Stock' : 'Sold Out'}
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

        {['orders', 'customers', 'categories', 'discounts', 'shipping', 'settings'].includes(activeTab) && (
          <div className="hq-card" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <h2 className="hq-card-title" style={{ color: '#64748b', marginBottom: '1rem' }}>MODULE UNDER CONSTRUCTION 🚧</h2>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>This section is currently locked. It will become fully functional once the Supabase Database is successfully connected!</p>
          </div>
        )}

      </div>
    </div>
  );
}
