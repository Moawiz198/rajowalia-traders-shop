import React, { useState, useContext } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { supabase } from '../lib/supabase';
import { LanguageContext } from '../context/LanguageContext';

export default function Newsletter() {
  useScrollReveal();
  const { language, t } = useContext(LanguageContext);
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
      <h3 className="nl-title">{t('get_deals')}</h3>
      <p className="nl-sub">
        {subscribed 
          ? t('subscribe_thank_you') 
          : t('subscribe_sub')}
      </p>
      {!subscribed && (
        <form onSubmit={handleSubmit} className="nl-form">
          <input 
            className="nl-input" 
            type="email" 
            placeholder={t('email_placeholder')} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className="nl-submit" disabled={loading}>
            {loading ? t('subscribing_btn') : t('subscribe_btn')}
          </button>
        </form>
      )}
    </div>
  );
}
