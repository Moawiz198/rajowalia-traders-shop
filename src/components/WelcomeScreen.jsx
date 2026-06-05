import React from 'react';

export default function WelcomeScreen({ onEnter }) {
  return (
    <div className="welcome-screen">
      {/* Floating background elements */}
      <div className="floating-icons">
        <span className="w-icon" style={{animationDelay: '0s'}}>🛍️</span>
        <span className="w-icon" style={{animationDelay: '1s'}}>💥</span>
        <span className="w-icon" style={{animationDelay: '0.5s'}}>📱</span>
        <span className="w-icon" style={{animationDelay: '2s'}}>🔥</span>
        <span className="w-icon" style={{animationDelay: '1.5s'}}>🎉</span>
      </div>
      
      <div className="welcome-content reveal visible">
        <h1 className="bom-bom">BOM BOM!</h1>
        <h2 className="welcome-subtitle">WELCOME TO <span className="accent">Rajowalia TRADER'S</span></h2>
        <p className="welcome-desc">
          Pakistan's most electrifying multi-category store<br/>is ready to blow your mind! 🤯
        </p>
        
        <button className="enter-btn" onClick={onEnter}>
          👇 TAP TO ENTER THE STORE!
        </button>
      </div>
    </div>
  );
}
