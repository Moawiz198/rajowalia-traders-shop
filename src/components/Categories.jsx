import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { LanguageContext } from '../context/LanguageContext';

export default function Categories() {
  useScrollReveal();
  const navigate = useNavigate();
  const { language, t } = useContext(LanguageContext);

  return (
    <section id="categories" className="section reveal">
      <div className="section-header">
        <div>
          <div className="section-tag">{t('browse_by')}</div>
          <h2 className="section-title">{t('categories_title')}</h2>
        </div>
        <span className="see-all" onClick={() => navigate('/category/All')} style={{cursor: 'pointer'}}>{t('see_all')}</span>
      </div>
      <div className="categories-grid">
        <div className="cat-card" onClick={() => navigate('/category/Electronics')}><span className="cat-icon">📱</span><div className="cat-name">{t('electronics')}</div></div>
        <div className="cat-card" onClick={() => navigate('/category/Dresses')}><span className="cat-icon">👗</span><div className="cat-name">{t('dresses')}</div></div>
        <div className="cat-card" onClick={() => navigate('/category/Karyania')}><span className="cat-icon">🛒</span><div className="cat-name">{t('karyania')}</div></div>
      </div>
    </section>
  );
}
