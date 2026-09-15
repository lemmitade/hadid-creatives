import { AnimatedBar } from "@/components/Motion";

export function AnalyticsPanel() {
  return (
    <div className="analytics-panel">
      <div className="analytics-head">
        <div>
          <span>LIVE RESULT SAMPLE</span>
          <strong>Audience growth</strong>
        </div>
        <span className="live-dot">VERIFIED</span>
      </div>
      <div className="chart-shell" aria-label="Audience growth visualization">
        <svg viewBox="0 0 720 260" role="img" aria-labelledby="chart-title">
          <title id="chart-title">Upward audience growth line</title>
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00AEF0" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#00AEF0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="chart-grid" d="M0 50H720M0 130H720M0 210H720" />
          <path
            className="chart-area"
            d="M0 218 C95 212 126 196 186 183 C260 167 300 184 352 143 C402 105 456 131 510 84 C563 39 617 69 720 14 L720 260 L0 260 Z"
          />
          <path
            className="chart-line"
            d="M0 218 C95 212 126 196 186 183 C260 167 300 184 352 143 C402 105 456 131 510 84 C563 39 617 69 720 14"
          />
          <circle cx="720" cy="14" r="7" fill="#A3E635" />
        </svg>
        <div className="chart-timecode">00:08:06:24</div>
      </div>
      <div className="analytics-bars">
        <div>
          <span>GM Furniture</span>
          <strong>3K → 30.8K</strong>
          <AnimatedBar width="92%" />
        </div>
        <div>
          <span>Habesha Brothers</span>
          <strong>19K → 108K</strong>
          <AnimatedBar width="78%" />
        </div>
        <div>
          <span>Worthy Homes</span>
          <strong>16.7K → 23.2K</strong>
          <AnimatedBar width="56%" />
        </div>
      </div>
    </div>
  );
}
