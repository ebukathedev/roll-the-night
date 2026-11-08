import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Header,
  MachineStage,
  StatusLine,
  SettingsPanel,
  BallTray,
  HintLine,
  PositionCard,
  FloatingRevealBall,
  AgeGate,
} from './components';
import positions from './data/positions';
import { SPICINESS_LEVELS } from './constants/spiciness';
import { BALL_COLORS, darkenColor } from './utils/colors';
import { sound } from './utils/sound';
import { checkAgeVerified } from './utils/storage';
import { preloadImage, preloadBatch } from './utils/preload';
import './App.css';

export default function App() {
  // One-time Age Gate status (persisted in localStorage)
  const [isAgeVerified, setIsAgeVerified] = useState(checkAgeVerified);

  // Spiciness level mode
  const [selectedSpiciness, setSelectedSpiciness] = useState('spicy');

  // Rounds stepper
  const [rounds, setRounds] = useState(3);
  const [isMuted, setIsMuted] = useState(false);

  // Game state: 'idle' | 'mixing' | 'announcing' | 'revealing' | 'drawn' | 'finished'
  const [gameState, setGameState] = useState('idle');
  const [activeTotalRounds, setActiveTotalRounds] = useState(3);
  const [drawnBalls, setDrawnBalls] = useState([]);
  const [airTarget, setAirTarget] = useState(0);
  const [statusText, setStatusText] = useState('Set your rounds and spiciness, then start the machine.');
  const [btnText, setBtnText] = useState('Start the machine');

  // Currently floating / revealing ball
  const [activeFloatingBall, setActiveFloatingBall] = useState(null);

  // Position card dialog state (for inspecting balls in tray)
  const [revealedPosition, setRevealedPosition] = useState(null);
  const [revealedBallColor, setRevealedBallColor] = useState(null);

  const machineRef = useRef(null);
  const timer1Ref = useRef(null);
  const timer2Ref = useRef(null);
  const activeTotalRoundsRef = useRef(3);
  const drawnBallsRef = useRef([]);
  const pendingBallRef = useRef(null);

  // Compute filtered positions pool based on selected Spiciness level
  const currentSpicinessDef =
    SPICINESS_LEVELS.find((s) => s.id === selectedSpiciness) || SPICINESS_LEVELS[0];

  const availablePool = useMemo(() => {
    return positions.filter(currentSpicinessDef.filter);
  }, [currentSpicinessDef]);

  const maxRounds = Math.min(10, Math.max(1, availablePool.length));
  const effectiveRounds = Math.min(rounds, maxRounds);

  // Warm browser cache with an initial batch of position images from active pool
  useEffect(() => {
    if (availablePool.length > 0) {
      const initialBatch = availablePool.slice(0, 8).map((p) => p.image);
      preloadBatch(initialBatch);
    }
  }, [availablePool]);

  // Keep refs in sync with state
  useEffect(() => {
    drawnBallsRef.current = drawnBalls;
  }, [drawnBalls]);

  useEffect(() => {
    activeTotalRoundsRef.current = activeTotalRounds;
  }, [activeTotalRounds]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timer1Ref.current) clearTimeout(timer1Ref.current);
      if (timer2Ref.current) clearTimeout(timer2Ref.current);
      sound.stopMixing();
    };
  }, []);

  const isDrawing = gameState === 'mixing' || gameState === 'announcing' || gameState === 'revealing';
  const isInputsLocked = gameState !== 'idle';

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleDecreaseRounds = () => {
    if (isInputsLocked || effectiveRounds <= 1) return;
    setRounds(effectiveRounds - 1);
  };

  const handleIncreaseRounds = () => {
    if (isInputsLocked || effectiveRounds >= maxRounds) return;
    setRounds(effectiveRounds + 1);
  };

  const handleSelectSpiciness = (spicinessId) => {
    if (isInputsLocked) return;
    setSelectedSpiciness(spicinessId);
    const newDef = SPICINESS_LEVELS.find((s) => s.id === spicinessId) || SPICINESS_LEVELS[0];
    const newPool = positions.filter(newDef.filter);
    const newMax = Math.min(10, Math.max(1, newPool.length));
    if (rounds > newMax) {
      setRounds(newMax);
    }
  };

  const handleBallTap = (ball) => {
    const position = positions.find((p) => p.id === ball.positionId);
    if (position) {
      setRevealedPosition(position);
      setRevealedBallColor(ball.color);
    }
  };

  const handleCloseCard = useCallback(() => {
    setRevealedPosition(null);
    setRevealedBallColor(null);
  }, []);

  const handleStartOrDraw = () => {
    // If finished, action button is "Play again"
    if (gameState === 'finished') {
      sound.stopMixing();
      setDrawnBalls([]);
      drawnBallsRef.current = [];
      setActiveFloatingBall(null);
      setGameState('idle');
      setStatusText('Set your rounds and spiciness, then start the machine.');
      setBtnText('Start the machine');
      setAirTarget(0);
      return;
    }

    if (isDrawing) return;

    sound.init();

    if (gameState === 'idle') {
      const startRounds = Math.min(effectiveRounds, availablePool.length);
      setRounds(startRounds);
      setActiveTotalRounds(startRounds);
      activeTotalRoundsRef.current = startRounds;
      setDrawnBalls([]);
      drawnBallsRef.current = [];
    }

    // Pick the position immediately at t=0 so the card illustration preloads
    // during the 4.7s mixing and announcing animation sequence.
    const prevDrawn = drawnBallsRef.current;
    const drawnIds = new Set(prevDrawn.map((b) => b.positionId));
    const unpicked = availablePool.filter((p) => !drawnIds.has(p.id));
    const chosen =
      unpicked.length > 0
        ? unpicked[Math.floor(Math.random() * unpicked.length)]
        : availablePool[Math.floor(Math.random() * availablePool.length)];

    const color = BALL_COLORS[prevDrawn.length % BALL_COLORS.length];
    const newBall = {
      ...chosen,
      id: `${Date.now()}-${chosen.id}`,
      positionId: chosen.id,
      num: chosen.id,
      name: chosen.name,
      color,
      darkColor: darkenColor(color, 0.55),
    };
    pendingBallRef.current = newBall;

    // Trigger immediate background fetch & browser decode
    if (chosen?.image) {
      preloadImage(chosen.image);
    }

    // Step 1: Lock inputs and start mixing
    setGameState('mixing');
    setStatusText('Mixing the balls…');
    setAirTarget(1);
    sound.playMixing();

    // Step 2: At 3.2s -> airTarget = 0, status "And the number is…"
    timer1Ref.current = setTimeout(() => {
      setGameState('announcing');
      setAirTarget(0);
      setStatusText('And the number is…');
    }, 3200);

    // Step 3: At 4.7s -> trigger floating reveal ball
    timer2Ref.current = setTimeout(() => {
      const ballToReveal = pendingBallRef.current;
      if (!ballToReveal) return;

      // Physics: replace one random ball inside the machine
      machineRef.current?.removeAndReplaceBall();

      // Launch floating center reveal
      setGameState('revealing');
      setStatusText(`Ball #${ballToReveal.num} emerging! Tap to open!`);
      setActiveFloatingBall(ballToReveal);
    }, 4700);
  };

  // Called when the floating reveal sequence finishes and ball settles into tray
  const handleFloatingComplete = (completedBall) => {
    setActiveFloatingBall(null);

    const nextDrawn = [...drawnBallsRef.current, completedBall];
    setDrawnBalls(nextDrawn);
    drawnBallsRef.current = nextDrawn;

    const total = activeTotalRoundsRef.current;
    if (nextDrawn.length < total) {
      setStatusText(`Number ${completedBall.num}!`);
      setBtnText(`Draw ball ${nextDrawn.length + 1} of ${total}`);
      setGameState('drawn');
    } else {
      const roundWord = total === 1 ? 'round' : 'rounds';
      setStatusText(`Number ${completedBall.num}! That's all ${total} ${roundWord}.`);
      setBtnText('Play again');
      setGameState('finished');
    }
  };

  return (
    <>
      {/* One-time Age Gate on first visit */}
      {!isAgeVerified && (
        <AgeGate onVerified={() => setIsAgeVerified(true)} />
      )}

      <main className="app-wrapper">
        {/* 1. Header (Title + Subtitle + Sound Toggle) */}
        <Header isMuted={isMuted} onToggleSound={handleToggleSound} />

        {/* 2. The Machine Stage (Canvas Sphere + Chute) */}
        <MachineStage ref={machineRef} airTarget={airTarget} />

        {/* 3. Status Line */}
        <StatusLine message={statusText} />

        {/* 4. Rounded Settings Panel */}
        <SettingsPanel
          rounds={effectiveRounds}
          maxRounds={maxRounds}
          spicinessLevels={SPICINESS_LEVELS}
          selectedSpiciness={selectedSpiciness}
          poolCount={availablePool.length}
          isInputsLocked={isInputsLocked}
          isDrawing={isDrawing}
          btnText={btnText}
          onDecreaseRounds={handleDecreaseRounds}
          onIncreaseRounds={handleIncreaseRounds}
          onSelectSpiciness={handleSelectSpiciness}
          onStartOrDraw={handleStartOrDraw}
        />

        {/* 5. Drawn Balls Tray */}
        <BallTray drawnBalls={drawnBalls} onBallTap={handleBallTap} />

        {/* 6. Hint Line */}
        <HintLine isVisible={gameState === 'finished'} />

        {/* 7. Full Pokémon-style Floating Reveal Ball (Pokeball Split + Holo Card Flip) */}
        {activeFloatingBall && (
          <FloatingRevealBall
            ballData={activeFloatingBall}
            onComplete={handleFloatingComplete}
          />
        )}

        {/* 8. Position Reveal Dialog (When tapping existing balls in tray) */}
        <PositionCard
          position={revealedPosition}
          ballColor={revealedBallColor}
          onClose={handleCloseCard}
        />
      </main>
    </>
  );
}
