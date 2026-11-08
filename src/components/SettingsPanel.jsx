export default function SettingsPanel({
  rounds,
  maxRounds,
  spicinessLevels,
  selectedSpiciness,
  poolCount,
  isInputsLocked,
  isDrawing,
  btnText,
  onDecreaseRounds,
  onIncreaseRounds,
  onSelectSpiciness,
  onStartOrDraw,
}) {
  const currentSpiciness =
    spicinessLevels.find((s) => s.id === selectedSpiciness) || spicinessLevels[0];

  return (
    <section className="settings-panel" aria-label="Game settings">
      {/* 1. Rounds Stepper Row */}
      <div className="setting-row">
        <div className="setting-text-col">
          <span className="setting-label" id="rounds-label">
            Rounds
          </span>
          <span className="setting-helper">How many are you up for?</span>
        </div>
        <div className="stepper-control" role="group" aria-labelledby="rounds-label">
          <button
            type="button"
            className="stepper-btn"
            onClick={onDecreaseRounds}
            disabled={isInputsLocked || rounds <= 1}
            aria-label="Decrease rounds"
          >
            −
          </button>
          <span className="stepper-number" aria-live="polite">
            {rounds}
          </span>
          <button
            type="button"
            className="stepper-btn"
            onClick={onIncreaseRounds}
            disabled={isInputsLocked || rounds >= maxRounds}
            aria-label="Increase rounds"
          >
            +
          </button>
        </div>
      </div>

      {/* 2. Spiciness Level Selector Row */}
      <div className="spiciness-section">
        <div className="setting-row">
          <div className="setting-text-col">
            <span className="setting-label" id="spiciness-label">
              Spiciness
            </span>
            <span className="setting-helper">Pick your vibe tonight</span>
          </div>
          <span className="spiciness-badge-pill">
            {currentSpiciness.badge}
          </span>
        </div>

        {/* Segmented Buttons */}
        <div
          className="spiciness-pills-row"
          role="radiogroup"
          aria-labelledby="spiciness-label"
        >
          {spicinessLevels.map((lvl) => {
            const isSelected = lvl.id === selectedSpiciness;
            return (
              <button
                key={lvl.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isInputsLocked}
                className={`spiciness-pill-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectSpiciness(lvl.id)}
              >
                <span className="pill-icon">{lvl.icon}</span>
                <span className="pill-label">{lvl.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Spiciness Description & Count */}
        <div className="spiciness-info-box">
          <p className="spiciness-desc">{currentSpiciness.description}</p>
          <span className="spiciness-pool-count">
            {poolCount} positions available
          </span>
        </div>
      </div>

      {/* 3. Primary Action Button */}
      <button
        type="button"
        onClick={onStartOrDraw}
        disabled={isDrawing}
        className="primary-action-btn"
      >
        {btnText}
      </button>
    </section>
  );
}
