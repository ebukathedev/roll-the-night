import { useState, useRef, useEffect } from 'react';
import BallMachine from './BallMachine';
import './App.css';

const BALL_COLORS = ['#ff3d81', '#ffc83d', '#2ec4b6', '#7b5cff', '#ff7a3d', '#3da5ff'];

function darkenColor(hex, factor = 0.55) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor(((num >> 16) & 255) * factor));
  const g = Math.max(0, Math.floor(((num >> 8) & 255) * factor));
  const b = Math.max(0, Math.floor((num & 255) * factor));
  return `rgb(${r}, ${g}, ${b})`;
}

function clampHighest(val) {
  let num = parseInt(val, 10);
  if (isNaN(num) || num < 10) num = 10;
  if (num > 9999) num = 9999;
  return num;
}

export default function App() {
  const [rounds, setRounds] = useState(3);
  const [highestNumber, setHighestNumber] = useState(294);
  const [highestInput, setHighestInput] = useState('294');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);

  // Game state: 'idle' | 'mixing' | 'announcing' | 'drawn' | 'finished'
  const [gameState, setGameState] = useState('idle');
  const [activeTotalRounds, setActiveTotalRounds] = useState(3);
  const [drawnBalls, setDrawnBalls] = useState([]);
  const [airTarget, setAirTarget] = useState(0);
  const [statusText, setStatusText] = useState('Set your rounds, then start the machine.');
  const [btnText, setBtnText] = useState('Start the machine');

  const machineRef = useRef(null);
  const timer1Ref = useRef(null);
  const timer2Ref = useRef(null);
  const activeTotalRoundsRef = useRef(3);
  const highestNumberRef = useRef(294);
  const drawnBallsRef = useRef([]);

  // Keep refs in sync with state
  useEffect(() => {
    drawnBallsRef.current = drawnBalls;
  }, [drawnBalls]);

  useEffect(() => {
    activeTotalRoundsRef.current = activeTotalRounds;
  }, [activeTotalRounds]);

  useEffect(() => {
    highestNumberRef.current = highestNumber;
  }, [highestNumber]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timer1Ref.current) clearTimeout(timer1Ref.current);
      if (timer2Ref.current) clearTimeout(timer2Ref.current);
    };
  }, []);

  const isDrawing = gameState === 'mixing' || gameState === 'announcing';
  const isInputsLocked = gameState !== 'idle';

  const handleDecreaseRounds = () => {
    if (isInputsLocked || rounds <= 1) return;
    setRounds((prev) => prev - 1);
  };

  const handleIncreaseRounds = () => {
    if (isInputsLocked || rounds >= 10 || rounds >= highestNumber) return;
    setRounds((prev) => prev + 1);
  };

  const handleHighestInputChange = (e) => {
    setHighestInput(e.target.value);
  };

  const handleHighestInputBlur = () => {
    const clamped = clampHighest(highestInput);
    setHighestNumber(clamped);
    highestNumberRef.current = clamped;
    setHighestInput(String(clamped));
    if (rounds > clamped) {
      setRounds(clamped);
    }
  };

  const handleStartOrDraw = () => {
    // If finished, action button is "Play again"
    if (gameState === 'finished') {
      setDrawnBalls([]);
      drawnBallsRef.current = [];
      setGameState('idle');
      setStatusText('Set your rounds, then start the machine.');
      setBtnText('Start the machine');
      setAirTarget(0);
      return;
    }

    if (!isAgeConfirmed || isDrawing) return;

    // Clamp highest number on use
    const clamped = clampHighest(highestInput);
    setHighestNumber(clamped);
    highestNumberRef.current = clamped;
    setHighestInput(String(clamped));

    if (gameState === 'idle') {
      let effectiveRounds = rounds;
      if (effectiveRounds > clamped) {
        effectiveRounds = clamped;
        setRounds(effectiveRounds);
      }
      setActiveTotalRounds(effectiveRounds);
      activeTotalRoundsRef.current = effectiveRounds;
      setDrawnBalls([]);
      drawnBallsRef.current = [];
    }

    // Step 1: Lock inputs and start mixing
    setGameState('mixing');
    setStatusText('Mixing the balls…');
    setAirTarget(1);

    // Step 2: At 3.2s -> airTarget = 0, status "And the number is…"
    timer1Ref.current = setTimeout(() => {
      setGameState('announcing');
      setAirTarget(0);
      setStatusText('And the number is…');
    }, 3200);

    // Step 3: At 4.7s -> pick random number, append tray ball, replace ball
    timer2Ref.current = setTimeout(() => {
      const currentHighest = highestNumberRef.current;
      const prevDrawn = drawnBallsRef.current;
      const drawnSet = new Set(prevDrawn.map((b) => b.num));
      const available = [];

      for (let i = 1; i <= currentHighest; i++) {
        if (!drawnSet.has(i)) {
          available.push(i);
        }
      }

      const chosen =
        available.length > 0
          ? available[Math.floor(Math.random() * available.length)]
          : Math.floor(Math.random() * currentHighest) + 1;

      const color = BALL_COLORS[prevDrawn.length % BALL_COLORS.length];
      const newDrawn = [
        ...prevDrawn,
        {
          id: `${Date.now()}-${chosen}`,
          num: chosen,
          color,
          darkColor: darkenColor(color, 0.55),
        },
      ];

      setDrawnBalls(newDrawn);
      drawnBallsRef.current = newDrawn;

      // Physics: remove one random ball and add fresh one to keep 20 balls full
      machineRef.current?.removeAndReplaceBall();

      const total = activeTotalRoundsRef.current;
      if (newDrawn.length < total) {
        setStatusText(`Number ${chosen}!`);
        setBtnText(`Draw ball ${newDrawn.length + 1} of ${total}`);
        setGameState('drawn');
      } else {
        const roundWord = total === 1 ? 'round' : 'rounds';
        setStatusText(`Number ${chosen}! That's all ${total} ${roundWord}.`);
        setBtnText('Play again');
        setGameState('finished');
      }
    }, 4700);
  };

  return (
    <main className="app-wrapper">
      {/* 1. Title */}
      <h1 className="app-title">Roll the Night</h1>

      {/* 2. Subtitle */}
      <p className="app-subtitle">
        Choose how many rounds you're up for. The machine picks the positions.
      </p>

      {/* 3. The Machine */}
      <section className="machine-stage" aria-label="Lottery machine stage">
        <BallMachine ref={machineRef} airTarget={airTarget} />
        <div className="machine-chute" aria-hidden="true" />
      </section>

      {/* 4. Status Line */}
      <div className="status-line" role="status" aria-live="polite">
        {statusText}
      </div>

      {/* 5. Rounded Settings Panel */}
      <section className="settings-panel" aria-label="Game settings">
        {/* Rounds row */}
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
              onClick={handleDecreaseRounds}
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
              onClick={handleIncreaseRounds}
              disabled={isInputsLocked || rounds >= 10 || rounds >= highestNumber}
              aria-label="Increase rounds"
            >
              +
            </button>
          </div>
        </div>

        {/* Highest number row */}
        <div className="setting-row">
          <div className="setting-text-col">
            <label htmlFor="highest-number-input" className="setting-label">
              Highest number
            </label>
            <span className="setting-helper">Last entry on the list</span>
          </div>
          <div className="highest-input-wrapper">
            <input
              id="highest-number-input"
              type="number"
              min="10"
              max="9999"
              value={highestInput}
              onChange={handleHighestInputChange}
              onBlur={handleHighestInputBlur}
              disabled={isInputsLocked}
              className="highest-number-input"
              aria-label="Highest number on position list"
            />
          </div>
        </div>

        {/* 18+ Checkbox */}
        <label className={`checkbox-row ${isInputsLocked ? 'disabled' : ''}`}>
          <input
            type="checkbox"
            checked={isAgeConfirmed}
            onChange={(e) => setIsAgeConfirmed(e.target.checked)}
            disabled={isInputsLocked}
            className="age-checkbox"
          />
          <span>We're both 18 or older</span>
        </label>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleStartOrDraw}
          disabled={!isAgeConfirmed || isDrawing}
          className="primary-action-btn"
        >
          {btnText}
        </button>
      </section>

      {/* 6. Drawn Balls Tray */}
      {drawnBalls.length > 0 && (
        <section className="tray" aria-label="Drawn position balls">
          {drawnBalls.map((ball) => (
            <a
              key={ball.id}
              href={`https://sexpositions.club/positions/${ball.num}.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="tray-ball-link tray-drop-anim"
              aria-label={`Position ${ball.num}, opens in new tab`}
            >
              <div
                className="tray-ball"
                style={{
                  '--ball-color': ball.color,
                  '--ball-color-dark': ball.darkColor,
                }}
              >
                <span>{ball.num}</span>
              </div>
              <span className="tray-ball-caption">Reveal #{ball.num}</span>
            </a>
          ))}
        </section>
      )}

      {/* 7. Hint Line */}
      {gameState === 'finished' && (
        <p className="hint-line">
          Tap a ball to reveal its position. It opens in a new tab.
        </p>
      )}
    </main>
  );
}
