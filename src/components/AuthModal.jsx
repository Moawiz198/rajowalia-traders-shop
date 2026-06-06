import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, registerOrLogin, loading } = useContext(UserContext);

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !location) return;
    
    await registerOrLogin({ name, phone, email, location });
    // Fields reset
    setName('');
    setPhone('');
    setEmail('');
    setLocation('');
  };

  const handleClose = () => {
    setAuthModalOpen(false);
  };

  return (
    <div className={`modal-overlay ${authModalOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ color: '#fff', maxWidth: '420px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '28px', letterSpacing: '1px', margin: 0 }}>Create Store Profile</h2>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 0' }}>Sync your cart, wishlist, and orders instantly!</p>
          </div>
          <button onClick={handleClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Zainab Ahmed" 
              className="hq-input" 
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="e.g. 03001234567" 
              className="hq-input" 
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="e.g. name@example.com" 
              style={{ width: '100%', padding: '10px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shipping City</label>
            <input 
              type="text" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="e.g. Lahore" 
              className="hq-input" 
              required 
            />
          </div>
          
          <button type="submit" className="hq-btn" disabled={loading} style={{ padding: '12px', marginTop: '8px', fontWeight: 'bold' }}>
            {loading ? 'SYNCING DATABASE...' : 'SAVE & SECURE SESSION'}
          </button>
        </form>

      </div>
    </div>
  );
}
