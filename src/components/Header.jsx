export default function Header({ isMuted, onToggleSound }) {
  return (
    <header className="app-header">
      <div className="header-top-row">
        <div className="header-brand-block">
          <span className="app-eyebrow">✦ Couple's Lottery &amp; Intimacy Game ✦</span>
          <h1 className="app-title">Roll the Night</h1>
        </div>
        <button
          type="button"
          className={`sound-toggle-btn ${isMuted ? 'muted' : ''}`}
          onClick={onToggleSound}
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          title={isMuted ? 'Sound off (click to unmute)' : 'Sound on (click to mute)'}
        >
          <span className="sound-icon">{isMuted ? '🔇' : '🔊'}</span>
        </button>
      </div>
      <p className="app-subtitle">
        Choose how many rounds you're up for. The machine picks the positions.
      </p>
    </header>
  );
}
