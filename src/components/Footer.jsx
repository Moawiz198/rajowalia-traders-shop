import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';

export default function Footer() {
  const navigate = useNavigate();
  const { language, t } = useContext(LanguageContext);
  return (
    <>
      <footer>
        <div className="footer-brand">
          <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '50%', width: '32px', height: '32px', padding: '6px' }}>
              <svg viewBox="0 0 300 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                <path d="M 100 100 Q 100 50 150 50 Q 200 50 200 100" stroke="#000000" strokeWidth="22" strokeLinecap="round" fill="none"/>
                <path d="M 60 100 L 40 240 Q 40 260 60 260 L 240 260 Q 260 260 260 240 L 240 100 Z" stroke="#000000" strokeWidth="22" fill="none" strokeLinejoin="round"/>
                <path d="M 200 60 Q 280 100 260 200" stroke="rgba(0,0,0,0.25)" strokeWidth="12" strokeLinecap="round" fill="none"/>
                <path d="M 96 98 L 204 98" stroke="#000000" strokeWidth="16" fill="none"/>
              </svg>
            </div>
            <span>{t('app_name')} <span style={{ fontSize: '14px', letterSpacing: '2px', color: 'var(--muted)' }}>{language === 'en' ? "TRADER'S" : "ٹریڈرز"}</span></span>
          </div>
          <p>{t('footer_tagline')}</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <a 
              href="https://www.facebook.com/share/18WCGdoSxR/" 
              target="_blank" 
              rel="noreferrer" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.08)', 
                color: '#fff', 
                transition: 'all 0.3s' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/rajowalia_traders/" 
              target="_blank" 
              rel="noreferrer" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.08)', 
                color: '#fff', 
                transition: 'all 0.3s' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>{t('shop')}</h4>
          <ul>
            <li><a onClick={() => navigate('/category/Electronics')} style={{cursor: 'pointer'}}>{t('electronics')}</a></li>
            <li><a onClick={() => navigate('/category/Women Dresses')} style={{cursor: 'pointer'}}>{t('dresses')}</a></li>
            <li><a onClick={() => navigate('/category/Karyania')} style={{cursor: 'pointer'}}>{t('karyania')}</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t('help')}</h4>
          <ul>
            <li><a href="https://wa.me/923046999198?text=Hi%2C%20I%20order%20from%20rajowalia%20traders%20and%20i%20want%20to%20return%20this%20order" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>{t('returns')}</a></li>
            <li><a href="https://wa.me/923046999198?text=Hi%2C%20I%20have%20a%20question%20about%20Rajowalia%20Trader%27s" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>{t('faqs')}</a></li>
            <li><a href="https://wa.me/923046999198?text=Hi%2C%20I%20need%20some%20help" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>{t('contact_us')}</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t('company')}</h4>
          <ul>
            <li><a>{t('about_us')}</a></li>
            <li><a>{t('careers')}</a></li>
            <li><a>{t('blog')}</a></li>
            <li><a>{t('sellers')}</a></li>
          </ul>
        </div>
      </footer>
      <div className="footer-bottom">
        <p>© 2026 {t('app_name')} {t('app_name') === 'Rajowalia' ? "Trader's" : "ٹریڈرز"}. {t('all_rights')}</p>
        <p>Karachi, Pakistan <span onClick={() => navigate('/admin')} style={{ cursor: 'default', userSelect: 'none' }}>🇵🇰</span></p>
      </div>
    </>
  );
}
