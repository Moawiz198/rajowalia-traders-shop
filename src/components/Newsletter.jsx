import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { supabase } from '../lib/supabase';

export default function Newsletter() {
  useScrollReveal();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (error && error.code !== '23505') { // 23505 is PostgreSQL duplicate key error
        throw error;
      }
    } catch (err) {
      console.warn('Supabase subscribe failed, using fallback:', err.message);
      const saved = localStorage.getItem('luxeSubscribers');
      const list = saved ? JSON.parse(saved) : [];
      if (!list.some(item => item.email === email)) {
        list.push({
          id: Date.now(),
          email,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('luxeSubscribers', JSON.stringify(list));
      }
    } finally {
      setLoading(false);
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="newsletter reveal">
      <h3 className="nl-title">GET EXCLUSIVE DEALS 🔥</h3>
      <p className="nl-sub">
        {subscribed 
          ? 'Thank you for subscribing! Check your inbox for updates.' 
          : 'Subscribe and be first to know about flash sales, new arrivals & more.'}
      </p>
      {!subscribed && (
        <form onSubmit={handleSubmit} className="nl-form">
          <input 
            className="nl-input" 
            type="email" 
            placeholder="your@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className="nl-submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
}
