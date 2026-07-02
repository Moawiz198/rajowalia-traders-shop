import React, { useContext } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { LanguageContext } from '../context/LanguageContext';
import { ProductContext } from '../context/ProductContext';

export default function Features() {
  useScrollReveal();
  const { language, t } = useContext(LanguageContext);
  const { settings } = useContext(ProductContext);

  const getDeliveryText = () => {
    const ryk = language === 'ur' ? (settings.durationRykUr || '48 گھنٹے') : (settings.durationRykEn || '48 Hours');
    const pk = language === 'ur' ? (settings.durationPkUr || '4 سے 5 دن') : (settings.durationPkEn || '4-5 Days');
    
    let text = language === 'ur'
      ? `رحیم یار خان: ${ryk} | پورے پاکستان میں: ${pk}`
      : `RYK: ${ryk} | Pakistan: ${pk}`;

    if (settings.holidayMode) {
      text += language === 'ur' ? ' (تعطیلات کی وجہ سے تاخیر متوقع ہے)' : ' (Holiday delays expected)';
    }
    return text;
  };

  return (
    <div className="features-grid reveal">
      <div className="feat">
        <div className="feat-ico fi1">🚚</div>
        <div>
          <div className="feat-t">{t('feat_delivery_t')}</div>
          <div className="feat-d">{getDeliveryText()}</div>
        </div>
      </div>
      <div className="feat">
        <div className="feat-ico fi2">🔒</div>
        <div>
          <div className="feat-t">{t('feat_payment_t')}</div>
          <div className="feat-d">{t('feat_payment_d')}</div>
        </div>
      </div>
      <div className="feat">
        <div className="feat-ico fi3">↩️</div>
        <div>
          <div className="feat-t">{t('feat_returns_t')}</div>
          <div className="feat-d">{t('feat_returns_d')}</div>
        </div>
      </div>
      <div className="feat">
        <div className="feat-ico fi4">💬</div>
        <div>
          <div className="feat-t">{t('feat_support_t')}</div>
          <div className="feat-d">{t('feat_support_d')}</div>
        </div>
      </div>
    </div>
  );
}
