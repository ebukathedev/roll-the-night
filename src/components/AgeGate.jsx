import { useState } from 'react';
import { sound } from '../utils/sound';
import { setAgeVerified } from '../utils/storage';
import './AgeGate.css';

export default function AgeGate({ onVerified }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setAgeVerified();
    sound.init();
    sound.playFloatAscend();
    onVerified();
  };

  const handleDecline = () => {
    setIsExiting(true);
    setTimeout(() => {
      window.location.href = 'https://www.google.com';
    }, 400);
  };

  return (
    <div className={`age-gate-overlay ${isExiting ? 'fade-out' : ''}`} role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="age-gate-card">
        {/* Glowing 18+ Crest */}
        <div className="gate-crest-orb">
          <span className="gate-18-label">18+</span>
        </div>

        <h1 id="gate-title" className="gate-title">Roll the Night</h1>
        <p className="gate-tagline">Adult Couple's Lottery Game</p>

        <div className="gate-notice-box">
          <p className="gate-notice-text">
            This application contains mature, adult-themed material designed for consenting couples.
            You must be <strong>18 years of age or older</strong> to enter.
          </p>
        </div>

        <div className="gate-actions">
          <button
            type="button"
            className="gate-enter-btn"
            onClick={handleEnter}
            autoFocus
          >
            We're 18 or Older — Enter
          </button>

          <button
            type="button"
            className="gate-exit-btn"
            onClick={handleDecline}
          >
            I'm Under 18 — Exit
          </button>
        </div>
      </div>
    </div>
  );
}
