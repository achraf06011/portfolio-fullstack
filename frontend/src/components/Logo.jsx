export default function Logo({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a89cff" />
          <stop offset="100%" stopColor="#6c63ff" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer diamond ring */}
      <path
        d="M19 1 L37 19 L19 37 L1 19 Z"
        stroke="url(#logoGrad)"
        strokeWidth="1.2"
        fill="none"
        filter="url(#logoGlow)"
      />

      {/* First A — left */}
      <path
        d="M10 30 L16 10 M16 10 L19 18 M12.2 23 L17.8 23"
        stroke="url(#logoGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logoGlow)"
      />

      {/* Second A — right */}
      <path
        d="M19 18 L22 10 M22 10 L28 30 M20.2 23 L25.8 23"
        stroke="url(#logoGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logoGlow)"
      />
    </svg>
  )
}
