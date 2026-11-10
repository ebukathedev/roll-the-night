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
  Footer,
} from './components';
import positions from './data/positions';
import { SPICINESS_LEVELS } from './constants/spiciness';
import { VIBE_PRESETS, buildVibeFilter } from './constants/vibes';
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

  // Vibe / focus preset
  const [selectedVibe, setSelectedVibe] = useState('our-night');

  // Category exclusion set
  const [excludedCategories, setExcludedCategories] = useState(new Set());

  // Oral sub-filter
  const [oralSubtype, setOralSubtype] = useState('all-oral');

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

  // Compute filtered positions pool: Spiciness → Vibe (categories + oral sub-filter)
  const currentSpicinessDef =
    SPICINESS_LEVELS.find((s) => s.id === selectedSpiciness) || SPICINESS_LEVELS[0];

  const vibeFilter = useMemo(
    () => buildVibeFilter(excludedCategories, oralSubtype),
    [excludedCategories, oralSubtype],
  );

  const availablePool = useMemo(() => {
    return positions.filter((p) => currentSpicinessDef.filter(p) && vibeFilter(p));
  }, [currentSpicinessDef, vibeFilter]);

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

  // Clamp rounds to new pool size after any filter change
  const clampRoundsToPool = (pool) => {
    const newMax = Math.min(10, Math.max(1, pool.length));
    if (rounds > newMax) {
      setRounds(newMax);
    }
  };

  const handleSelectSpiciness = (spicinessId) => {
    if (isInputsLocked) return;
    setSelectedSpiciness(spicinessId);
    const newDef = SPICINESS_LEVELS.find((s) => s.id === spicinessId) || SPICINESS_LEVELS[0];
    const newPool = positions.filter((p) => newDef.filter(p) && vibeFilter(p));
    clampRoundsToPool(newPool);
  };

  const handleSelectVibe = (vibeId) => {
    if (isInputsLocked) return;
    setSelectedVibe(vibeId);

    const preset = VIBE_PRESETS.find((v) => v.id === vibeId);
    if (!preset) return;

    // Apply the preset's defaults for excluded categories and oral sub-type
    const newExcluded = new Set(preset.excludedCategories);
    setExcludedCategories(newExcluded);
    setOralSubtype(preset.oralSubtype);

    // Re-compute pool and clamp
    const newVibeFilter = buildVibeFilter(newExcluded, preset.oralSubtype);
    const newPool = positions.filter((p) => currentSpicinessDef.filter(p) && newVibeFilter(p));
    clampRoundsToPool(newPool);
  };

  const handleToggleCategory = (category) => {
    if (isInputsLocked) return;

    // Switch to "custom" vibe when user manually changes categories
    if (selectedVibe !== 'custom') {
      setSelectedVibe('custom');
    }

    setExcludedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }

      // Clamp rounds after update
      const newVibeFilter = buildVibeFilter(next, oralSubtype);
      const newPool = positions.filter((p) => currentSpicinessDef.filter(p) && newVibeFilter(p));
      const newMax = Math.min(10, Math.max(1, newPool.length));
      if (rounds > newMax) {
        setRounds(newMax);
      }

      return next;
    });
  };

  const handleSelectOralSubtype = (subtypeId) => {
    if (isInputsLocked) return;

    // Switch to "custom" vibe when user manually tweaks oral filter
    if (selectedVibe !== 'custom') {
      setSelectedVibe('custom');
    }

    setOralSubtype(subtypeId);

    // Clamp rounds after update
    const newVibeFilter = buildVibeFilter(excludedCategories, subtypeId);
    const newPool = positions.filter((p) => currentSpicinessDef.filter(p) && newVibeFilter(p));
    clampRoundsToPool(newPool);
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
    if (availablePool.length === 0) return;

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
          vibePresets={VIBE_PRESETS}
          selectedVibe={selectedVibe}
          onSelectVibe={handleSelectVibe}
          excludedCategories={excludedCategories}
          onToggleCategory={handleToggleCategory}
          oralSubtype={oralSubtype}
          onSelectOralSubtype={handleSelectOralSubtype}
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

        {/* 9. Semantic SEO Footer & Disclosures */}
        <Footer />
      </main>
    </>
  );
}
