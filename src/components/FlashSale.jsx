import React, { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function FlashSale() {
  useScrollReveal();
  
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
      <div className="flash-left-info">
        <div className="flash-badge">⚡ Flash Sale</div>
        <div className="flash-info">
          <h4>Today's Mega Deals — Up to 70% Off</h4>
          <p>Limited time · Limited stock · Hurry up!</p>
        </div>
      </div>
      <div className="timer-boxes">
        <div className="tbox">
          <div className="tbox-n">{h}</div>
          <div className="tbox-l">HRS</div>
        </div>
        <div className="tsep">:</div>
        <div className="tbox">
          <div className="tbox-n">{m}</div>
          <div className="tbox-l">MIN</div>
        </div>
        <div className="tsep">:</div>
        <div className="tbox">
          <div className="tbox-n">{s}</div>
          <div className="tbox-l">SEC</div>
        </div>
      </div>
    </div>
  );
}
