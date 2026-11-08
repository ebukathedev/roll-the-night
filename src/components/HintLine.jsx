export default function HintLine({ isVisible }) {
  if (!isVisible) {
    return null;
  }

  return (
    <p className="hint-line">
      Tap a ball to reveal its position.
    </p>
  );
}

