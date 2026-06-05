import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Newsletter() {
  useScrollReveal();

  return (
    <div className="newsletter reveal">
      <h3 className="nl-title">GET EXCLUSIVE DEALS 🔥</h3>
      <p className="nl-sub">Subscribe and be first to know about flash sales, new arrivals & more.</p>
      <div className="nl-form">
        <input className="nl-input" type="email" placeholder="your@email.com" />
        <button className="nl-submit">Subscribe</button>
      </div>
    </div>
  );
}
