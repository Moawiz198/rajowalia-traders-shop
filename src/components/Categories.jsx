import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Categories() {
  useScrollReveal();
  const navigate = useNavigate();

  return (
    <section id="categories" className="section reveal">
      <div className="section-header">
        <div>
          <div className="section-tag">Browse By</div>
          <h2 className="section-title">CATEGORIES</h2>
        </div>
        <span className="see-all" onClick={() => navigate('/category/All')} style={{cursor: 'pointer'}}>See All →</span>
      </div>
      <div className="categories-grid">
        <div className="cat-card" onClick={() => navigate('/category/Electronics')}><span className="cat-icon">📱</span><div className="cat-name">Electronics</div><div className="cat-count">12,400 items</div></div>
        <div className="cat-card" onClick={() => navigate('/category/Gadgets')}><span className="cat-icon">⌚</span><div className="cat-name">Gadgets</div><div className="cat-count">8,200 items</div></div>
        <div className="cat-card" onClick={() => navigate('/category/Suits')}><span className="cat-icon">👔</span><div className="cat-name">Suits</div><div className="cat-count">18,000 items</div></div>
        <div className="cat-card" onClick={() => navigate('/category/Suits')}><span className="cat-icon">👔</span><div className="cat-name">Men's Wear</div><div className="cat-count">9,600 items</div></div>
        <div className="cat-card" onClick={() => navigate('/category/Karyania')}><span className="cat-icon">🛒</span><div className="cat-name">Karyania</div><div className="cat-count">5,400 items</div></div>
      </div>
    </section>
  );
}
