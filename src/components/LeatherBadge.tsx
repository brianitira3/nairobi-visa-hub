export default function LeatherBadge() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-35">
      <svg
        width="350"
        height="350"
        viewBox="0 0 350 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform rotate-12"
      >
        {/* Outer circular seal - leather background */}
        <circle
          cx="175"
          cy="150"
          r="130"
          fill="#8B4513"
          stroke="#5D3A1A"
          strokeWidth="4"
        />
        
        {/* Inner leather texture ring */}
        <circle
          cx="175"
          cy="150"
          r="115"
          fill="#A0522D"
          opacity="0.5"
        />
        
        {/* Outer stitching - dashed border */}
        <circle
          cx="175"
          cy="150"
          r="125"
          stroke="#D2691E"
          strokeWidth="2.5"
          strokeDasharray="10 5"
          fill="none"
        />
        
        {/* Inner stitching */}
        <circle
          cx="175"
          cy="150"
          r="110"
          stroke="#D2691E"
          strokeWidth="2"
          strokeDasharray="8 4"
          fill="none"
          opacity="0.7"
        />
        
        {/* Inner circle */}
        <circle
          cx="175"
          cy="150"
          r="95"
          fill="#8B4513"
          stroke="#5D3A1A"
          strokeWidth="2"
        />
        
        {/* Globe icon */}
        <circle
          cx="175"
          cy="130"
          r="35"
          fill="#2D1A0A"
          stroke="#6B3513"
          strokeWidth="2"
        />
        
        {/* Globe lines */}
        <ellipse
          cx="175"
          cy="130"
          rx="35"
          ry="12"
          fill="none"
          stroke="#6B3513"
          strokeWidth="1.5"
        />
        <ellipse
          cx="175"
          cy="130"
          rx="12"
          ry="35"
          fill="none"
          stroke="#6B3513"
          strokeWidth="1.5"
        />
        <line
          x1="175"
          y1="95"
          x2="175"
          y2="165"
          stroke="#6B3513"
          strokeWidth="1.5"
        />
        <line
          x1="140"
          y1="130"
          x2="210"
          y2="130"
          stroke="#6B3513"
          strokeWidth="1.5"
        />
        
        {/* Text */}
        <text
          x="175"
          y="195"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="18"
          fontWeight="bold"
          fill="#0a0503"
          letterSpacing="3"
        >
          WORK
        </text>
        <text
          x="175"
          y="220"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="18"
          fontWeight="bold"
          fill="#0a0503"
          letterSpacing="3"
        >
          ABROAD
        </text>
        
        {/* Ribbon banner */}
        <path
          d="M50 260 L175 240 L300 260 L300 290 L175 270 L50 290 Z"
          fill="#8B4513"
          stroke="#5D3A1A"
          strokeWidth="2"
        />
        
        {/* Ribbon stitching */}
        <path
          d="M55 265 L175 246 L295 265"
          stroke="#D2691E"
          strokeWidth="1.5"
          strokeDasharray="6 3"
          fill="none"
        />
        <path
          d="M55 285 L175 266 L295 285"
          stroke="#D2691E"
          strokeWidth="1.5"
          strokeDasharray="6 3"
          fill="none"
        />
        
        {/* Ribbon text */}
        <text
          x="175"
          y="275"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="14"
          fontWeight="bold"
          fill="#0a0503"
          letterSpacing="2"
        >
          INTERNATIONAL JOBS
        </text>
        
        {/* Decorative stitch points */}
        <circle cx="175" cy="20" r="3" fill="#D2691E" />
        <circle cx="305" cy="150" r="3" fill="#D2691E" />
        <circle cx="175" cy="280" r="3" fill="#D2691E" />
        <circle cx="45" cy="150" r="3" fill="#D2691E" />
      </svg>
    </div>
  );
}
