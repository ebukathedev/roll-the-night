export default function StatusLine({ message }) {
  return (
    <div className="status-line" role="status" aria-live="polite">
      {message}
    </div>
  );
}

