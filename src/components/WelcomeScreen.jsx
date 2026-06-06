import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function WelcomeScreen() {
  const { registerOrLogin, loading } = useContext(UserContext);
  const [particles, setParticles] = useState([]);
  const [isExiting, setIsExiting] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !location) return;

    setIsExiting(true);
    setTimeout(async () => {
      await registerOrLogin({ name, phone, email, location });
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

        {/* Dynamic Registration Form */}
        <form onSubmit={handleSubmit} className="welcome-form">
          <div className="welcome-form-group">
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              disabled={isExiting}
            />
          </div>
          <div className="welcome-form-group">
            <input 
              type="tel" 
              placeholder="Phone Number (e.g. 03001234567)" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              required 
              disabled={isExiting}
            />
          </div>
          <div className="welcome-form-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              disabled={isExiting}
            />
          </div>
          <div className="welcome-form-group">
            <input 
              type="text" 
              placeholder="Shipping City (e.g. Lahore)" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              required 
              disabled={isExiting}
            />
          </div>
          <button type="submit" className="welcome-submit-btn" disabled={isExiting || loading}>
            {loading ? 'SYNCING DATABASE...' : 'SAVE & ENTER STORE'}
          </button>
        </form>
      </div>
    </div>
  );
}
