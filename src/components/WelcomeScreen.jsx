import React, { useEffect, useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export default function WelcomeScreen({ onEnter }) {
  const { language, setLanguage, t } = useContext(LanguageContext);
  const [particles, setParticles] = useState([]);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const list = [];
    for (let i = 0; i < 40; i++) {
      list.push({
        id: i,
        left: Math.random() * 100 + '%',
        size: Math.random() * 3 + 1 + 'px',
        duration: Math.random() * 8 + 5 + 's',
        delay: Math.random() * 8 + 's',
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
    setParticles(list);

    // Automatically enter store after welcome animation plays (15s)
    const autoEnterTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onEnter?.();
      }, 850); // Wait for the transition exit animation to finish
    }, 15000);

    // Skip welcome screen when mouse cursor is moved
    let initialX = null;
    let initialY = null;
    const skipThreshold = 20; // ignore minor pixel jitters on initial load

    const handleMouseMove = (e) => {
      if (initialX === null || initialY === null) {
        initialX = e.clientX;
        initialY = e.clientY;
        return;
      }

      const diffX = Math.abs(e.clientX - initialX);
      const diffY = Math.abs(e.clientY - initialY);

      if (diffX > skipThreshold || diffY > skipThreshold) {
        setIsExiting(true);
        window.removeEventListener('mousemove', handleMouseMove);
        setTimeout(() => {
          onEnter?.();
        }, 850);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(autoEnterTimer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onEnter]);

  return (
    <div className={`welcome-screen ${isExiting ? 'exit' : ''} ${language === 'ur' ? 'rtl' : ''}`} style={{ direction: language === 'ur' ? 'rtl' : 'ltr' }}>
      <div className="intro-glow"></div>
      <div className="particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Language Toggle in Welcome Screen */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100, display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setLanguage('en')}
          style={{
            background: language === 'en' ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          English
        </button>
        <button 
          onClick={() => setLanguage('ur')}
          style={{
            background: language === 'ur' ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          اردو
        </button>
      </div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '1rem', width: '100%', maxWidth: '800px' }}>
        <div className="logo-draw-wrap">
          <div className="logo-shine"></div>
          <svg className="logo-svg-main" viewBox="0 0 300 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: '150px' }}>
            <path className="bag-path" d="M 60 100 L 40 240 Q 40 260 60 260 L 240 260 Q 260 260 260 240 L 240 100 Z" stroke="white" strokeWidth="2.5" fill="none"/>
            <path className="bag-path2" d="M 100 100 Q 100 50 150 50 Q 200 50 200 100" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path className="bag-path3" d="M 200 60 Q 280 100 260 200" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path className="bag-path2" d="M 96 98 L 204 98" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        <div className="logo-text-anim" style={{ marginTop: '-15px' }}>
          <div className="s1-name">{t('app_name')}</div>
        </div>
        
        <div className="logo-sub-anim">
          <div className="s1-traders" style={{ margin: 0 }}>{t('app_name') === 'Rajowalia' ? "Trader's" : "ٹریڈرز"}</div>
          <div className="s1-tag" style={{ margin: '5px 0 0 0' }}>{t('app_tagline')}</div>
        </div>



        {/* Showcase what we offer */}
        <div style={{ marginTop: '1.5rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>
            {t('welcome_explore')}
          </div>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            {/* Electronics */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '160px',
              transition: 'transform 0.3s ease',
              backdropFilter: 'blur(5px)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: '24px' }}>📱</span>
              <div style={{ textAlign: language === 'ur' ? 'right' : 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{t('electronics')}</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{t('electronics_sub')}</div>
              </div>
            </div>

            {/* Dress */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '160px',
              transition: 'transform 0.3s ease',
              backdropFilter: 'blur(5px)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: '24px' }}>👗</span>
              <div style={{ textAlign: language === 'ur' ? 'right' : 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{t('dresses')}</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{t('dresses_sub')}</div>
              </div>
            </div>

            {/* Karyania */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '160px',
              transition: 'transform 0.3s ease',
              backdropFilter: 'blur(5px)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: '24px' }}>🛒</span>
              <div style={{ textAlign: language === 'ur' ? 'right' : 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{t('karyania')}</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{t('karyania_sub')}</div>
              </div>
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
}
