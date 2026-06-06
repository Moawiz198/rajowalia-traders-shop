import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Newsletter() {
  useScrollReveal();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
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
          />
          <button type="submit" className="nl-submit">Subscribe</button>
        </form>
      )}
    </div>
  );
}
