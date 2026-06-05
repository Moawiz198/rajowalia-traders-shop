import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Brands() {
  useScrollReveal();

  return (
    <div className="brands-row reveal">
      <div className="brand-name">SAMSUNG</div>
      <div className="brand-name">APPLE</div>
      <div className="brand-name">SONY</div>
      <div className="brand-name">NIKE</div>
      <div className="brand-name">XIAOMI</div>
      <div className="brand-name">LG</div>
    </div>
  );
}
