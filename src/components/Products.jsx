import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ProductContext } from '../context/ProductContext';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';

const urduDictionary = {
  'sugar': 'چینی',
  'brown sugar': 'شکر',
  'gurr': 'گڑ',
  'lawn': 'لان',
  'silk': 'سلک',
  'evening gown': 'شام کا لباس',
  'gadgets': 'آلات',
  'accessories': 'سامان',
  'smartwatches': 'اسمارٹ واچز',
  'mobiles': 'موبائلز',
  'dresses': 'کپڑے',
  'electronics': 'الیکٹرانکس',
  'karyania': 'کریانہ',
  'rice': 'چاول',
  'flour': 'آٹا',
  'spices': 'مصالحے',
  'oil': 'تیل',
  'ghee': 'گھی',
  'tea': 'چائے',
  'milk': 'دودھ',
  'watches': 'گھڑیاں',
  'laptops': 'لیپ ٹاپس',
  'bridal': 'عروسی',
  'unstitched': 'ان سلا',
  'stitched': 'سلا ہوا'
};

export default function Products({ selectedCategory, initialSubCategory = 'All' }) {
  useScrollReveal();
  const { products, categories } = useContext(ProductContext);
  const { wishlist, toggleWishlist, addToCart, requireAuth } = useContext(UserContext);
  const { language, t } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);

  const [translatedLabels, setTranslatedLabels] = useState({});

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [addingStates, setAddingStates] = useState({});
  const [selectedWeights, setSelectedWeights] = useState({});
  const [quantities, setQuantities] = useState({});
  const [conditionFilter, setConditionFilter] = useState('All');
  const [subCategoryFilter, setSubCategoryFilter] = useState(initialSubCategory);
  const navigate = useNavigate();

  useEffect(() => {
    setSubCategoryFilter(initialSubCategory);
  }, [initialSubCategory, selectedCategory]);

  const getProductImage = (imgVal) => {
    if (!imgVal) return '';
    if (imgVal.startsWith('[')) {
      try {
        const arr = JSON.parse(imgVal);
        return arr[0] || '';
      } catch (e) {
        return imgVal;
      }
    }
    return imgVal;
  };

  const isWishlisted = (id) => wishlist.some(item => item.productId === id);

  const handleAddToCart = (product) => {
    requireAuth(() => {
      setAddingStates((prev) => ({ ...prev, [product.id]: true }));
      
      const chosenWeight = selectedWeights[product.id] || (product.weightOptions ? product.weightOptions.split(',')[0].trim() : null);
      const qty = quantities[product.id] || 1;
      addToCart(product, chosenWeight, qty);
      
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

  // Get all subcategories for the currently selectedCategory
  const getDynamicSubCategories = () => {
    const subs = new Set();
    
    const getTargetSectors = (catName) => {
      if (catName.startsWith(`${selectedCategory} - `)) {
        return catName.replace(`${selectedCategory} - `, '').trim();
      }
      if (catName.startsWith(`${selectedCategory}-`)) {
        return catName.replace(`${selectedCategory}-`, '').trim();
      }
      if (selectedCategory === 'Dresses') {
        if (catName.startsWith('Women Dresses - ')) {
          return catName.replace('Women Dresses - ', '').trim();
        }
        if (catName.startsWith('Women Dresses-')) {
          return catName.replace('Women Dresses-', '').trim();
        }
      }
      return null;
    };

    // 1. Parse from custom categories added in Admin Panel
    if (categories && categories.length > 0) {
      categories.forEach(cat => {
        const sub = getTargetSectors(cat.name);
        if (sub) subs.add(sub);
      });
    }

    // 2. Parse from products as fallback
    if (products && products.length > 0) {
      products.forEach(prod => {
        const sub = getTargetSectors(prod.category);
        if (sub) subs.add(sub);
      });
    }

    const list = Array.from(subs).map(sub => {
      let labelEn = sub;
      let labelUr = sub;
      if (sub.includes(' | ')) {
        const parts = sub.split(' | ');
        labelEn = parts[0];
        labelUr = parts[1];
      }
      const lowerKey = labelEn.toLowerCase().trim();
      const finalUrdu = translatedLabels[labelEn] || urduDictionary[lowerKey] || labelUr;
      return {
        key: labelEn,
        labelEn,
        labelUr: finalUrdu
      };
    });

    return [{ key: 'All', labelEn: 'All Items', labelUr: 'تمام اشیاء' }, ...list];
  };

  const currentSubCategories = getDynamicSubCategories();

  useEffect(() => {
    const keysToTranslate = currentSubCategories
      .filter(sub => sub.key !== 'All' && sub.labelUr === sub.labelEn && !translatedLabels[sub.key])
      .map(sub => sub.key);

    keysToTranslate.forEach(async (key) => {
      const lowerKey = key.toLowerCase().trim();
      if (urduDictionary[lowerKey]) {
        setTranslatedLabels(prev => ({ ...prev, [key]: urduDictionary[lowerKey] }));
        return;
      }

      // Fetch from Google Translate
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ur&dt=t&q=${encodeURIComponent(key)}`);
        const json = await res.json();
        if (json && json[0] && json[0][0] && json[0][0][0]) {
          const translation = json[0][0][0];
          setTranslatedLabels(prev => ({ ...prev, [key]: translation }));
        }
      } catch (e) {
        console.warn('Translation failed for', key, e);
      }
    });
  }, [products, categories, selectedCategory]);

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
    } else if (['Karyania', 'Dresses', 'Electronics'].includes(selectedCategory)) {
      // Strip Urdu translation suffix if present in category mapping (e.g. "Karyania - Sugar | چینی" or product category "Karyania - Sugar")
      const cleanProdCategory = product.category.split(' | ')[0].trim();
      const isDressesMatch = (selectedCategory === 'Dresses' && (cleanProdCategory === 'Women Dresses' || cleanProdCategory.startsWith('Women Dresses - ') || cleanProdCategory.startsWith('Women Dresses-')));
      const isParent = cleanProdCategory === selectedCategory || cleanProdCategory.startsWith(`${selectedCategory} - `) || cleanProdCategory.startsWith(`${selectedCategory}-`) || isDressesMatch;
      if (isParent) {
        if (subCategoryFilter === 'All') {
          categoryMatch = true;
        } else {
          categoryMatch = cleanProdCategory === `${selectedCategory} - ${subCategoryFilter}` || 
                          cleanProdCategory === `${selectedCategory}-${subCategoryFilter}` ||
                          (selectedCategory === 'Dresses' && (cleanProdCategory === `Women Dresses - ${subCategoryFilter}` || cleanProdCategory === `Women Dresses-${subCategoryFilter}`));
        }
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
    if (selectedCategory === 'Dresses') return t('dresses').toUpperCase();
    if (selectedCategory === 'Electronics') return t('electronics').toUpperCase();
    return selectedCategory ? selectedCategory.toUpperCase() : t('trending_now').toUpperCase();
  };

  const sectionTitle = searchQuery
    ? (language === 'ur' ? `"${searchQuery}" کے لیے تلاش کے نتائج` : `Search Results for "${searchQuery}"`)
    : getCategoryTitle();

  return (
    <section id="products-section" className="section reveal">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-tag">{t('hot_picks')}</div>
          <h2 className="section-title">{sectionTitle}</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Subcategory selectors for parent departments */}
          {['Karyania', 'Dresses', 'Electronics'].includes(selectedCategory) && currentSubCategories.length > 1 && (
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
              {currentSubCategories.map((sub) => (
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
          {!selectedCategory?.startsWith('Karyania') && (
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

      {filteredProducts.length === 0 ? (
        <div style={{ 
          width: '100%', 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', 
          borderRadius: '12px', 
          border: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', 
          margin: '2rem auto',
          maxWidth: '600px'
        }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '1rem' }}>📦</span>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: theme === 'dark' ? '#fff' : '#000', marginBottom: '0.5rem' }}>
            {language === 'ur' ? 'جلد ہی آرہا ہے' : 'Coming Soon'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            {language === 'ur' ? 'اس کیٹیگری میں فی الحال کوئی مصنوعات دستیاب نہیں ہیں۔' : 'No products are currently listed in this category.'}
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="prod-img-wrap" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
              <div className="prod-img">
                {product.image ? (
                  <img src={getProductImage(product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '80px' }}>{product.emoji}</span>
                )}
              </div>
              {/* Stacked Badges */}
              {product.badge && (
                <div className={`prod-badge ${product.badge.toLowerCase()}`} style={{ zIndex: 3 }}>
                  {product.badge}
                </div>
              )}
              {!product.category.startsWith('Karyania') && (
                <div 
                  className={`prod-badge ${product.condition?.toLowerCase() === 'used' ? 'used' : 'new'}`}
                  style={{
                    top: product.badge ? '36px' : '10px',
                    background: product.condition === 'Used' ? '#eab308' : '#22c55e',
                    color: '#000',
                    fontWeight: 800,
                    borderRadius: '4px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    zIndex: 2
                  }}
                >
                  {product.condition === 'Used' ? (language === 'ur' ? 'مستعمل' : 'USED') : (language === 'ur' ? 'نیا' : 'NEW')}
                </div>
              )}
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
              <div className="prod-name" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>{t(product.name)}</div>
              {product.description && (
                <div 
                  title={t(product.description)}
                  style={{ 
                    fontSize: '11px', 
                    color: '#94a3b8', 
                    marginTop: '4px', 
                    fontStyle: 'italic', 
                    lineHeight: '1.4', 
                    display: '-webkit-box', 
                    WebKitLineClamp: '2', 
                    WebKitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    cursor: 'help',
                    textAlign: language === 'ur' ? 'right' : 'left'
                  }}
                >
                  {t(product.description)}
                </div>
              )}
              {product.weightOptions && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '6px 0' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>Weight / Size:</span>
                  <select 
                    value={selectedWeights[product.id] || product.weightOptions.split(',')[0].trim()}
                    onChange={(e) => setSelectedWeights(prev => ({ ...prev, [product.id]: e.target.value }))}
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      color: 'var(--white)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      padding: '2px 6px', 
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {product.weightOptions.split(',').map(opt => (
                      <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {product.inStock && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0', background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', padding: '6px 10px', borderRadius: '6px', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>Quantity:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => setQuantities(prev => ({ ...prev, [product.id]: Math.max(1, (prev[product.id] || 1) - 1) }))}
                      style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', border: 'none', color: theme === 'dark' ? '#fff' : '#000', width: '20px', height: '20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', minWidth: '16px', textAlign: 'center', color: theme === 'dark' ? '#fff' : '#000' }}>
                      {quantities[product.id] || 1}
                    </span>
                    <button 
                      onClick={() => setQuantities(prev => ({ ...prev, [product.id]: Math.min(product.stock || 10, (prev[product.id] || 1) + 1) }))}
                      style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', border: 'none', color: theme === 'dark' ? '#fff' : '#000', width: '20px', height: '20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Low Stock Warning Alert */}
              {product.inStock && product.stock !== undefined && product.stock > 0 && product.stock <= 3 && (
                <div style={{ fontSize: '11px', color: '#ff4d1c', fontWeight: 600, margin: '4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⚠️ Only {product.stock} left in stock!
                </div>
              )}

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
      )}

    </section>
  );
}
