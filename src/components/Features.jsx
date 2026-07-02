import React, { useContext } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { LanguageContext } from '../context/LanguageContext';

export default function Features() {
  useScrollReveal();
  const { t } = useContext(LanguageContext);

  return (
    <div className="features-grid reveal">
      <div className="feat">
        <div className="feat-ico fi1">🚚</div>
        <div>
          <div className="feat-t">{t('feat_delivery_t')}</div>
          <div className="feat-d">{t('feat_delivery_d')}</div>
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
