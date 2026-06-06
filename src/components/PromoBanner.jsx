import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function PromoBanner() {
  useScrollReveal();
  const navigate = useNavigate();

  return (
    <div id="deals" className="promo-banner reveal">
      <div className="promo-left">
        <div className="promo-tag">Limited Time Offer</div>
        <div className="promo-title">UP TO 70% OFF<br />ELECTRONICS</div>
        <div className="promo-sub">Biggest sale of the year — today only!</div>
        <button className="promo-btn" onClick={() => navigate('/category/Deals')}>Grab the Deal</button>
      </div>
      <div className="promo-right">
        <div className="promo-ring1"></div>
        <div className="promo-ring2"></div>
        <div className="promo-ring3"></div>
        <div className="promo-emo">🎧</div>
      </div>
    </div>
  );
}
