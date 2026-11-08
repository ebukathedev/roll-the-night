export default function BallTray({ drawnBalls, onBallTap }) {
  if (!drawnBalls || drawnBalls.length === 0) {
    return null;
  }

  return (
    <section className="tray" aria-label="Drawn position balls">
      {drawnBalls.map((ball) => (
        <button
          key={ball.id}
          type="button"
          className="tray-ball-link tray-drop-anim"
          onClick={() => onBallTap(ball)}
          aria-label={`Reveal position ${ball.num}`}
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
          <span className="tray-ball-caption">Tap to reveal</span>
        </button>
      ))}
    </section>
  );
}

