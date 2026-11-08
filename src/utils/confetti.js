/**
 * Lightweight Zero-Dependency Confetti Burst
 * Creates celebratory fluttering particles across the screen.
 */

export function fireConfetti(originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const COLORS = ['#ff3d81', '#ffc83d', '#2ec4b6', '#7b5cff', '#ff7a3d', '#ffffff', '#ffd166'];
  const NUM_PARTICLES = 110;

  const particles = [];
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 6;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed * (Math.random() * 0.7 + 0.3),
      vy: Math.sin(angle) * speed * (Math.random() * 0.7 + 0.3) - 3,
      size: Math.random() * 9 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      tilt: Math.random() * Math.PI,
      tiltSpeed: Math.random() * 0.12 + 0.05,
      opacity: 1,
      gravity: 0.28,
      drag: 0.96,
      isCircle: Math.random() > 0.65,
    });
  }

  let startTime = null;
  const DURATION = 2600;

  function render(time) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    const progress = elapsed / DURATION;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;

      p.rotation += p.rotationSpeed;
      p.tilt += p.tiltSpeed;
      p.opacity = Math.max(0, 1 - progress);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(p.tilt), 1);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;

      if (p.isCircle) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
      }

      ctx.restore();
    }

    if (progress < 1) {
      requestAnimationFrame(render);
    } else {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  requestAnimationFrame(render);
}

