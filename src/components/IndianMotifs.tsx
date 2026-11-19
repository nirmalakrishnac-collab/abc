interface LotusDividerProps {
  className?: string;
  tone?: 'gold' | 'ivory';
}

/**
 * Refined hairline lotus crest inspired by classical Indian hospitality architecture.
 */
export function LotusDivider({ className = '', tone = 'gold' }: LotusDividerProps) {
  const strokeColor = tone === 'ivory' ? '#E6C682' : '#9B7230';
  const lineColor = tone === 'ivory' ? 'rgba(230, 198, 130, 0.3)' : 'rgba(155, 114, 48, 0.28)';

  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px flex-1" style={{ backgroundColor: lineColor }} />
      <svg
        width="34"
        height="18"
        viewBox="0 0 34 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M17 2C14.5 6.5 14.5 11.5 17 15C19.5 11.5 19.5 6.5 17 2Z"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 15C12.5 14.5 9.5 11.5 9 6.5C12.5 7 15 9.8 17 15Z"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 15C21.5 14.5 24.5 11.5 25 6.5C21.5 7 19 9.8 17 15Z"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 15.5C8 15.5 11.5 15.5 17 15.5C22.5 15.5 26 15.5 30 15.5"
          stroke={strokeColor}
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <span className="h-px flex-1" style={{ backgroundColor: lineColor }} />
    </div>
  );
}
