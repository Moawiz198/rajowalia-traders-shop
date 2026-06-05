import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function PromoBanner() {
  useScrollReveal();

  return (
    <div id="deals" className="promo-banner reveal">
      <div className="promo-left">
        <div className="promo-tag">Limited Time Offer</div>
        <div className="promo-title">UP TO 70% OFF<br />ELECTRONICS</div>
        <div className="promo-sub">Biggest sale of the year — today only!</div>
        <button className="promo-btn">Grab the Deal</button>
      </div>
      <div className="promo-right">
        <div className="promo-emoji">🎧</div>
      </div>
    </div>
  );
}
