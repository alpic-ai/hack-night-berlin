import { cn } from "@alpic-ai/ui/lib/cn";

/**
 * Layered Alpine-style mountain silhouette using Alpic palette.
 * Position absolutely behind hero content. Use `dim` to fade behind UI.
 */
export function Mountains({ className, dim }: { className?: string; dim?: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 480"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 w-full select-none",
        dim && "opacity-60",
        className,
      )}
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-background)" />
          <stop offset="100%" stopColor="var(--color-muted)" />
        </linearGradient>
        <linearGradient id="back-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-muted)" />
          <stop offset="100%" stopColor="var(--color-muted)" />
        </linearGradient>
        <linearGradient id="mid-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-cta-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-cta-accent)" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="front-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Back range (lightest, neutral) */}
      <path
        fill="url(#back-mtn)"
        d="M0,320 L120,220 L220,280 L340,180 L460,260 L580,200 L700,260 L820,180 L940,250 L1060,200 L1200,260 L1200,480 L0,480 Z"
      />

      {/* Mid range (cyan accent) */}
      <path
        fill="url(#mid-mtn)"
        d="M0,360 L100,290 L200,340 L300,260 L420,330 L540,280 L660,340 L780,260 L900,330 L1020,290 L1120,340 L1200,310 L1200,480 L0,480 Z"
      />

      {/* Snow caps on mid range — bright spots */}
      <g fill="var(--color-background)" opacity="0.95">
        <polygon points="300,260 308,275 292,275" />
        <polygon points="540,280 548,295 532,295" />
        <polygon points="780,260 788,275 772,275" />
        <polygon points="1020,290 1028,305 1012,305" />
      </g>

      {/* Front range (Alpic pink) */}
      <path
        fill="url(#front-mtn)"
        d="M0,420 L80,370 L180,410 L280,340 L400,400 L520,360 L640,410 L760,340 L880,400 L1000,360 L1100,410 L1200,380 L1200,480 L0,480 Z"
      />

      {/* Snow caps on front range — bright white triangles to suggest peaks */}
      <g fill="var(--color-background)">
        <polygon points="280,340 290,360 270,360" />
        <polygon points="760,340 770,360 750,360" />
      </g>
    </svg>
  );
}

/**
 * Tiny inline mountain icon — use as a header accent in panels.
 */
export function MountainBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 20"
      aria-hidden="true"
      className={cn("inline-block", className)}
    >
      <path
        fill="currentColor"
        d="M0,20 L8,8 L14,14 L20,4 L26,12 L32,20 Z"
      />
      <polygon points="20,4 22,8 18,8" fill="var(--color-background)" />
    </svg>
  );
}

/**
 * Small drifting snowflakes layer for ambient motion.
 */
export function Snowflakes({ count = 12 }: { count?: number }) {
  const flakes = Array.from({ length: count }, (_, i) => {
    const left = (i * 83 + 17) % 100;
    const delay = (i * 0.7) % 6;
    const dur = 8 + ((i * 1.3) % 6);
    const size = 4 + (i % 3) * 2;
    return { left, delay, dur, size, key: i };
  });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.key}
          className="absolute -top-4 block rounded-full bg-cta-accent opacity-70"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animation: `snow ${f.dur}s linear ${f.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes snow {
          0%   { transform: translateY(-20px) translateX(0px); opacity: 0; }
          10%  { opacity: 0.7; }
          100% { transform: translateY(420px) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
