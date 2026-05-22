/**
 * Animated chairlift gliding across the top of the screen.
 * Pure CSS — diagonal cable, two pylons, two chairs traveling left→right.
 */
export function Chairlift() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 overflow-hidden" aria-hidden="true">
      {/* Cable: diagonal line from bottom-left to top-right */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
      >
        {/* Pylons */}
        <line x1="80" y1="80" x2="80" y2="20" stroke="currentColor" strokeWidth="3" className="text-foreground/40" />
        <line x1="920" y1="80" x2="920" y2="20" stroke="currentColor" strokeWidth="3" className="text-foreground/40" />
        {/* Pylon caps */}
        <circle cx="80" cy="20" r="4" fill="currentColor" className="text-foreground/40" />
        <circle cx="920" cy="20" r="4" fill="currentColor" className="text-foreground/40" />
        {/* Cable */}
        <line
          x1="80"
          y1="20"
          x2="920"
          y2="20"
          stroke="currentColor"
          strokeWidth="2"
          className="text-foreground/60"
        />
      </svg>

      {/* Chairs riding the cable */}
      <div className="chairlift-track absolute inset-0">
        <div className="chairlift-chair" style={{ animationDelay: "0s" }}>
          <Chair />
        </div>
        <div className="chairlift-chair" style={{ animationDelay: "-9s" }}>
          <Chair />
        </div>
        <div className="chairlift-chair" style={{ animationDelay: "-18s" }}>
          <Chair />
        </div>
      </div>

      <style>{`
        .chairlift-chair {
          position: absolute;
          top: 18px;
          left: -40px;
          width: 28px;
          height: 32px;
          animation: chairlift-glide 27s linear infinite;
        }
        @keyframes chairlift-glide {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(100vw + 80px)); }
        }
      `}</style>
    </div>
  );
}

function Chair() {
  return (
    <svg viewBox="0 0 28 32" width="28" height="32" aria-hidden="true">
      {/* Hanger arm */}
      <line x1="14" y1="0" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" className="text-foreground/70" />
      {/* Seat — pink */}
      <rect x="4" y="14" width="20" height="3" rx="1" fill="var(--color-primary)" />
      {/* Backrest */}
      <rect x="20" y="6" width="3" height="11" rx="1" fill="var(--color-primary)" />
      {/* Footrest / leg */}
      <line x1="6" y1="17" x2="6" y2="24" stroke="var(--color-primary)" strokeWidth="2" />
      <line x1="6" y1="24" x2="14" y2="24" stroke="var(--color-primary)" strokeWidth="2" />
    </svg>
  );
}
