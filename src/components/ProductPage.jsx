import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';

const parseImages = (imageVal) => {
  if (!imageVal) return [];
  if (imageVal.startsWith('[')) {
    try { return JSON.parse(imageVal); } catch (e) { return [imageVal]; }
  }
  return [imageVal];
};

const REVIEWS_KEY = (id) => `product_reviews_${id}`;

export default function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);
  const { addToCart, wishlist, toggleWishlist, requireAuth, currentUser } = useContext(UserContext);
  const { language, t } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);

  const product = products.find(p => String(p.id) === String(productId));

  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewStars, setReviewStars] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isRTL = language === 'ur';
  const isDark = theme === 'dark';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      if (product.weightOptions) setSelectedWeight(product.weightOptions.split(',')[0].trim());
      const saved = localStorage.getItem(REVIEWS_KEY(product.id));
      if (saved) setReviews(JSON.parse(saved));
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: isDark ? '#0a0a0a' : '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <span style={{ fontSize: '60px' }}>📦</span>
        <h2 style={{ color: isDark ? '#fff' : '#111827' }}>Product not found</h2>
        <button onClick={() => navigate(-1)} style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>← Go Back</button>
      </div>
    );
  }

  const images = parseImages(product.image);
  const weightList = product.weightOptions ? product.weightOptions.split(',').map(w => w.trim()) : [];
  const isWishlisted = wishlist.some(w => w.productId === product.id);

  const avgStars = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1) : product.stars;
  const starCounts = [5, 4, 3, 2, 1].map(s => ({ star: s, count: reviews.filter(r => r.stars === s).length }));

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(product, selectedWeight || null, quantity);
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 2500);
    });
  };

  const handleBuyNow = () => {
    requireAuth(() => {
      addToCart(product, selectedWeight || null, quantity);
      navigate('/');
      setTimeout(() => document.querySelector('.cart-btn')?.click(), 400);
    });
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) return;
    requireAuth(() => {
      const newReview = {
        id: Date.now(),
        name: currentUser?.name || 'Customer',
        stars: reviewStars,
        text: reviewText.trim(),
        date: new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }),
        verified: true
      };
      const updated = [newReview, ...reviews];
      setReviews(updated);
      localStorage.setItem(REVIEWS_KEY(product.id), JSON.stringify(updated));
      setReviewText('');
      setReviewStars(5);
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
    });
  };

  const bg = isDark ? '#0a0a0a' : '#f4f4f4';
  const card = isDark ? '#111827' : '#ffffff';
  const border = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb';
  const text = isDark ? '#ffffff' : '#111827';
  const sub = isDark ? '#94a3b8' : '#6b7280';

  return (
    <div style={{ minHeight: '100vh', background: bg, direction: isRTL ? 'rtl' : 'ltr' }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: sub, marginBottom: '20px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link to={`/category/${product.category?.split(' - ')[0]}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{product.category?.split(' - ')[0]}</Link>
          <span>›</span>
          <span style={{ color: sub }}>{product.name?.slice(0, 40)}{product.name?.length > 40 ? '...' : ''}</span>
        </div>

        {/* TOP SECTION: Images + Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '24px',
          marginBottom: '24px'
        }} className="pdp-top-grid">

          {/* Left: Image Gallery */}
          <div style={{ background: card, borderRadius: '16px', border, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              width: '100%', height: '380px',
              background: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative', cursor: 'zoom-in'
            }}>
              {images.length > 0 ? (
                <img src={images[activeIdx]} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'opacity 0.2s' }} />
              ) : (
                <span style={{ fontSize: '120px' }}>{product.emoji}</span>
              )}
              {images.length > 1 && <>
                <button onClick={() => setActiveIdx(i => (i - 1 + images.length) % images.length)}
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: 'none', color: '#fff', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>‹</button>
                <button onClick={() => setActiveIdx(i => (i + 1) % images.length)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: 'none', color: '#fff', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>›</button>
              </>}
              {product.discountPercentage > 0 && (
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}>-{product.discountPercentage}% OFF</div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((img, idx) => (
                  <div key={idx} onClick={() => setActiveIdx(idx)} style={{
                    width: '70px', height: '70px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden',
                    border: activeIdx === idx ? '2px solid var(--accent)' : border,
                    cursor: 'pointer', background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', transition: 'border-color 0.2s'
                  }}>
                    <img src={img} alt={`img-${idx}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Title */}
            <div style={{ background: card, borderRadius: '16px', border, padding: '20px 24px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--accent)', color: '#fff', fontWeight: 800, fontSize: '11px', padding: '3px 10px', borderRadius: '4px' }}>{product.brand?.toUpperCase()}</span>
                {!product.category?.startsWith('Karyania') && (
                  <span style={{ background: product.condition === 'Used' ? '#f59e0b' : '#22c55e', color: '#000', fontWeight: 700, fontSize: '11px', padding: '3px 10px', borderRadius: '4px' }}>
                    {product.condition === 'Used' ? (isRTL ? 'مستعمل' : 'USED') : (isRTL ? 'نیا' : 'NEW')}
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: text, margin: '0 0 12px', lineHeight: 1.3, fontFamily: 'Outfit, sans-serif' }}>{t(product.name)}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ color: '#fbbf24', fontSize: '16px' }}>{'★'.repeat(Math.round(Number(avgStars)))}{'☆'.repeat(5 - Math.round(Number(avgStars)))}</span>
                <span style={{ fontSize: '13px', color: sub }}>{avgStars} / 5 · {reviews.length} {isRTL ? 'جائزے' : 'Reviews'}</span>
                <span style={{ background: product.inStock ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: product.inStock ? '#22c55e' : '#ef4444', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                  {product.inStock ? (isRTL ? '✓ دستیاب' : '✓ In Stock') : (isRTL ? '✗ ختم' : '✗ Sold Out')}
                </span>
              </div>
            </div>

            {/* Price */}
            <div style={{ background: card, borderRadius: '16px', border, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '32px', fontWeight: 900, color: '#ff4d1c', fontFamily: 'Outfit, sans-serif' }}>PKR {product.price.toLocaleString()}</span>
                {product.oldPrice && <span style={{ fontSize: '16px', textDecoration: 'line-through', color: sub }}>PKR {product.oldPrice.toLocaleString()}</span>}
              </div>
              {product.oldPrice && (
                <div style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600, marginTop: '4px' }}>
                  {isRTL ? `بچت: PKR ${(product.oldPrice - product.price).toLocaleString()}` : `You save: PKR ${(product.oldPrice - product.price).toLocaleString()}`}
                </div>
              )}
              <div style={{ marginTop: '12px', fontSize: '13px', color: product.price >= 3000 ? '#22c55e' : sub, background: product.price >= 3000 ? 'rgba(34,197,94,0.06)' : 'transparent', padding: product.price >= 3000 ? '8px 12px' : '0', borderRadius: '8px', display: 'inline-block' }}>
                🚚 {product.price >= 3000 ? (isRTL ? 'مفت ڈیلیوری اہل!' : 'Free Delivery Eligible!') : (isRTL ? `مفت ڈیلیوری کے لیے ${(3000 - product.price).toLocaleString()} مزید خریدیں` : `Add PKR ${(3000 - product.price).toLocaleString()} more for Free Delivery`)}
              </div>
            </div>

            {/* Options */}
            <div style={{ background: card, borderRadius: '16px', border, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Weights */}
              {weightList.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', color: sub, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>{isRTL ? 'وزن / سائز' : 'Weight / Size'}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {weightList.map(opt => (
                      <button key={opt} onClick={() => setSelectedWeight(opt)} style={{
                        padding: '7px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', transition: 'all 0.2s',
                        border: selectedWeight === opt ? '2px solid var(--accent)' : border,
                        background: selectedWeight === opt ? 'rgba(255,77,28,0.08)' : 'transparent',
                        color: selectedWeight === opt ? 'var(--accent)' : text
                      }}>{opt}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <div style={{ fontSize: '12px', color: sub, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>{isRTL ? 'مقدار' : 'Quantity'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border, borderRadius: '8px', overflow: 'hidden' }}>
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: '38px', height: '38px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', border: 'none', cursor: 'pointer', fontSize: '20px', color: text, fontWeight: 'bold', borderRight: border }}>−</button>
                    <span style={{ width: '44px', textAlign: 'center', fontWeight: 800, fontSize: '16px', color: text }}>{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock || 10, q + 1))} style={{ width: '38px', height: '38px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', border: 'none', cursor: 'pointer', fontSize: '20px', color: text, fontWeight: 'bold', borderLeft: border }}>+</button>
                  </div>
                  {product.stock > 0 && product.stock <= 5 && <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>⚠️ Only {product.stock} left!</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }} className="pdp-action-btns">
                <button onClick={handleBuyNow} disabled={!product.inStock} style={{
                  flex: 1, height: '52px', borderRadius: '10px', border: 'none', color: '#fff', fontWeight: 800, fontSize: '16px',
                  background: !product.inStock ? '#4b5563' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  boxShadow: !product.inStock ? 'none' : '0 4px 15px rgba(37,99,235,0.35)',
                  cursor: !product.inStock ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
                }}>🛒 {isRTL ? 'ابھی خریدیں' : 'Buy Now'}</button>
                <button onClick={handleAddToCart} disabled={!product.inStock} style={{
                  flex: 1, height: '52px', borderRadius: '10px', border: 'none', color: '#fff', fontWeight: 800, fontSize: '16px',
                  background: !product.inStock ? '#4b5563' : cartAdded ? '#22c55e' : 'var(--accent)',
                  boxShadow: !product.inStock ? 'none' : '0 4px 15px rgba(255,77,28,0.35)',
                  cursor: !product.inStock ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
                }}>
                  {!product.inStock ? (isRTL ? 'ختم' : 'Sold Out') : cartAdded ? `✓ ${isRTL ? 'شامل!' : 'Added!'}` : `+ ${isRTL ? 'کارٹ میں شامل کریں' : 'Add to Cart'}`}
                </button>
                <button onClick={() => requireAuth(() => toggleWishlist(product))} style={{
                  width: '52px', height: '52px', borderRadius: '10px', border, background: 'transparent',
                  cursor: 'pointer', color: isWishlisted ? '#ff4d1c' : sub, fontSize: '20px'
                }}>♥</button>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT DETAILS SECTION */}
        {product.description && (
          <div style={{ background: card, borderRadius: '16px', border, padding: '28px 32px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: text, margin: '0 0 18px', fontFamily: 'Outfit, sans-serif' }}>
              {isRTL ? 'مصنوع کی تفصیل' : 'Product Details'}
            </h2>
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: isDark ? '#cbd5e1' : '#374151', margin: 0, whiteSpace: 'pre-wrap' }}>
              {t(product.description)}
            </p>
          </div>
        )}

        {/* RATINGS & REVIEWS */}
        <div style={{ background: card, borderRadius: '16px', border, padding: '28px 32px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: text, margin: '0 0 24px', fontFamily: 'Outfit, sans-serif' }}>
            {isRTL ? 'جائزے اور تشخیص' : 'Ratings & Reviews'}
          </h2>

          {/* Rating Summary */}
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '28px' }}>
            <div style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontSize: '52px', fontWeight: 900, color: text, lineHeight: 1 }}>{avgStars}</div>
              <div style={{ color: '#fbbf24', fontSize: '20px', margin: '6px 0' }}>{'★'.repeat(Math.round(Number(avgStars)))}{'☆'.repeat(5 - Math.round(Number(avgStars)))}</div>
              <div style={{ fontSize: '12px', color: sub }}>{reviews.length} {isRTL ? 'جائزے' : 'Reviews'}</div>
            </div>
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {starCounts.map(({ star, count }) => (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: sub, minWidth: '14px' }}>{star}</span>
                  <span style={{ color: '#fbbf24', fontSize: '12px' }}>★</span>
                  <div style={{ flex: 1, height: '8px', background: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%', height: '100%', background: '#fbbf24', borderRadius: '4px', transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: sub, minWidth: '14px' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Review Form */}
          <div style={{ borderTop: border, paddingTop: '24px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: text, margin: '0 0 16px' }}>
              {isRTL ? 'اپنا جائزہ لکھیں' : 'Write a Review'}
            </h3>
            {/* Star picker */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} onMouseEnter={() => setHoverStar(s)} onMouseLeave={() => setHoverStar(0)} onClick={() => setReviewStars(s)}
                  style={{ fontSize: '28px', cursor: 'pointer', color: s <= (hoverStar || reviewStars) ? '#fbbf24' : (isDark ? 'rgba(255,255,255,0.15)' : '#d1d5db'), transition: 'color 0.1s' }}>★</span>
              ))}
            </div>
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
              placeholder={isRTL ? 'اپنا تجربہ یہاں لکھیں...' : 'Share your experience with this product...'}
              style={{
                width: '100%', minHeight: '90px', resize: 'vertical', padding: '12px 16px',
                background: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb',
                border: border, borderRadius: '10px', color: text, fontSize: '14px',
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', direction: isRTL ? 'rtl' : 'ltr'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: sub }}>{isRTL ? 'جائزہ جمع کرنے کے لیے لاگ ان ضروری ہے' : 'Login required to submit a review'}</span>
              <button onClick={handleSubmitReview} style={{
                background: reviewSubmitted ? '#22c55e' : 'var(--accent)', color: '#fff', border: 'none',
                padding: '10px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer'
              }}>
                {reviewSubmitted ? `✓ ${isRTL ? 'شکریہ!' : 'Thanks!'}` : (isRTL ? 'جمع کریں' : 'Submit Review')}
              </button>
            </div>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: sub, fontSize: '14px' }}>
              <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>💬</span>
              {isRTL ? 'ابھی تک کوئی جائزہ نہیں۔ پہلے جائزہ دیں!' : 'No reviews yet. Be the first to review!'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reviews.map(r => (
                <div key={r.id} style={{ borderBottom: border, paddingBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: text }}>{r.name}</span>
                      {r.verified && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#22c55e', fontWeight: 600 }}>✓ {isRTL ? 'تصدیق شدہ خریداری' : 'Verified Purchase'}</span>}
                    </div>
                    <span style={{ fontSize: '12px', color: sub }}>{r.date}</span>
                  </div>
                  <div style={{ color: '#fbbf24', fontSize: '14px', marginBottom: '8px' }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: isDark ? '#cbd5e1' : '#374151' }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <Footer />

      <style>{`
        @media (max-width: 700px) {
          .pdp-top-grid { grid-template-columns: 1fr !important; }
          .pdp-action-btns { flex-direction: column !important; }
          .pdp-action-btns button { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
