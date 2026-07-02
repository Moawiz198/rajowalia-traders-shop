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
