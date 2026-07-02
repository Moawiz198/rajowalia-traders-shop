import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';

export default function Hero() {
  const { products } = useContext(ProductContext);
  const { addToCart, requireAuth } = useContext(UserContext);
  const { language, t } = useContext(LanguageContext);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Filter for in-stock products that have highlight badges (e.g. HOT, NEW, SALE, BEST, FEATURED)
  // This allows showing only selected items in the hero mockup by setting their badges in the Admin panel.
  let featuredProducts = products.filter(p => p.inStock && (p.badge === 'HOT' || p.badge === 'NEW' || p.badge === 'SALE' || p.badge === 'BEST' || p.badge === 'FEATURED'));
  if (featuredProducts.length === 0) {
    featuredProducts = products.filter(p => p.inStock);
  }

  useEffect(() => {
    if (featuredProducts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const currentProduct = featuredProducts[currentProductIndex] || products[0] || {};

  const scrollToCategories = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = () => {
    if (currentProduct.id) {
      requireAuth(() => {
        addToCart(currentProduct);
        
        // Scale animation on the cart dot
        const dot = document.getElementById('cart-dot');
        if (dot) {
          dot.style.transform = 'scale(1.5)';
          setTimeout(() => {
            dot.style.transform = '';
          }, 300);
        }
      });
    }
  };

  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>
      <div className="hero-content">
        <div className="hero-tag"><span className="tag-dot"></span> {t('new_season')}</div>
        <h1 className="hero-title" style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{t('shop_the_future')}</span>
          <span className="accent">{t('future')}</span>
          <span className="outline">{t('today')}</span>
        </h1>
        <p className="hero-sub">{t('hero_sub')}</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={scrollToCategories}>{t('explore_store')}</button>
          <button className="btn-secondary" onClick={scrollToProducts}>{t('view_deals')}</button>
        </div>
        <div className="hero-stats" style={{ justifyContent: language === 'ur' ? 'flex-end' : 'flex-start' }}>
          <div className="stat-item">
            <div className="stat-num">{(20 + products.length).toLocaleString()}+</div>
            <div className="stat-label">{t('products')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">5K+</div>
            <div className="stat-label">{t('customers')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">4.8★</div>
            <div className="stat-label">{t('rating')}</div>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-phone">
          <div className="phone-screen">
            <div className="phone-product" id="heroEmoji">{currentProduct.emoji || '📦'}</div>
            <div className="phone-info" style={{ textAlign: language === 'ur' ? 'right' : 'left' }}>
              <div className="phone-brand">{t(currentProduct.brand) || 'Rajowalia'}</div>
              <div className="phone-name">{t(currentProduct.name) || 'Amazing Product'}</div>
              <div className="phone-price">{currentProduct.price ? `PKR ${currentProduct.price.toLocaleString()}` : ''}</div>
              <button className="phone-btn" onClick={handleAddToCart}>{t('add_to_cart')}</button>
            </div>
          </div>
        </div>
        <div className="floating-card fc-1" style={{ right: '-10px', left: 'auto' }}>
          <div className="fc-icon">🔥</div>
          <div style={{ textAlign: language === 'ur' ? 'right' : 'left' }}>
            <div className="fc-label">{t('trending')}</div>
            <div className="fc-val">{t('sold_today')}</div>
          </div>
        </div>
        <div className="floating-card fc-2" style={{ left: '-20px', right: 'auto' }}>
          <div className="fc-icon">✅</div>
          <div style={{ textAlign: language === 'ur' ? 'right' : 'left' }}>
            <div className="fc-label">{t('free_delivery')}</div>
            <div className="fc-val">{t('min_order')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
