import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ProductContext } from '../context/ProductContext';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';

export default function Products({ selectedCategory, initialSubCategory = 'All' }) {
  useScrollReveal();
  const { products } = useContext(ProductContext);
  const { wishlist, toggleWishlist, addToCart, requireAuth } = useContext(UserContext);
  const { language, t } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [addingStates, setAddingStates] = useState({});
  const [conditionFilter, setConditionFilter] = useState('All');
  const [subCategoryFilter, setSubCategoryFilter] = useState(initialSubCategory);

  useEffect(() => {
    setSubCategoryFilter(initialSubCategory);
  }, [initialSubCategory, selectedCategory]);

  const isWishlisted = (id) => wishlist.some(item => item.productId === id);

  const handleAddToCart = (product) => {
    requireAuth(() => {
      setAddingStates((prev) => ({ ...prev, [product.id]: true }));
      addToCart(product);
      
      const dot = document.getElementById('cart-dot');
      if (dot) {
        dot.style.transform = 'scale(1.5)';
        setTimeout(() => {
          dot.style.transform = '';
        }, 300);
      }

      setTimeout(() => {
        setAddingStates((prev) => ({ ...prev, [product.id]: false }));
      }, 1500);
    });
  };

  const filteredProducts = products.filter(product => {
    // 1. Search Query Filter (name or brand)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(query) || product.brand.toLowerCase().includes(query);
      if (!nameMatch) return false;
    }

    // 2. Category & Subcategory Filter
    let categoryMatch = false;
    if (!selectedCategory || selectedCategory === 'All') {
      categoryMatch = true;
    } else if (selectedCategory === 'Deals') {
      categoryMatch = product.discountPercentage > 0 || (product.badge && product.badge.toUpperCase().includes('SALE'));
    } else if (selectedCategory === 'Karyania') {
      categoryMatch = product.category.startsWith('Karyania');
      if (categoryMatch && subCategoryFilter !== 'All') {
        categoryMatch = product.category === `Karyania - ${subCategoryFilter}`;
      }
    } else {
      categoryMatch = product.category === selectedCategory;
    }

    // 3. Condition Filter (Do not apply to Karyania)
    let conditionMatch = true;
    if (conditionFilter !== 'All' && !product.category.startsWith('Karyania')) {
      conditionMatch = product.condition === conditionFilter;
    }

    return categoryMatch && conditionMatch;
  });

  const getCategoryTitle = () => {
    if (selectedCategory === 'Deals') return t('deals').toUpperCase();
    if (selectedCategory === 'Karyania') return t('karyania').toUpperCase();
    if (selectedCategory === 'Women Dresses') return t('dresses').toUpperCase();
    if (selectedCategory === 'Electronics') return t('electronics').toUpperCase();
    return selectedCategory ? selectedCategory.toUpperCase() : t('trending_now').toUpperCase();
  };

  const sectionTitle = searchQuery
    ? (language === 'ur' ? `"${searchQuery}" کے لیے تلاش کے نتائج` : `Search Results for "${searchQuery}"`)
    : getCategoryTitle();

  const karyaniaSubs = [
    { key: 'All', labelEn: 'All Items', labelUr: 'تمام اشیاء' },
    { key: 'Sugar', labelEn: 'Sugar', labelUr: 'چینی' },
    { key: 'Brown Sugar', labelEn: 'Brown Sugar', labelUr: 'شکر' },
    { key: 'Gurr', labelEn: 'Gurr', labelUr: 'گڑ' }
  ];

  return (
    <section id="products-section" className="section reveal">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-tag">{t('hot_picks')}</div>
          <h2 className="section-title">{sectionTitle}</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Subcategory selectors for Karyania */}
          {selectedCategory === 'Karyania' && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', 
              padding: '4px', 
              borderRadius: '20px', 
              border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)', 
              flexWrap: 'wrap' 
            }}>
              {karyaniaSubs.map((sub) => (
                <button
                  key={sub.key}
                  onClick={() => setSubCategoryFilter(sub.key)}
                  style={{
                    background: subCategoryFilter === sub.key ? 'var(--accent)' : 'transparent',
                    color: subCategoryFilter === sub.key ? '#fff' : (theme === 'dark' ? '#fff' : '#000'),
                    border: 'none',
                    borderRadius: '16px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {language === 'ur' ? sub.labelUr : sub.labelEn}
                </button>
              ))}
            </div>
          )}

          {/* Condition Filter (Hidden for Karyania category) */}
          {selectedCategory !== 'Karyania' && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', 
              padding: '4px', 
              borderRadius: '20px', 
              border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' 
            }}>
              {['All', 'New', 'Used'].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setConditionFilter(cond)}
                  style={{
                    background: conditionFilter === cond ? 'var(--accent)' : 'transparent',
                    color: conditionFilter === cond ? '#fff' : (theme === 'dark' ? '#fff' : '#000'),
                    border: 'none',
                    borderRadius: '16px',
                    padding: '6px 16px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {cond}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="prod-img-wrap">
              <div className="prod-img">
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '80px' }}>{product.emoji}</span>
                )}
              </div>
              {product.badge && <div className={`prod-badge ${product.badge.toLowerCase()}`}>{product.badge}</div>}
              {product.discountPercentage > 0 && (
                <div className="prod-discount-badge">-{product.discountPercentage}%</div>
              )}
              <div className="prod-actions">
                <button 
                  className="prod-action-btn"
                  onClick={() => requireAuth(() => toggleWishlist(product))}
                  style={{ 
                    flex: '0 0 40px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isWishlisted(product.id) ? '#ff4d1c' : 'var(--black)',
                    padding: 0
                  }}
                >
                  {isWishlisted(product.id) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ff4d1c" stroke="#ff4d1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                  )}
                </button>
                <button 
                  className="prod-action-btn cart" 
                  style={{
                    ...(addingStates[product.id] ? { background: '#22c55e' } : {}),
                    ...(!product.inStock ? { background: '#555', cursor: 'not-allowed', color: '#aaa' } : {})
                  }}
                  onClick={() => product.inStock && handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  {!product.inStock 
                    ? t('sold_out') 
                    : addingStates[product.id] ? `✓ ${t('added')}` : t('add_to_cart')}
                </button>
              </div>
            </div>
            <div className="prod-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span className="prod-brand">{t(product.brand)}</span>
                {!product.category.startsWith('Karyania') && (
                  <span style={{ 
                    fontSize: '9px', 
                    fontWeight: 700, 
                    color: product.condition === 'Used' ? '#facc15' : '#4ade80', 
                    border: `1px solid ${product.condition === 'Used' ? 'rgba(234,179,8,0.3)' : 'rgba(34,197,94,0.3)'}`,
                    background: product.condition === 'Used' ? 'rgba(234,179,8,0.05)' : 'rgba(34,197,94,0.05)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {product.condition === 'Used' ? (language === 'ur' ? 'مستعمل' : 'Used') : (language === 'ur' ? 'نیا' : 'New')}
                  </span>
                )}
              </div>
              <div className="prod-name">{t(product.name)}</div>
              <div className="prod-bottom">
                <div>
                  <span className="prod-price">PKR {product.price.toLocaleString()}</span>
                  {product.oldPrice && <span className="prod-old">{product.oldPrice.toLocaleString()}</span>}
                </div>
                <div className="prod-stars">
                  {'★'.repeat(product.stars)}{'☆'.repeat(5 - product.stars)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
