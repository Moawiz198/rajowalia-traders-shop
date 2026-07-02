import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { LanguageContext } from '../context/LanguageContext';

export default function FlashSale() {
  useScrollReveal();
  const navigate = useNavigate();
  const { language, t } = useContext(LanguageContext);
  
  // Starting seconds: 8 hours, 34 minutes, 22 seconds
  const [secondsLeft, setSecondsLeft] = useState(8 * 3600 + 34 * 60 + 22);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) return 12 * 3600; // Reset to 12 hours
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      h: String(hours).padStart(2, '0'),
      m: String(minutes).padStart(2, '0'),
      s: String(seconds).padStart(2, '0')
    };
  };

  const { h, m, s } = formatTime(secondsLeft);

  return (
    <div className="flash-bar reveal">
      <div 
        className="flash-left-info"
        onClick={() => navigate('/category/Deals')}
        style={{ cursor: 'pointer' }}
      >
        <div className="flash-badge" style={{ transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          ⚡ {t('flash_sale')}
        </div>
        <div className="flash-info">
          <h4 style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
            {t('mega_deals')}
          </h4>
          <p>{t('limited_time')}</p>
        </div>
      </div>
      <div className="timer-boxes">
        <div className="tbox">
          <div className="tbox-n">{h}</div>
          <div className="tbox-l">{t('hours')}</div>
        </div>
        <div className="tsep">:</div>
        <div className="tbox">
          <div className="tbox-n">{m}</div>
          <div className="tbox-l">{t('mins')}</div>
        </div>
        <div className="tsep">:</div>
        <div className="tbox">
          <div className="tbox-n">{s}</div>
          <div className="tbox-l">{t('secs')}</div>
        </div>
      </div>
    </div>
  );
}
