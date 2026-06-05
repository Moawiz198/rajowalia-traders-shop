import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f4f6f8', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Admin Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password" 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none' }}
            required
          />
          {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
          <button type="submit" style={{ padding: '10px', background: '#0d3b36', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}>Login</button>
        </form>
        <button onClick={() => navigate('/')} style={{ marginTop: '2rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>Back to Storefront</button>
      </div>
    </div>
  );
}
