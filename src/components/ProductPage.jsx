import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import MainLayout from './MainLayout';

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
  const { addToCart, wishlist, toggleWishlist, requireAuth, currentUser, setCartOpen } = useContext(UserContext);
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
  const [photoPreview, setPhotoPreview] = useState('');
  const [videoPreview, setVideoPreview] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(isRTL ? "تصویر کا سائز 2MB سے کم ہونا چاہئے۔" : "Photo size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(isRTL ? "ویڈیو کا سائز 5MB سے کم ہونا چاہئے۔" : "Video size must be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isRTL = language === 'ur';
  const isDark = theme === 'dark';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      let wl = product.weightOptions ? product.weightOptions.split(',').map(w => w.trim()).filter(w => w) : [];
      if (wl.some(w => /kg$|g$|grams$/i.test(w.replace(/\s/g, '')))) {
        wl = ['100g', '150g', '200g', '250g', '500g', '1kg', '2kg', '3kg', '5kg'];
      }
      if (wl.length > 0) setSelectedWeight(wl[0]);
      
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
  let weightList = product.weightOptions ? product.weightOptions.split(',').map(w => w.trim()).filter(w => w) : [];
  
  const isWeightProduct = weightList.some(w => /kg$|g$|grams$/i.test(w.replace(/\s/g, '')));
  if (isWeightProduct) {
    weightList = ['100g', '150g', '200g', '250g', '500g', '1kg', '2kg', '3kg', '5kg'];
  }
  const isWishlisted = wishlist.some(w => w.productId === product.id);

  const avgStars = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1) : product.stars;
  const starCounts = [5, 4, 3, 2, 1].map(s => ({ star: s, count: reviews.filter(r => r.stars === s).length }));
  const getWeightFactor = (weightLabel) => {
    if (!weightLabel) return 1;
    const clean = weightLabel.toLowerCase().trim();
    const kgMatch = clean.match(/^([0-9.]+)\s*kg$/);
    if (kgMatch) return parseFloat(kgMatch[1]);
    const gMatch = clean.match(/^([0-9.]+)\s*(g|gm|grams)$/);
    if (gMatch) return parseFloat(gMatch[1]) / 1000;
    return 1;
  };

  const getSizeAddend = (weightLabel) => {
    if (!weightLabel) return 0;
    
    if (weightLabel.includes(':')) {
      const parts = weightLabel.split(':');
      const customPrice = parseFloat(parts[parts.length - 1]);
      if (!isNaN(customPrice)) return customPrice;
    }

    const clean = weightLabel.toLowerCase().trim();
    if (clean === 'xl' || clean === 'xxl') return 300;
    
    const canvasSteps = {
      '4x4': 0, '6x6': 50, '8x8': 100, '8x10': 150, 
      '10x10': 200, '10x12': 250, '12x12': 300, '12x16': 350, 
      '12x18': 400, '16x20': 450, '18x24': 500, '24x36': 550
    };
    if (canvasSteps[clean] !== undefined) return canvasSteps[clean];
    
    return 0;
  };

  const factor = getWeightFactor(selectedWeight);
  const sizeAddend = getSizeAddend(selectedWeight);
  const currentPrice = (product.price * factor) + sizeAddend;
  const currentOldPrice = product.oldPrice ? (product.oldPrice * factor) + sizeAddend : null;

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(product, selectedWeight || null, quantity);
      setCartAdded(true);
      setCartOpen(true);
      setTimeout(() => setCartAdded(false), 2500);
    });
  };

  const handleBuyNow = () => {
    requireAuth(() => {
      addToCart(product, selectedWeight || null, quantity);
      setCartOpen(true);
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
        verified: true,
        photo: photoPreview || null,
        video: videoPreview || null
      };
      const updated = [newReview, ...reviews];
      setReviews(updated);
      localStorage.setItem(REVIEWS_KEY(product.id), JSON.stringify(updated));
      setReviewText('');
      setReviewStars(5);
      setPhotoPreview('');
      setVideoPreview('');
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
    <MainLayout>
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
                (typeof images[activeIdx] === 'string' && (images[activeIdx].toLowerCase().endsWith('.mp4') || images[activeIdx].toLowerCase().endsWith('.webm') || images[activeIdx].startsWith('data:video/'))) ? (
                  <video src={images[activeIdx]} controls autoPlay loop muted style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <img src={images[activeIdx]} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'opacity 0.2s' }} />
                )
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
                {images.map((img, idx) => {
                  const isVideoThumb = typeof img === 'string' && (img.toLowerCase().endsWith('.mp4') || img.toLowerCase().endsWith('.webm') || img.startsWith('data:video/'));
                  return (
                    <div key={idx} onClick={() => setActiveIdx(idx)} style={{
                      width: '70px', height: '70px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden',
                      border: activeIdx === idx ? '2px solid var(--accent)' : border,
                      cursor: 'pointer', background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', transition: 'border-color 0.2s', position: 'relative'
                    }}>
                      {isVideoThumb ? (
                        <>
                          <video src={img} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', background: 'rgba(0,0,0,0.5)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px' }}>▶</div>
                        </>
                      ) : (
                        <img src={img} alt={`img-${idx}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      )}
                    </div>
                  );
                })}
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
                <span style={{ fontSize: '32px', fontWeight: 900, color: '#ff4d1c', fontFamily: 'Outfit, sans-serif' }}>PKR {currentPrice.toLocaleString()}</span>
                {currentOldPrice && <span style={{ fontSize: '16px', textDecoration: 'line-through', color: sub }}>PKR {currentOldPrice.toLocaleString()}</span>}
              </div>
              {currentOldPrice && (
                <div style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600, marginTop: '4px' }}>
                  {isRTL ? `بچت: PKR ${(currentOldPrice - currentPrice).toLocaleString()}` : `You save: PKR ${(currentOldPrice - currentPrice).toLocaleString()}`}
                </div>
              )}
              <div style={{ marginTop: '12px', fontSize: '13px', color: currentPrice >= 3000 ? '#22c55e' : sub, background: currentPrice >= 3000 ? 'rgba(34,197,94,0.06)' : 'transparent', padding: currentPrice >= 3000 ? '8px 12px' : '0', borderRadius: '8px', display: 'inline-block' }}>
                🚚 {currentPrice >= 3000 ? (isRTL ? 'مفت ڈیلیوری اہل!' : 'Free Delivery Eligible!') : (isRTL ? `مفت ڈیلیوری کے لیے ${(3000 - currentPrice).toLocaleString()} مزید خریدیں` : `Add PKR ${(3000 - currentPrice).toLocaleString()} more for Free Delivery`)}
              </div>
              {product.category?.startsWith('Painting') && (
                <div style={{ marginTop: '8px', fontSize: '13px', color: '#ffb703', background: 'rgba(255,183,3,0.1)', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚚</span>
                  <span>{isRTL ? 'ڈیلیوری: رحیم یار خان (2-3 دن) | پاکستان بھر میں (4-5 دن)' : 'Delivery: RYK (2-3 Days) | All over Pakistan (4-5 Days)'}</span>
                </div>
              )}
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
              {/* Account Requirement Warning Note */}
              <div style={{
                fontSize: '12px',
                color: isDark ? '#f87171' : '#dc2626',
                fontWeight: 600,
                textAlign: 'center',
                marginTop: '12px',
                background: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.05)',
                border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <span>ℹ️</span>
                <span>{isRTL 
                  ? 'خریداری کے لیے اکاؤنٹ بنانا لازمی ہے۔ جب آپ ابھی خریدیں پر کلک کریں گے، تو اکاؤنٹ بنانے کا فارم کھل جائے گا۔' 
                  : 'Account registration is required to buy. Clicking "Buy Now" will prompt you to create or log in to your account.'}</span>
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

            {/* Media Uploads */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '14px', flexWrap: 'wrap', border: border, padding: '12px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.01)' : '#fbfbfb' }}>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: sub, marginBottom: '6px', fontWeight: 600 }}>📸 {isRTL ? 'تصویر شامل کریں (زیادہ سے زیادہ 2MB)' : 'Add Photo (Max 2MB)'}</label>
                <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ fontSize: '12px', color: sub, width: '100%' }} />
                {photoPreview && <img src={photoPreview} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px', display: 'block', border }} />}
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: sub, marginBottom: '6px', fontWeight: 600 }}>🎥 {isRTL ? 'ویڈیو شامل کریں (زیادہ سے زیادہ 5MB)' : 'Add Video (Max 5MB)'}</label>
                <input type="file" accept="video/*" onChange={handleVideoChange} style={{ fontSize: '12px', color: sub, width: '100%' }} />
                {videoPreview && <video src={videoPreview} style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px', display: 'block', border }} controls />}
              </div>
            </div>
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
                  
                  {/* Media Displays */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {r.photo && (
                      <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => window.open(r.photo, '_blank')}>
                        <img src={r.photo} alt="User Upload" style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', border }} />
                      </div>
                    )}
                    {r.video && (
                      <div style={{ position: 'relative' }}>
                        <video src={r.video} style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain', borderRadius: '8px', border }} controls />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 700px) {
          .pdp-top-grid { grid-template-columns: 1fr !important; }
          .pdp-action-btns { flex-direction: column !important; }
          .pdp-action-btns button { width: 100% !important; }
        }
      `}</style>
    </MainLayout>
  );
}
