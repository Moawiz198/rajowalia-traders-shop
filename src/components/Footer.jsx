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
              onMouseEnter={(e) => e.currentTarget.style.background = '#1877F2'}
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
              onMouseEnter={(e) => e.currentTarget.style.background = '#E1306C'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a 
              href="https://wa.me/923046999198" 
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
              onMouseEnter={(e) => e.currentTarget.style.background = '#25D366'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.27-5.592c1.657.983 3.313 1.493 5.733 1.494 5.344 0 9.695-4.347 9.698-9.7.001-2.593-1.007-5.032-2.842-6.866C17.069 1.499 14.629.5 12.013.5c-5.351 0-9.709 4.357-9.712 9.708-.002 2.215.539 4.334 1.597 6.223L2.83 21.13l4.908-1.286c.01-.001.018-.002.029-.002-.016-.002-.03-.005-.045-.008L6.327 18.408zm11.361-3.977c-.33-.165-1.951-.963-2.253-1.074-.302-.11-.522-.165-.742.165-.22.33-.852 1.074-1.044 1.294-.193.22-.385.247-.715.082-1.32-.66-2.545-1.185-3.52-2.024-.766-.66-1.284-1.474-1.433-1.73-.15-.258-.016-.398.116-.529.119-.117.264-.308.396-.462.132-.154.176-.264.264-.44.088-.176.044-.33-.022-.462-.066-.132-.522-1.26-.715-1.724-.188-.452-.379-.39-.522-.397-.135-.007-.29-.008-.445-.008-.154 0-.407.058-.62.292-.213.234-.813.794-.813 1.937 0 1.143.83 2.246.945 2.4.115.154 1.633 2.494 3.957 3.498.552.239 1.026.393 1.38.505.555.176 1.06.151 1.46.091.446-.067 1.951-.798 2.226-1.53.275-.733.275-1.36.193-1.493-.083-.133-.303-.215-.633-.38z" />
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
