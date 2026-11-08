import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { BALL_COLORS, darkenColor } from '../utils/colors';

const BallMachine = forwardRef(function BallMachine({ airTarget }, ref) {
  const canvasRef = useRef(null);
  const ballsRef = useRef([]);
  const airRef = useRef(0);
  const airTargetRef = useRef(airTarget);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    airTargetRef.current = airTarget;
  }, [airTarget]);

  useImperativeHandle(ref, () => ({
    removeAndReplaceBall: () => {
      if (ballsRef.current.length > 0) {
        const removeIdx = Math.floor(Math.random() * ballsRef.current.length);
        ballsRef.current.splice(removeIdx, 1);

        // Add a fresh replacement ball near the upper area
        const color = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
        const num = Math.floor(Math.random() * 99) + 1;
        const newBall = {
          x: 340 + (Math.random() - 0.5) * 80,
          y: 180 + (Math.random() - 0.5) * 60,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 2,
          radius: 36,
          color,
          darkColor: darkenColor(color, 0.55),
          num,
        };
        ballsRef.current.push(newBall);
      }
    },
  }));

  useEffect(() => {
    // Initialize 20 balls in settled distribution inside the sphere
    const initialBalls = [];
    const rows = [4, 5, 5, 4, 2];
    let index = 0;

    for (let r = 0; r < rows.length; r++) {
      const countInRow = rows[r];
      const y = 350 + r * 46;
      const startX = 340 - ((countInRow - 1) * 64) / 2;
      for (let c = 0; c < countInRow; c++) {
        const x = startX + c * 64;
        const color = BALL_COLORS[index % BALL_COLORS.length];
        initialBalls.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: 36,
          color,
          darkColor: darkenColor(color, 0.55),
          num: Math.floor(Math.random() * 99) + 1,
        });
        index++;
      }
    }
    ballsRef.current = initialBalls;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const cx = 340;
    const cy = 340;
    const sphereRadius = 340 - 10; // 330
    const ballRadius = 36;
    const maxDist = sphereRadius - ballRadius; // 294

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      // Air easing: eases toward airTarget by 6% per frame
      const currentAirTarget = airTargetRef.current;
      airRef.current += (currentAirTarget - airRef.current) * 0.06;
      const air = airRef.current;

      const balls = ballsRef.current;

      // Physics update per ball
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];

        // Gravity: vy += 0.35 * (1 - air)
        b.vy += 0.35 * (1 - air);

        // Air agitation
        if (air > 0.02) {
          b.vy -= air * (Math.random() * (1.3 - 0.2) + 0.2);
          b.vx += (Math.random() - 0.5) * air * 3;
          b.vy += (Math.random() - 0.5) * air * 2;
        }

        // Damping: multiply vx and vy by 0.992
        b.vx *= 0.992;
        b.vy *= 0.992;

        // Cap speed at 16
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > 16) {
          b.vx = (b.vx / speed) * 16;
          b.vy = (b.vy / speed) * 16;
        }

        // Move by velocity
        b.x += b.vx;
        b.y += b.vy;

        // Wall collision against the circle
        const dx = b.x - cx;
        const dy = b.y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > maxDist) {
          const nx = dx / dist;
          const ny = dy / dist;
          b.x = cx + nx * maxDist;
          b.y = cy + ny * maxDist;

          const vn = b.vx * nx + b.vy * ny;
          if (vn > 0) {
            b.vx -= 1.7 * vn * nx;
            b.vy -= 1.7 * vn * ny;
          }
        }
      }

      // Ball-to-ball collisions: separate overlapping pairs and exchange velocity along collision normal
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const b1 = balls[i];
          const b2 = balls[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = b1.radius + b2.radius; // 72

          if (dist < minDist && dist > 0.0001) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;

            // Separate overlapping pairs
            b1.x -= nx * overlap * 0.5;
            b1.y -= ny * overlap * 0.5;
            b2.x += nx * overlap * 0.5;
            b2.y += ny * overlap * 0.5;

            // Velocity exchange along collision normal
            const kx = b1.vx - b2.vx;
            const ky = b1.vy - b2.vy;
            const p = nx * kx + ny * ky;
            if (p > 0) {
              b1.vx -= p * nx;
              b1.vy -= p * ny;
              b2.vx += p * nx;
              b2.vy += p * ny;
            }
          }
        }
      }

      // Ensure balls stay within circular boundary after separation
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        const dx = b.x - cx;
        const dy = b.y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > maxDist) {
          const nx = dx / dist;
          const ny = dy / dist;
          b.x = cx + nx * maxDist;
          b.y = cy + ny * maxDist;
        }
      }

      // --- RENDERING ---
      ctx.clearRect(0, 0, 680, 680);

      // Glass sphere backdrop
      const sphereBgGrad = ctx.createRadialGradient(cx, cy - 60, 40, cx, cy, sphereRadius);
      sphereBgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.07)');
      sphereBgGrad.addColorStop(0.7, 'rgba(38, 24, 74, 0.25)');
      sphereBgGrad.addColorStop(1, 'rgba(10, 5, 25, 0.5)');

      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
      ctx.fillStyle = sphereBgGrad;
      ctx.fill();

      // Draw balls
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];

        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.clip();

        // Ball body gradient
        const ballGrad = ctx.createRadialGradient(
          b.x - 9,
          b.y - 9,
          3,
          b.x,
          b.y,
          b.radius
        );
        ballGrad.addColorStop(0, b.color);
        ballGrad.addColorStop(1, b.darkColor);
        ctx.fillStyle = ballGrad;
        ctx.fill();

        // Glossy radial highlight on ball
        const specGrad = ctx.createRadialGradient(
          b.x - 11,
          b.y - 11,
          1,
          b.x - 11,
          b.y - 11,
          22
        );
        specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.88)');
        specGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.25)');
        specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = specGrad;
        ctx.beginPath();
        ctx.arc(b.x - 11, b.y - 11, 22, 0, Math.PI * 2);
        ctx.fill();

        // Decorative number (1-99 in white Bungee 24px)
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px "Bungee", "Arial Black", Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 1;
        ctx.fillText(String(b.num), b.x, b.y + 2);

        ctx.restore();
      }

      // Glass sphere overlay reflections and highlight
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
      ctx.clip();

      // Soft radial highlight top-left
      const glassHighlight = ctx.createRadialGradient(
        cx - sphereRadius * 0.42,
        cy - sphereRadius * 0.42,
        15,
        cx,
        cy,
        sphereRadius
      );
      glassHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      glassHighlight.addColorStop(0.35, 'rgba(255, 255, 255, 0.1)');
      glassHighlight.addColorStop(0.75, 'rgba(255, 255, 255, 0.01)');
      glassHighlight.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
      ctx.fillStyle = glassHighlight;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner glass contour shine
      const innerArc = ctx.createRadialGradient(
        cx + sphereRadius * 0.3,
        cy + sphereRadius * 0.3,
        20,
        cx,
        cy,
        sphereRadius
      );
      innerArc.addColorStop(0.85, 'rgba(255, 255, 255, 0)');
      innerArc.addColorStop(1, 'rgba(255, 255, 255, 0.18)');
      ctx.fillStyle = innerArc;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 8px translucent white rim around the sphere
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius - 4, 0, Math.PI * 2);
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.stroke();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={680}
      height={680}
      className="machine-canvas"
      role="img"
      aria-label="Ball machine showing numbered balls swirling inside a glass sphere"
    />
  );
});

export default BallMachine;

