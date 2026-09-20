interface FluxoBrandProps {
  compact?: boolean;
  className?: string;
}

export default function FluxoBrand({ compact = false, className = "" }: FluxoBrandProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="Fluxo">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="h-9 w-9 shrink-0 text-accent"
        aria-hidden="true"
      >
        <path
          d="M36 8H19C13.477 8 9 12.477 9 18s4.477 10 10 10h10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          d="M29 20H19c-5.523 0-10 4.477-10 10v10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          d="m31 23 5 5-5 5M14 35l-5 5-5-5"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      </svg>
      {!compact && <span className="text-2xl font-bold leading-none">Fluxo</span>}
    </div>
  );
}
