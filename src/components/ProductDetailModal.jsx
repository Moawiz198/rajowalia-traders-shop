import React, { useState, useContext, useEffect, useCallback } from 'react';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';

const parseImages = (imageVal) => {
  if (!imageVal) return [];
  if (imageVal.startsWith('[')) {
    try { return JSON.parse(imageVal); } catch (e) { return [imageVal]; }
  }
  return [imageVal];
};

export default function ProductDetailModal({ product, isOpen, onClose }) {
  const { addToCart, wishlist, toggleWishlist, requireAuth } = useContext(UserContext);
  const { language, t } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);

  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);
  const [zoom, setZoom] = useState(false);

  const images = product ? parseImages(product.image) : [];
  const isRTL = language === 'ur';
  const isDark = theme === 'dark';
  const isWishlisted = wishlist.some(w => w.productId === product?.id);

  useEffect(() => {
    if (product) {
      setActiveIdx(0);
      setQuantity(1);
      setCartAdded(false);
      setZoom(false);
      if (product.weightOptions) {
        setSelectedWeight(product.weightOptions.split(',')[0].trim());
      }
    }
  }, [product]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleAddToCart = useCallback(() => {
    if (!product.inStock) return;
    requireAuth(() => {
      addToCart(product, quantity, selectedWeight);
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 2500);
    });
  }, [product, quantity, selectedWeight, addToCart, requireAuth]);

  const handleBuyNow = useCallback(() => {
    if (!product.inStock) return;
    requireAuth(() => {
      addToCart(product, quantity, selectedWeight);
      onClose();
      // Scroll to cart
      setTimeout(() => {
        document.querySelector('.cart-btn')?.click();
      }, 300);
    });
  }, [product, quantity, selectedWeight, addToCart, requireAuth, onClose]);

  if (!isOpen || !product) return null;

  const weightList = product.weightOptions ? product.weightOptions.split(',').map(w => w.trim()) : [];

  return (
    <>
      {/* Overlay backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 9000,
          animation: 'fadeIn 0.2s ease'
        }}
      />

      {/* Full page-like modal */}
      <div
        style={{
          position: 'fixed', inset: 0,
          zIndex: 9001,
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '20px 16px 60px',
          direction: isRTL ? 'rtl' : 'ltr'
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '1000px',
            background: isDark ? '#111827' : '#ffffff',
            borderRadius: '20px',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease',
            marginTop: '40px'
          }}
        >
          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                background: 'var(--accent)', color: '#fff',
                fontWeight: 800, fontSize: '11px', padding: '3px 10px',
                borderRadius: '4px', letterSpacing: '1px'
              }}>
                {product.brand?.toUpperCase() || 'STORE'}
              </span>
              {!product.category?.startsWith('Karyania') && (
                <span style={{
                  background: product.condition === 'Used' ? '#f59e0b' : '#22c55e',
                  color: '#000', fontWeight: 700, fontSize: '11px',
                  padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.5px'
                }}>
                  {product.condition === 'Used' ? (isRTL ? 'مستعمل' : 'USED') : (isRTL ? 'نیا' : 'NEW')}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => requireAuth(() => toggleWishlist(product))}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: isWishlisted ? '#ff4d1c' : (isDark ? '#94a3b8' : '#6b7280'),
                  padding: '6px', borderRadius: '50%',
                  transition: 'transform 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={isWishlisted ? '#ff4d1c' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </button>
              <button
                onClick={onClose}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
                  border: 'none', cursor: 'pointer',
                  color: isDark ? '#fff' : '#374151',
                  width: '36px', height: '36px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: 'bold',
                  transition: 'background 0.2s'
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Main content: 2-column grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            gap: 0
          }}
            className="product-detail-inner"
          >
            {/* LEFT: Image Gallery */}
            <div style={{
              padding: '32px 24px',
              borderRight: isRTL ? 'none' : (isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3f4f6'),
              borderLeft: isRTL ? (isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3f4f6') : 'none',
              display: 'flex', flexDirection: 'column', gap: '16px'
            }}>
              {/* Large Image */}
              <div
                className="pdm-main-img"
                onClick={() => setZoom(!zoom)}
                style={{
                  width: '100%', height: '360px',
                  background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', cursor: 'zoom-in',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e5e7eb',
                  position: 'relative'
                }}
              >
                {images.length > 0 ? (
                  <img
                    src={images[activeIdx]}
                    alt={product.name}
                    style={{
                      maxWidth: '90%', maxHeight: '90%',
                      objectFit: 'contain',
                      transform: zoom ? 'scale(1.4)' : 'scale(1)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '140px' }}>{product.emoji}</span>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveIdx(i => (i - 1 + images.length) % images.length); }}
                      style={{
                        position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
                        width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                        fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >‹</button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveIdx(i => (i + 1) % images.length); }}
                      style={{
                        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
                        width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                        fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >›</button>
                  </>
                )}
                {product.discountPercentage > 0 && (
                  <div style={{
                    position: 'absolute', top: '12px', left: isRTL ? 'auto' : '12px', right: isRTL ? '12px' : 'auto',
                    background: '#ef4444', color: '#fff', fontWeight: 800,
                    fontSize: '12px', padding: '4px 10px', borderRadius: '6px'
                  }}>
                    -{product.discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails strip */}
              {images.length > 1 && (
                <div style={{
                  display: 'flex', gap: '8px',
                  overflowX: 'auto', paddingBottom: '4px'
                }}>
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      style={{
                        width: '68px', height: '68px', flexShrink: 0,
                        borderRadius: '8px', overflow: 'hidden',
                        border: activeIdx === idx
                          ? '2px solid var(--accent)'
                          : (isDark ? '2px solid rgba(255,255,255,0.1)' : '2px solid #e5e7eb'),
                        cursor: 'pointer',
                        background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '4px',
                        transition: 'border-color 0.2s'
                      }}
                    >
                      <img src={img} alt={`thumb-${idx}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Image count indicator */}
              {images.length > 1 && (
                <div style={{
                  display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '-4px'
                }}>
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      style={{
                        width: idx === activeIdx ? '20px' : '6px', height: '6px',
                        borderRadius: '3px',
                        background: idx === activeIdx ? 'var(--accent)' : (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db'),
                        cursor: 'pointer', transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Info */}
            <div style={{
              padding: '32px 28px',
              display: 'flex', flexDirection: 'column', gap: '18px'
            }}>
              {/* Title */}
              <h1 style={{
                fontSize: '22px', fontWeight: 800, lineHeight: '1.3',
                color: isDark ? '#ffffff' : '#111827',
                fontFamily: 'Outfit, sans-serif',
                margin: 0
              }}>
                {t(product.name)}
              </h1>

              {/* Stars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#fbbf24', fontSize: '16px', letterSpacing: '2px' }}>
                  {'★'.repeat(product.stars)}{'☆'.repeat(5 - product.stars)}
                </span>
                <span style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#6b7280' }}>
                  {product.stars}.0 / 5
                </span>
              </div>

              {/* Brand & Stock status */}
              <div style={{
                display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
                fontSize: '13px'
              }}>
                <span style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                  {isRTL ? 'برانڈ:' : 'Brand:'}{' '}
                  <strong style={{ color: 'var(--accent)' }}>{product.brand}</strong>
                </span>
                <span style={{
                  background: product.inStock ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  color: product.inStock ? '#22c55e' : '#ef4444',
                  padding: '2px 10px', borderRadius: '20px',
                  fontSize: '12px', fontWeight: 600
                }}>
                  {product.inStock
                    ? (isRTL ? '✓ دستیاب' : '✓ In Stock')
                    : (isRTL ? '✗ ختم' : '✗ Sold Out')}
                </span>
              </div>

              {/* Price */}
              <div style={{
                background: isDark ? 'rgba(255,77,28,0.06)' : 'rgba(255,77,28,0.04)',
                border: isDark ? '1px solid rgba(255,77,28,0.15)' : '1px solid rgba(255,77,28,0.1)',
                borderRadius: '10px', padding: '14px 18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: '#ff4d1c', fontFamily: 'Outfit, sans-serif' }}>
                    PKR {product.price.toLocaleString()}
                  </span>
                  {product.oldPrice && (
                    <span style={{ fontSize: '16px', textDecoration: 'line-through', color: isDark ? '#64748b' : '#9ca3af' }}>
                      PKR {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.oldPrice && (
                  <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600, marginTop: '4px' }}>
                    {isRTL ? `آپ بچاتے ہیں: PKR ${(product.oldPrice - product.price).toLocaleString()}` : `You save: PKR ${(product.oldPrice - product.price).toLocaleString()}`}
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div style={{
                  borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3f4f6',
                  paddingTop: '14px'
                }}>
                  <h4 style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {isRTL ? 'تفصیل' : 'Description'}
                  </h4>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: isDark ? '#cbd5e1' : '#374151', margin: 0 }}>
                    {t(product.description)}
                  </p>
                </div>
              )}

              {/* Weight Options */}
              {weightList.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {isRTL ? 'وزن / سائز' : 'Weight / Size'}
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {weightList.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setSelectedWeight(opt)}
                        style={{
                          padding: '6px 16px', borderRadius: '8px',
                          border: selectedWeight === opt
                            ? '2px solid var(--accent)'
                            : (isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #d1d5db'),
                          background: selectedWeight === opt
                            ? 'rgba(255,77,28,0.08)' : 'transparent',
                          color: selectedWeight === opt ? 'var(--accent)' : (isDark ? '#fff' : '#374151'),
                          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div>
                <h4 style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {isRTL ? 'مقدار' : 'Quantity'}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0',
                    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #d1d5db',
                    borderRadius: '8px', overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      style={{
                        width: '36px', height: '36px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                        border: 'none', cursor: 'pointer', fontSize: '18px',
                        color: isDark ? '#fff' : '#374151', fontWeight: 'bold',
                        borderRight: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb'
                      }}
                    >−</button>
                    <span style={{
                      width: '40px', textAlign: 'center', fontSize: '15px',
                      fontWeight: 700, color: isDark ? '#fff' : '#111827'
                    }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock || 10, q + 1))}
                      style={{
                        width: '36px', height: '36px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                        border: 'none', cursor: 'pointer', fontSize: '18px',
                        color: isDark ? '#fff' : '#374151', fontWeight: 'bold',
                        borderLeft: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb'
                      }}
                    >+</button>
                  </div>

                  {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
                    <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>
                      ⚠️ {isRTL ? `صرف ${product.stock} باقی!` : `Only ${product.stock} left!`}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pdm-action-buttons" style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  style={{
                    flex: 1, height: '50px', borderRadius: '10px',
                    background: !product.inStock ? '#4b5563' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    border: 'none', color: '#fff',
                    fontSize: '15px', fontWeight: 800,
                    cursor: !product.inStock ? 'not-allowed' : 'pointer',
                    boxShadow: !product.inStock ? 'none' : '0 4px 15px rgba(37,99,235,0.4)',
                    transition: 'all 0.2s',
                    letterSpacing: '0.5px'
                  }}
                >
                  {isRTL ? 'ابھی خریدیں 🛒' : '🛒 Buy Now'}
                </button>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  style={{
                    flex: 1, height: '50px', borderRadius: '10px',
                    background: !product.inStock ? '#4b5563' : cartAdded ? '#22c55e' : 'var(--accent)',
                    border: 'none', color: '#fff',
                    fontSize: '15px', fontWeight: 800,
                    cursor: !product.inStock ? 'not-allowed' : 'pointer',
                    boxShadow: !product.inStock ? 'none' : '0 4px 15px rgba(255,77,28,0.4)',
                    transition: 'all 0.2s',
                    letterSpacing: '0.5px'
                  }}
                >
                  {!product.inStock
                    ? (isRTL ? 'ختم ہو گیا' : 'Sold Out')
                    : cartAdded
                    ? `✓ ${isRTL ? 'شامل کر دیا' : 'Added!'}`
                    : (isRTL ? '+ کارٹ میں شامل کریں' : '+ Add to Cart')}
                </button>
              </div>

              {/* Free delivery notice */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: isDark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.05)',
                border: isDark ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(34,197,94,0.2)',
                borderRadius: '8px', padding: '10px 14px',
                fontSize: '13px', color: '#22c55e', fontWeight: 500
              }}>
                🚚 {product.price >= 3000
                  ? (isRTL ? 'مفت ڈیلیوری اہل!' : 'Free Delivery Eligible!')
                  : (isRTL ? `مفت ڈیلیوری کے لیے PKR ${(3000 - product.price).toLocaleString()} مزید خریدیں` : `Add PKR ${(3000 - product.price).toLocaleString()} more for Free Delivery`)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

        .pdm-scroll-container { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
        .pdm-scroll-container::-webkit-scrollbar { width: 4px; }
        .pdm-scroll-container::-webkit-scrollbar-track { background: transparent; }
        .pdm-scroll-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

        @media (max-width: 700px) {
          .product-detail-inner {
            grid-template-columns: 1fr !important;
          }
          .product-detail-inner > div {
            border-right: none !important;
            border-left: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 20px 16px !important;
            max-height: none !important;
          }
          .pdm-main-img { height: 260px !important; }
          .pdm-action-buttons { flex-direction: column !important; }
          .pdm-action-buttons button { width: 100% !important; }
        }
      `}</style>
    </>
  );
}
