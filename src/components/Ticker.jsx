import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export default function Ticker() {
  const { t } = useContext(LanguageContext);

  const items = [
    t('electronics'),
    t('dresses'),
    t('karyania'),
    t('electronics'),
    t('dresses'),
    t('karyania'),
    t('electronics'),
    t('dresses'),
    t('karyania'),
    t('electronics'),
    t('dresses'),
    t('karyania')
  ];

  return (
    <div className="ticker">
      <div className="ticker-inner" id="ticker">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <span>{item}</span>
            {idx < items.length - 1 && <span className="ticker-dot">◆</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
