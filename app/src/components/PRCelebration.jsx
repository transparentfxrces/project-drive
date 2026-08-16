export default function PRCelebration({
  pr,
  onClose,
}) {
  if (!pr) return null;

  return (
    <div
      className="pr-overlay"
      onClick={onClose}
    >
      <div
        className="pr-system-card"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="pr-scan-line" />

        <button
          type="button"
          className="pr-close"
          onClick={onClose}
          aria-label="Close PR celebration"
        >
          ×
        </button>

        <span className="pr-system-label">
          SYSTEM ACHIEVEMENT
        </span>

        <div className="pr-icon">
          🏆
        </div>

        <p className="pr-unlocked">
          PERSONAL RECORD UNLOCKED
        </p>

        <h2>{pr.exercise}</h2>

        <div className="pr-record">
          {pr.newRecord}
          <span> LB</span>
        </div>

        {pr.improvement !== null &&
          pr.improvement > 0 && (
            <div className="pr-improvement">
              ▲ +{pr.improvement} LB
            </div>
          )}

        <div className="pr-divider" />

        {pr.previous > 0 ? (
          <div className="pr-comparison">
            <div>
              <span>PREVIOUS</span>
              <strong>
                {pr.previous} LB
              </strong>
            </div>

            <div className="pr-arrow">
              →
            </div>

            <div>
              <span>NEW RECORD</span>
              <strong>
                {pr.newRecord} LB
              </strong>
            </div>
          </div>
        ) : (
          <p className="pr-first-record">
            First recorded max established.
          </p>
        )}

        <div className="pr-divider" />

        <p className="pr-synced">
          PERFORMANCE DATA SYNCHRONIZED
        </p>

        <button
          type="button"
          className="pr-continue"
          onClick={onClose}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}