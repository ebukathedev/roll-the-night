import { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import { preloadImage } from '../utils/preload';
import PositionIllustration from './PositionIllustration';
import './FloatingRevealBall.css';

const DIFFICULTY_LABELS = ['', 'Easy', 'Gentle', 'Moderate', 'Athletic', 'Expert'];

export default function FloatingRevealBall({ ballData, onComplete }) {
  // Phase: 'floating' | 'opening' | 'card' | 'packing' | 'done'
  const [phase, setPhase] = useState('floating');
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const audioInitializedRef = useRef(false);

  // Preload image and play floating sound on spawn
  useEffect(() => {
    sound.init();
    sound.playFloatAscend();
    if (ballData?.image) {
      preloadImage(ballData.image);
    }
  }, [ballData?.image]);

  // Handle tap to split and pop out card
  const handleBallTap = () => {
    if (phase !== 'floating') return;

    if (!audioInitializedRef.current) {
      sound.init();
      audioInitializedRef.current = true;
    }

    setPhase('opening');
    sound.playBallSplit();

    // Trigger card emergence & 3D flip
    setTimeout(() => {
      setPhase('card');
      setIsFlipped(true);

      // Moment of reveal: Confetti & Fanfare!
      setTimeout(() => {
        sound.playRevealFanfare();
        fireConfetti(window.innerWidth / 2, window.innerHeight * 0.42);
      }, 350);
    }, 450);
  };

  // Handle card dismissal / pack up back into ball
  const handlePackUp = () => {
    if (phase !== 'card') return;

    setPhase('packing');
    setIsFlipped(false);

    // Ball halves snap shut
    setTimeout(() => {
      sound.playSnapShut();
    }, 380);

    // Ball floats down to tray position
    setTimeout(() => {
      sound.playTraySettle();
      setPhase('done');
      onComplete?.(ballData);
    }, 850);
  };

  const levelClass =
    ballData.level?.toLowerCase() === 'safe'
      ? 'holo-safe'
      : ballData.level?.toLowerCase() === 'dangerous'
        ? 'holo-dangerous'
        : 'holo-careful';

  const difficultyStars = Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={`holo-star ${i < ballData.difficulty ? 'active' : ''}`}
    >
      ★
    </span>
  ));

  return (
    <div className={`floating-overlay phase-${phase}`}>
      <div className="floating-backdrop" onClick={phase === 'card' ? handlePackUp : undefined} />

      <div className={`reveal-stage ${phase}`}>
        {/* Energy Beam between split halves */}
        <div className="energy-core" />

        {/* 1. TOP HALF OF THE BALL */}
        <div
          className="ball-half ball-half-top"
          style={{
            '--ball-color': ballData.color,
            '--ball-dark': ballData.darkColor,
          }}
          onClick={phase === 'floating' ? handleBallTap : undefined}
        >
          <div className="half-sphere-highlight" />
        </div>

        {/* 2. BOTTOM HALF OF THE BALL */}
        <div
          className="ball-half ball-half-bottom"
          style={{
            '--ball-color': ballData.color,
            '--ball-dark': ballData.darkColor,
          }}
          onClick={phase === 'floating' ? handleBallTap : undefined}
        >
          <div className="half-sphere-shadow" />
        </div>

        {/* Center Ball Latch & Number (visible during floating) */}
        <div
          className="ball-center-latch"
          style={{
            '--ball-color': ballData.color,
          }}
          onClick={phase === 'floating' ? handleBallTap : undefined}
        >
          <div className="latch-ring">
            <span className="latch-number">{ballData.num}</span>
          </div>
        </div>

        {/* Tap Prompt indicator */}
        {phase === 'floating' && (
          <div className="tap-prompt-pill" onClick={handleBallTap}>
            <span className="sparkle-icon">✨</span>
            <span>Tap to open</span>
            <span className="sparkle-icon">✨</span>
          </div>
        )}

        {/* 3. POKÉMON-STYLE HOLOGRAPHIC CARD */}
        <div className={`card-3d-wrapper ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-3d-inner">
            {/* CARD BACK */}
            <div className="card-face card-back">
              <div className="card-back-frame">
                <div className="card-back-orb">
                  <span className="orb-num">#{ballData.num}</span>
                </div>
                <div className="card-back-title">ROLL THE NIGHT</div>
                <div className="card-back-pattern" />
              </div>
            </div>

            {/* CARD FRONT (Pokemon-style Holographic Rare) */}
            <div className="card-face card-front">
              <div className="holo-card">
                {/* Holographic foil shimmer sweep */}
                <div className="holo-foil-shimmer" />

                {/* Card Top Header */}
                <div className="holo-header">
                  <div className="holo-title-group">
                    <span className="holo-card-type">{ballData.category || 'Position'}</span>
                    <h3 className="holo-card-name">{ballData.name}</h3>
                  </div>
                  <div className="holo-hp-badge">
                    <span className="hp-label">NO.</span>
                    <span className="hp-value">#{ballData.num}</span>
                  </div>
                </div>

                {/* Card Art Illustration Window */}
                <div className="holo-art-window">
                  {!imgError && ballData.image ? (
                    <>
                      {!imgLoaded && <div className="art-loader-skeleton" aria-hidden="true" />}
                      <img
                        src={ballData.image}
                        alt={ballData.name}
                        className={`holo-position-img ${imgLoaded ? 'loaded' : ''}`}
                        loading="eager"
                        decoding="async"
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                      />
                    </>
                  ) : (
                    <PositionIllustration category={ballData.category} color={ballData.color} />
                  )}
                  <div className="art-glare" />
                </div>

                {/* Card Type Bar & Subtitle */}
                <div className="holo-sub-bar">
                  <span className={`holo-level-pill ${levelClass}`}>
                    {ballData.level || 'Safe'}
                  </span>
                  <div className="holo-difficulty-stars">
                    {difficultyStars}
                    <span className="diff-text">{DIFFICULTY_LABELS[ballData.difficulty] || 'Moderate'}</span>
                  </div>
                </div>

                {/* Attack / Move Description Box */}
                <div className="holo-ability-box">
                  <div className="ability-title">
                    <span className="energy-icon">⚡</span>
                    <span>Action Guide</span>
                  </div>
                  <p className="holo-description">{ballData.description}</p>
                </div>

                {/* Style Tags */}
                {ballData.tags && ballData.tags.length > 0 && (
                  <div className="holo-tags-row">
                    {ballData.tags.map((tag, idx) => (
                      <span key={idx} className="holo-tag-badge">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Card Bottom / Rarity Bar */}
                <div className="holo-card-footer">
                  <span className="rarity-symbol">★ Secret Rare</span>
                  <a
                    href={`https://sexpositions.club/positions/${ballData.num}.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="holo-source-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    sexpositions.club ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button to pack up & add ball to tray */}
        {phase === 'card' && (
          <button
            type="button"
            className="pack-up-action-btn"
            onClick={handlePackUp}
            aria-label="Collect ball and return to tray"
          >
            Collect & Continue
          </button>
        )}
      </div>
    </div>
  );
}

