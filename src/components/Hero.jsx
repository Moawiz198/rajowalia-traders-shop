import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { UserContext } from '../context/UserContext';

export default function Hero() {
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(UserContext);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Filter for products that are in stock so we only feature available items on the hero
  const featuredProducts = products.filter(p => p.inStock);

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
      addToCart(currentProduct);
      
      // Scale animation on the cart dot
      const dot = document.getElementById('cart-dot');
      if (dot) {
        dot.style.transform = 'scale(1.5)';
        setTimeout(() => {
          dot.style.transform = '';
        }, 300);
      }
    }
  };

  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>
      <div className="hero-content">
        <div className="hero-tag"><span className="tag-dot"></span> New Season 2025 Collection</div>
        <h1 className="hero-title">
          <span>SHOP THE</span>
          <span className="accent">FUTURE</span>
          <span className="outline">TODAY</span>
        </h1>
        <p className="hero-sub">Electronics, fashion, gadgets & lifestyle — all in one electrifying store. Fast delivery across Pakistan.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={scrollToCategories}>Explore Store →</button>
          <button className="btn-secondary" onClick={scrollToProducts}>View Deals</button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-num">50K+</div>
            <div className="stat-label">Products</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">200K</div>
            <div className="stat-label">Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">4.9★</div>
            <div className="stat-label">Rating</div>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-phone">
          <div className="phone-screen">
            <div className="phone-product" id="heroEmoji">{currentProduct.emoji || '📦'}</div>
            <div className="phone-info">
              <div className="phone-brand">{currentProduct.brand || 'Rajowalia'}</div>
              <div className="phone-name">{currentProduct.name || 'Amazing Product'}</div>
              <div className="phone-price">{currentProduct.price ? `PKR ${currentProduct.price.toLocaleString()}` : ''}</div>
              <button className="phone-btn" onClick={handleAddToCart}>Add to Cart</button>
            </div>
          </div>
        </div>
        <div className="floating-card fc-1">
          <div className="fc-icon">🔥</div>
          <div>
            <div className="fc-label">Trending</div>
            <div className="fc-val">+4,200 sold today</div>
          </div>
        </div>
        <div className="floating-card fc-2">
          <div className="fc-icon">✅</div>
          <div>
            <div className="fc-label">Free Delivery</div>
            <div className="fc-val">On orders above PKR 2,000</div>
          </div>
        </div>
      </div>
    </section>
  );
}
