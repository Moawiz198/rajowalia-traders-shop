import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ProductContext } from '../context/ProductContext';

export default function PromoBanner() {
  useScrollReveal();
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Filter for products on sale / deals
  const saleProducts = products.filter(p => p.discountPercentage > 0 || (p.badge && p.badge.toUpperCase().includes('SALE')));

  useEffect(() => {
    if (saleProducts.length === 0) return;
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % saleProducts.length);
        setAnimate(true);
      }, 300); // Transition animation timing
    }, 3000);
    return () => clearInterval(interval);
  }, [saleProducts.length]);

  const activeProduct = saleProducts[currentIdx];

  const getMediaUrl = (imgVal) => {
    if (!imgVal) return '';
    if (imgVal.startsWith('[')) {
      try {
        const arr = JSON.parse(imgVal);
        const firstImg = arr.find(media => {
          const isVideo = typeof media === 'string' && (media.toLowerCase().endsWith('.mp4') || media.toLowerCase().endsWith('.webm') || media.startsWith('data:video/'));
          return !isVideo;
        });
        return firstImg || arr[0] || '';
      } catch (e) {
        return imgVal;
      }
    }
    return imgVal;
  };

  return (
    <div id="deals" className="promo-banner reveal">
      <div className="promo-left">
        <div className="promo-tag">Limited Time Offer</div>
        <div className="promo-title">UP TO 70% OFF<br />ELECTRONICS</div>
        <div className="promo-sub">Biggest sale of the year — today only!</div>
        <button className="promo-btn" onClick={() => navigate('/category/Deals')}>Grab the Deal</button>
      </div>
      <div className="promo-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px', height: '150px', position: 'relative' }}>
        <div className="promo-ring1"></div>
        <div className="promo-ring2"></div>
        <div className="promo-ring3"></div>
        {activeProduct ? (
          <div 
            onClick={() => navigate(`/product/${activeProduct.id}`)}
            style={{
              zIndex: 3,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              padding: '12px',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: animate ? 'scale(1)' : 'scale(0)',
              opacity: animate ? 1 : 0
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {activeProduct.image ? (() => {
              const imgUrl = getMediaUrl(activeProduct.image);
              const isVideo = typeof imgUrl === 'string' && (imgUrl.toLowerCase().endsWith('.mp4') || imgUrl.toLowerCase().endsWith('.webm') || imgUrl.startsWith('data:video/'));
              return isVideo ? (
                <video src={imgUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} muted autoPlay loop playsInline />
              ) : (
                <img src={imgUrl} alt={activeProduct.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              );
            })() : (
              <span style={{ fontSize: '60px' }}>{activeProduct.emoji}</span>
            )}
          </div>
        ) : (
          <div className="promo-emo" style={{ zIndex: 3, transition: 'all 0.3s', transform: animate ? 'scale(1)' : 'scale(0)' }}>🎧</div>
        )}
      </div>
    </div>
  );
}
