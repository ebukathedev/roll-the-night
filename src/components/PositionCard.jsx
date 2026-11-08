import { useState, useEffect, useRef } from 'react';
import PositionIllustration from './PositionIllustration';
import './PositionCard.css';

const DIFFICULTY_LABELS = ['', 'Easy', 'Gentle', 'Moderate', 'Athletic', 'Expert'];

export default function PositionCard({ position, ballColor, onClose }) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [erroredId, setErroredId] = useState(null);
  const imgError = erroredId === position?.id;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (position && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    } else if (!position && dialog.open) {
      dialog.close();
    }
  }, [position]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    const dialog = dialogRef.current;
    if (e.target === dialog) {
      dialog.close();
    }
  };

  if (!position) {
    return <dialog ref={dialogRef} className="position-dialog" />;
  }

  const difficultyDots = Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={`diff-dot ${i < position.difficulty ? 'filled' : ''}`}
      style={i < position.difficulty ? { backgroundColor: ballColor } : undefined}
    />
  ));

  const levelClass =
    position.level?.toLowerCase() === 'safe'
      ? 'level-safe'
      : position.level?.toLowerCase() === 'dangerous'
        ? 'level-dangerous'
        : 'level-careful';

  return (
    <dialog
      ref={dialogRef}
      className="position-dialog"
      onClick={handleBackdropClick}
      aria-label={`Position: ${position.name}`}
    >
      <div className="position-card">
        <button
          ref={closeBtnRef}
          type="button"
          className="card-close-btn"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Position illustration/image container */}
        <div className="card-illustration-area" style={{ '--illus-glow': `${ballColor}33` }}>
          {!imgError && position.image ? (
            <div className="card-img-frame">
              <img
                key={position.id}
                src={position.image}
                alt={position.name}
                className="card-position-img"
                loading="eager"
                onError={() => setErroredId(position.id)}
              />
            </div>
          ) : (
            <PositionIllustration category={position.category} color={ballColor} />
          )}
        </div>

        {/* Ball number badge */}
        <div className="card-ball-badge" style={{ '--badge-color': ballColor }}>
          {position.id}
        </div>

        {/* Position title */}
        <h2 className="card-title">{position.name}</h2>

        {/* Meta badges */}
        <div className="card-meta">
          <span className="card-category" style={{ borderColor: ballColor, color: ballColor }}>
            {position.category}
          </span>
          {position.level && (
            <span className={`card-level ${levelClass}`}>
              {position.level}
            </span>
          )}
          <span className="card-difficulty" aria-label={`Difficulty: ${DIFFICULTY_LABELS[position.difficulty]}`}>
            {difficultyDots}
            <span className="diff-label">{DIFFICULTY_LABELS[position.difficulty]}</span>
          </span>
        </div>

        {/* Description & tags */}
        <p className="card-description">{position.description}</p>

        {position.tags && position.tags.length > 0 && (
          <div className="card-tags">
            {position.tags.map((t, i) => (
              <span key={i} className="card-tag">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* External reference link */}
        <a
          href={`https://sexpositions.club/positions/${position.id}.html`}
          target="_blank"
          rel="noopener noreferrer"
          className="card-external-link"
        >
          View on sexpositions.club ↗
        </a>

        {/* Got it action button */}
        <button
          type="button"
          className="card-got-it-btn"
          onClick={() => dialogRef.current?.close()}
        >
          Got it
        </button>
      </div>
    </dialog>
  );
}
