import React, { useEffect, useState } from 'react';

export default function WelcomeScreen({ onEnter }) {
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
  }, []);

  const handleEnterClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter?.();
    }, 850); // Wait for the transition exit animation to finish
  };

  return (
    <div className={`welcome-screen ${isExiting ? 'exit' : ''}`}>
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

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '1rem', width: '100%' }}>
        <div className="logo-draw-wrap">
          <div className="logo-shine"></div>
          {/* Animated SVG bag drawing itself */}
          <svg className="logo-svg-main" viewBox="0 0 300 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: '180px' }}>
            {/* Bag body — draws itself */}
            <path className="bag-path" d="M 60 100 L 40 240 Q 40 260 60 260 L 240 260 Q 260 260 260 240 L 240 100 Z" stroke="white" stroke-width="2.5" fill="none"/>
            {/* Bag handle left */}
            <path className="bag-path2" d="M 100 100 Q 100 50 150 50 Q 200 50 200 100" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            {/* Decorative swoosh */}
            <path className="bag-path3" d="M 200 60 Q 280 100 260 200" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            {/* Handle top bar */}
            <path className="bag-path2" d="M 96 98 L 204 98" stroke="white" stroke-width="2" fill="none"/>
          </svg>
        </div>
        <div className="logo-text-anim" style={{ marginTop: '-15px' }}>
          <div className="s1-name">Rajowalia</div>
        </div>
        <div className="logo-sub-anim">
          <div className="s1-traders" style={{ margin: 0 }}>Trader's</div>
          <div className="s1-tag" style={{ margin: '5px 0 0 0' }}>Pakistan's Premium Store</div>
        </div>

        {/* Enter prompt */}
        <div className="enter-prompt" style={{ marginTop: '1.5rem' }}>
          <div className="enter-ring" onClick={handleEnterClick}>→</div>
          <div className="enter-hint">Click to Enter</div>
        </div>
      </div>
    </div>
  );
}
