import Link from "next/link";

export function HadidMark({ className = "brand-mark-svg" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 61.48 21.49 C 61.79 7.96, 80.84 3.28, 86.22 16.55 C 87.66 20.11, 86.95 21.06, 86.82 24.46 C 86.20 40.82, 88.15 57.47, 87.28 73.91 C 86.93 80.56, 86.82 88.01, 80.12 91.47 C 72.86 95.23, 63.92 91.94, 61.79 83.86 C 60.74 79.90, 62.34 81.31, 65.04 80.11 C 72.30 76.90, 74.26 66.93, 66.78 62.68 C 61.18 59.51, 56.47 64.21, 50.69 63.02 C 36.65 60.12, 39.79 36.55, 55.56 39.55 C 57.90 40.00, 60.21 41.23, 62.65 41.21 C 66.35 41.17, 70.53 37.87, 71.55 34.34 C 73.58 27.39, 67.78 22.47, 61.48 21.49 Z"
        fill="currentColor"
      />
      <path
        d="M 25.55 8.22 C 32.19 8.02, 38.01 13.25, 38.49 19.88 C 38.57 21.03, 38.60 23.05, 38.10 24.08 C 37.54 25.23, 33.76 27.38, 32.47 28.51 C 21.12 38.47, 19.61 54.34, 27.46 66.99 C 29.10 69.63, 32.89 74.34, 35.32 76.20 C 36.66 77.22, 37.79 76.86, 38.03 78.74 C 39.45 89.92, 25.62 96.72, 16.74 89.53 C 11.85 85.58, 12.86 82.08, 12.91 76.54 C 13.04 61.87, 11.90 47.19, 12.23 32.55 C 12.46 22.65, 12.07 8.64, 25.55 8.22 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand-logo" href="/" aria-label="Hadid Creatives home">
      <span className="brand-mark" aria-hidden="true">
        <HadidMark />
      </span>
      {!compact && (
        <span className="brand-wordmark">
          <strong>HADID</strong>
          <span>CREATIVES</span>
        </span>
      )}
    </Link>
  );
}
