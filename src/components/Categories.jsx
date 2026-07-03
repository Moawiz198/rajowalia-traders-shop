import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { LanguageContext } from '../context/LanguageContext';
import { UserContext } from '../context/UserContext';

export default function Categories() {
  useScrollReveal();
  const navigate = useNavigate();
  const { language, t } = useContext(LanguageContext);
  const { categories } = useContext(UserContext);

  const getPrimaryCategories = () => {
    const primaries = new Map();
    primaries.set('Electronics', '📱');
    primaries.set('Dresses', '👗');
    primaries.set('Karyania', '🛒');
    primaries.set('Painting', '🎨');
    
    categories?.forEach(c => {
      const parts = c.name.split('-');
      const p = parts[0].trim();
      if (!primaries.has(p)) {
        primaries.set(p, c.emoji || '✨');
      } else if (c.emoji && primaries.get(p) === '✨') {
        primaries.set(p, c.emoji);
      }
    });
    return Array.from(primaries.entries());
  };

  return (
    <section id="categories" className="section reveal">
      <div className="section-header">
        <div>
          <div className="section-tag">{t('browse_by')}</div>
          <h2 className="section-title">{t('categories_title')}</h2>
        </div>
        <span className="see-all" onClick={() => navigate('/category/All')} style={{cursor: 'pointer'}}>{t('see_all')}</span>
      </div>
      <div className="categories-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {getPrimaryCategories().map(([catName, emoji]) => (
          <div key={catName} className="cat-card" onClick={() => navigate(`/category/${catName}`)} style={{ flex: '1 1 150px', minWidth: '150px' }}>
            <span className="cat-icon">{emoji}</span>
            <div className="cat-name" style={{ textTransform: 'uppercase' }}>
              {t(catName.toLowerCase()) !== catName.toLowerCase() ? t(catName.toLowerCase()) : catName.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
