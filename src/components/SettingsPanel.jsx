import { useState } from 'react';
import { ALL_CATEGORIES, ORAL_SUBTYPES } from '../constants/vibes';

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
  // Vibe presets
  vibePresets,
  selectedVibe,
  onSelectVibe,
  // Category exclusion
  excludedCategories,
  onToggleCategory,
  // Oral sub-filter
  oralSubtype,
  onSelectOralSubtype,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const currentSpiciness =
    spicinessLevels.find((s) => s.id === selectedSpiciness) || spicinessLevels[0];
  const currentVibe =
    vibePresets.find((v) => v.id === selectedVibe) || vibePresets[0];

  const oralIsExcluded = excludedCategories.has('Oral');

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
            <span className="setting-helper">Pick your intensity level</span>
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

      {/* 3. Vibe / Focus Preset Selector */}
      <div className="vibe-section">
        <div className="setting-row">
          <div className="setting-text-col">
            <span className="setting-label" id="vibe-label">
              Vibe
            </span>
            <span className="setting-helper">Who's the focus tonight?</span>
          </div>
          <span className="spiciness-badge-pill vibe-badge-pill">
            {currentVibe.badge}
          </span>
        </div>

        {/* Vibe Preset Pills */}
        <div
          className="vibe-pills-row"
          role="radiogroup"
          aria-labelledby="vibe-label"
        >
          {vibePresets.map((vibe) => {
            const isSelected = vibe.id === selectedVibe;
            return (
              <button
                key={vibe.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isInputsLocked}
                className={`vibe-pill-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectVibe(vibe.id)}
              >
                <span className="pill-icon">{vibe.icon}</span>
                <span className="pill-label">{vibe.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vibe Description */}
        <div className="spiciness-info-box vibe-info-box">
          <p className="spiciness-desc">{currentVibe.description}</p>
        </div>
      </div>

      {/* 4. Category & Oral Filters (Collapsible) */}
      <div className="filter-section">
        <button
          type="button"
          className={`filter-toggle-btn ${showFilters ? 'open' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          disabled={isInputsLocked}
          aria-expanded={showFilters}
          aria-controls="filter-details"
        >
          <span className="filter-toggle-icon">{showFilters ? '▾' : '▸'}</span>
          <span>Fine-tune categories</span>
          {excludedCategories.size > 0 && (
            <span className="filter-active-badge">
              {excludedCategories.size} excluded
            </span>
          )}
        </button>

        {showFilters && (
          <div className="filter-details" id="filter-details">
            {/* Category Toggles */}
            <div className="category-toggles" role="group" aria-label="Category filters">
              {ALL_CATEGORIES.map((cat) => {
                const isExcluded = excludedCategories.has(cat);
                return (
                  <label
                    key={cat}
                    className={`category-toggle-chip ${isExcluded ? 'excluded' : 'included'}`}
                  >
                    <input
                      type="checkbox"
                      checked={!isExcluded}
                      onChange={() => onToggleCategory(cat)}
                      disabled={isInputsLocked}
                      className="category-checkbox-hidden"
                    />
                    <span className="category-chip-check">
                      {isExcluded ? '✕' : '✓'}
                    </span>
                    <span className="category-chip-label">{cat}</span>
                  </label>
                );
              })}
            </div>

            {/* Oral Sub-Filter (only visible when Oral is not excluded) */}
            {!oralIsExcluded && (
              <div className="oral-sub-section">
                <span className="oral-sub-heading">Oral Filter</span>
                <div
                  className="oral-sub-pills"
                  role="radiogroup"
                  aria-label="Oral position sub-filter"
                >
                  {ORAL_SUBTYPES.map((sub) => {
                    const isSelected = sub.id === oralSubtype;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={isInputsLocked}
                        className={`oral-sub-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => onSelectOralSubtype(sub.id)}
                        title={sub.description}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Primary Action Button */}
      <button
        type="button"
        onClick={onStartOrDraw}
        disabled={isDrawing || poolCount === 0}
        className="primary-action-btn"
      >
        {poolCount === 0 ? 'No positions match — adjust filters' : btnText}
      </button>
    </section>
  );
}
