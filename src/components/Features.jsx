import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Features() {
  useScrollReveal();

  return (
    <div className="features-grid reveal">
      <div className="feat">
        <div className="feat-ico fi1">🚚</div>
        <div>
          <div className="feat-t">Free Delivery</div>
          <div className="feat-d">On orders above PKR 2,000 across Pakistan</div>
        </div>
      </div>
      <div className="feat">
        <div className="feat-ico fi2">🔒</div>
        <div>
          <div className="feat-t">Secure Payment</div>
          <div className="feat-d">100% safe & encrypted checkout always</div>
        </div>
      </div>
      <div className="feat">
        <div className="feat-ico fi3">↩️</div>
        <div>
          <div className="feat-t">Easy Returns</div>
          <div className="feat-d">7-day hassle-free return policy guaranteed</div>
        </div>
      </div>
      <div className="feat">
        <div className="feat-ico fi4">💬</div>
        <div>
          <div className="feat-t">24/7 Support</div>
          <div className="feat-d">Live chat & call support round the clock</div>
        </div>
      </div>
    </div>
  );
}
