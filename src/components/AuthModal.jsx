import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, signUp, signIn, loading } = useContext(UserContext);
  const { language, t } = useContext(LanguageContext);

  // Modal mode: 'register' (Sign Up) or 'login' (Sign In)
  const [mode, setMode] = useState('register');
  const [errorMsg, setErrorMsg] = useState('');

  // Form States (Register)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');

  // Form States (Login)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'register') {
      if (!name || !phone || !email || !location || !password) return;
      const res = await signUp({ name, phone, email, location, password });
      if (res && !res.success) {
        setErrorMsg(res.error || 'Registration failed');
      } else {
        resetFields();
      }
    } else {
      if (!loginEmail || !loginPassword) return;
      const res = await signIn(loginEmail, loginPassword);
      if (res && !res.success) {
        setErrorMsg(res.error || 'Invalid credentials');
      } else {
        resetFields();
      }
    }
  };

  const resetFields = () => {
    setName('');
    setPhone('');
    setEmail('');
    setLocation('');
    setPassword('');
    setLoginEmail('');
    setLoginPassword('');
    setErrorMsg('');
  };

  const handleClose = () => {
    resetFields();
    setAuthModalOpen(false);
  };

  return (
    <div className={`modal-overlay ${authModalOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '28px', letterSpacing: '1px', margin: 0 }}>
              {mode === 'register' ? 'Create Store Profile' : 'Sign In Account'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 0' }}>
              {mode === 'register' ? 'Sync your cart, wishlist, and orders instantly!' : 'Welcome back! Enter your details to log in.'}
            </p>
          </div>
          <button onClick={handleClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', gap: '1rem' }}>
          <button 
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              borderBottom: mode === 'register' ? '2px solid var(--accent)' : '2px solid transparent',
              color: mode === 'register' ? 'var(--white)' : '#64748b',
              paddingBottom: '8px', 
              fontWeight: 600, 
              fontSize: '13px', 
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            Create Profile
          </button>
          <button 
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              borderBottom: mode === 'login' ? '2px solid var(--accent)' : '2px solid transparent',
              color: mode === 'login' ? 'var(--white)' : '#64748b',
              paddingBottom: '8px', 
              fontWeight: 600, 
              fontSize: '13px', 
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            Sign In
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '1rem', fontWeight: 500 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' ? (
            /* Register Mode Fields */
            <>
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
                  className="hq-input"
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
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Enter a secure password" 
                  className="hq-input" 
                  required 
                />
              </div>
            </>
          ) : (
            /* Login Mode Fields */
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email or Phone Number</label>
                <input 
                  type="text" 
                  value={loginEmail} 
                  onChange={e => setLoginEmail(e.target.value)} 
                  placeholder="Enter your email or phone number" 
                  className="hq-input"
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                <input 
                  type="password" 
                  value={loginPassword} 
                  onChange={e => setLoginPassword(e.target.value)} 
                  placeholder="Enter your password" 
                  className="hq-input" 
                  required 
                />
              </div>
            </>
          )}
          
          <button type="submit" className="hq-btn" disabled={loading} style={{ padding: '12px', marginTop: '8px', fontWeight: 'bold' }}>
            {loading ? 'AUTHENTICATING...' : (mode === 'register' ? 'CREATE PROFILE & SYNC' : 'SIGN IN & SYNC')}
          </button>
        </form>

      </div>
    </div>
  );
}
