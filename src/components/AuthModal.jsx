import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, signUp, signIn, loading } = useContext(UserContext);
  const { language, t } = useContext(LanguageContext);

  // Modal mode: 'register' (Sign Up), 'login' (Sign In), or 'forgot' (Forgot Password)
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

  // Form States (Forgot Password)
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1 = Verify email + phone, 2 = Set new password
  const [targetUser, setTargetUser] = useState(null);

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
    } else if (mode === 'login') {
      if (!loginEmail || !loginPassword) return;
      const res = await signIn(loginEmail, loginPassword);
      if (res && !res.success) {
        setErrorMsg(res.error || 'Invalid credentials');
      } else {
        resetFields();
      }
    } else if (mode === 'forgot') {
      if (forgotStep === 1) {
        if (!forgotEmail || !forgotPhone) return;
        try {
          const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('email', forgotEmail)
            .eq('phone', forgotPhone)
            .limit(1);
          
          if (error) throw error;
          if (!data || data.length === 0) {
            setErrorMsg('No account matches this email and phone number.');
            return;
          }
          setTargetUser(data[0]);
          setForgotStep(2);
        } catch (err) {
          setErrorMsg(err.message);
        }
      } else {
        if (!newPassword) return;
        try {
          const { error } = await supabase
            .from('customers')
            .update({ password: newPassword })
            .eq('id', targetUser.id);
          
          if (error) throw error;
          alert('Password reset successfully! Please sign in with your new password.');
          setMode('login');
          setForgotStep(1);
          setForgotEmail('');
          setForgotPhone('');
          setNewPassword('');
        } catch (err) {
          setErrorMsg(err.message);
        }
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
    setForgotEmail('');
    setForgotPhone('');
    setNewPassword('');
    setForgotStep(1);
    setTargetUser(null);
    setErrorMsg('');
  };

  const handleClose = () => {
    resetFields();
    setAuthModalOpen(false);
  };

  return (
    <div className={`modal-overlay ${authModalOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
         {/* Header */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '28px', letterSpacing: '1px', margin: 0 }}>
              {mode === 'register' ? 'Create Store Profile' : mode === 'login' ? 'Sign In Account' : 'Reset Password'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 0' }}>
              {mode === 'register' 
                ? 'Sync your cart, wishlist, and orders instantly!' 
                : mode === 'login' 
                  ? 'Welcome back! Enter your details to log in.' 
                  : 'Verify your registered details to reset your password.'}
            </p>
          </div>
          <button onClick={handleClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        {/* Tab Switcher */}
        {mode !== 'forgot' && (
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
        )}

        {/* Error Alert Box */}
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '1rem', fontWeight: 500 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
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
          )}

          {mode === 'login' && (
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

          {mode === 'forgot' && (
            /* Forgot Password Fields */
            <>
              {forgotStep === 1 ? (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Registered Email Address</label>
                    <input 
                      type="email" 
                      value={forgotEmail} 
                      onChange={e => setForgotEmail(e.target.value)} 
                      placeholder="name@example.com" 
                      className="hq-input" 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Registered Phone Number</label>
                    <input 
                      type="tel" 
                      value={forgotPhone} 
                      onChange={e => setForgotPhone(e.target.value)} 
                      placeholder="e.g. 03001234567" 
                      className="hq-input" 
                      required 
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Enter New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="Enter new password" 
                    className="hq-input" 
                    required 
                  />
                </div>
              )}
            </>
          )}
          
          <button type="submit" className="hq-btn" disabled={loading} style={{ padding: '12px', marginTop: '8px', fontWeight: 'bold' }}>
            {loading 
              ? 'AUTHENTICATING...' 
              : mode === 'register' 
                ? 'CREATE PROFILE & SYNC' 
                : mode === 'login' 
                  ? 'SIGN IN & SYNC' 
                  : forgotStep === 1 
                    ? 'VERIFY DETAILS' 
                    : 'RESET PASSWORD'}
          </button>
        </form>

        {/* Back Link or Switcher */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          {mode === 'login' ? (
            <button 
              type="button" 
              onClick={() => { setMode('forgot'); setErrorMsg(''); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              Forgot Password?
            </button>
          ) : mode === 'forgot' ? (
            <button 
              type="button" 
              onClick={() => { setMode('login'); setForgotStep(1); setErrorMsg(''); }}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              ← Back to Sign In
            </button>
          ) : null}
        </div>

      </div>
    </div>
  );
}
