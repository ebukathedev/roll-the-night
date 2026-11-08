/**
 * Minimalist silhouette illustrations for each position category.
 * Abstract two-figure art — tasteful, simple, recognisable.
 */

export default function PositionIllustration({ category, color = '#ff3d81' }) {
  const softColor = color;
  const faded = `${color}44`;
  const glow = `${color}22`;

  const svgProps = {
    viewBox: '0 0 200 140',
    className: 'position-illustration',
    'aria-hidden': 'true',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  };

  switch (category) {
    case 'Classic':
      return (
        <svg {...svgProps}>
          <ellipse cx="100" cy="130" rx="88" ry="8" fill={glow} />
          {/* Bottom figure — lying flat */}
          <ellipse cx="100" cy="108" rx="58" ry="14" fill={faded} rx="12" />
          <circle cx="40" cy="104" r="12" fill={softColor} opacity="0.6" />
          {/* Top figure — lying on top, slightly offset */}
          <ellipse cx="105" cy="92" rx="50" ry="12" fill={softColor} opacity="0.55" />
          <circle cx="52" cy="86" r="11" fill={softColor} opacity="0.85" />
          {/* Warmth glow */}
          <ellipse cx="80" cy="96" rx="30" ry="20" fill={glow} />
        </svg>
      );

    case 'Face to Face':
      return (
        <svg {...svgProps}>
          <ellipse cx="100" cy="132" rx="60" ry="6" fill={glow} />
          {/* Left figure */}
          <ellipse cx="78" cy="100" rx="22" ry="32" fill={faded} />
          <circle cx="78" cy="60" r="14" fill={softColor} opacity="0.7" />
          {/* Right figure */}
          <ellipse cx="122" cy="100" rx="22" ry="32" fill={softColor} opacity="0.45" />
          <circle cx="122" cy="60" r="14" fill={softColor} opacity="0.85" />
          {/* Connection glow */}
          <ellipse cx="100" cy="85" rx="18" ry="28" fill={glow} />
        </svg>
      );

    case 'From Behind':
      return (
        <svg {...svgProps}>
          <ellipse cx="100" cy="132" rx="70" ry="6" fill={glow} />
          {/* Front figure — leaning forward */}
          <ellipse cx="72" cy="96" rx="18" ry="36" fill={faded} transform="rotate(-12 72 96)" />
          <circle cx="58" cy="58" r="13" fill={softColor} opacity="0.7" />
          {/* Back figure — upright behind */}
          <ellipse cx="116" cy="92" rx="20" ry="38" fill={softColor} opacity="0.5" />
          <circle cx="116" cy="48" r="13" fill={softColor} opacity="0.85" />
          {/* Glow */}
          <ellipse cx="94" cy="90" rx="16" ry="22" fill={glow} />
        </svg>
      );

    case 'Side by Side':
      return (
        <svg {...svgProps}>
          <ellipse cx="100" cy="130" rx="88" ry="6" fill={glow} />
          {/* Two figures lying side by side */}
          <ellipse cx="100" cy="112" rx="62" ry="13" fill={faded} />
          <ellipse cx="100" cy="98" rx="56" ry="11" fill={softColor} opacity="0.4" />
          <circle cx="34" cy="108" r="12" fill={softColor} opacity="0.65" />
          <circle cx="38" cy="94" r="11" fill={softColor} opacity="0.85" />
          {/* Warmth */}
          <ellipse cx="80" cy="104" rx="28" ry="14" fill={glow} />
        </svg>
      );

    case 'Sitting':
      return (
        <svg {...svgProps}>
          <ellipse cx="100" cy="132" rx="50" ry="6" fill={glow} />
          {/* Seat shape */}
          <rect x="72" y="100" width="56" height="30" rx="8" fill={faded} opacity="0.5" />
          {/* Seated figure */}
          <ellipse cx="100" cy="88" rx="20" ry="30" fill={faded} />
          <circle cx="100" cy="52" r="13" fill={softColor} opacity="0.65" />
          {/* Lap figure */}
          <ellipse cx="100" cy="78" rx="16" ry="24" fill={softColor} opacity="0.5" />
          <circle cx="100" cy="44" r="12" fill={softColor} opacity="0.9" />
          {/* Glow */}
          <ellipse cx="100" cy="72" rx="20" ry="18" fill={glow} />
        </svg>
      );

    case 'Standing':
      return (
        <svg {...svgProps}>
          <ellipse cx="100" cy="134" rx="40" ry="5" fill={glow} />
          {/* Figure 1 — standing */}
          <ellipse cx="88" cy="88" rx="16" ry="44" fill={faded} />
          <circle cx="88" cy="36" r="14" fill={softColor} opacity="0.65" />
          {/* Figure 2 — standing close */}
          <ellipse cx="112" cy="86" rx="16" ry="46" fill={softColor} opacity="0.45" />
          <circle cx="112" cy="32" r="14" fill={softColor} opacity="0.9" />
          {/* Connection glow */}
          <ellipse cx="100" cy="76" rx="14" ry="30" fill={glow} />
        </svg>
      );

    case 'Kneeling':
      return (
        <svg {...svgProps}>
          <ellipse cx="100" cy="132" rx="60" ry="6" fill={glow} />
          {/* Two kneeling figures, upright, close together */}
          <ellipse cx="84" cy="100" rx="18" ry="30" fill={faded} />
          <circle cx="84" cy="62" r="13" fill={softColor} opacity="0.65" />
          <ellipse cx="116" cy="98" rx="18" ry="32" fill={softColor} opacity="0.45" />
          <circle cx="116" cy="58" r="13" fill={softColor} opacity="0.9" />
          {/* Arms embrace */}
          <path d="M94 78 Q100 68 106 78" stroke={softColor} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          <ellipse cx="100" cy="88" rx="16" ry="18" fill={glow} />
        </svg>
      );

    case 'Edge & Furniture':
      return (
        <svg {...svgProps}>
          <ellipse cx="100" cy="134" rx="72" ry="5" fill={glow} />
          {/* Furniture edge */}
          <rect x="36" y="90" width="60" height="40" rx="6" fill={faded} opacity="0.45" />
          {/* Seated/edge figure */}
          <ellipse cx="72" cy="78" rx="18" ry="28" fill={faded} />
          <circle cx="72" cy="44" r="13" fill={softColor} opacity="0.7" />
          {/* Standing figure */}
          <ellipse cx="112" cy="82" rx="16" ry="42" fill={softColor} opacity="0.48" />
          <circle cx="112" cy="34" r="13" fill={softColor} opacity="0.9" />
          <ellipse cx="92" cy="76" rx="14" ry="18" fill={glow} />
        </svg>
      );

    case 'Adventurous':
      return (
        <svg {...svgProps}>
          <ellipse cx="100" cy="134" rx="66" ry="5" fill={glow} />
          {/* Dynamic figure 1 — arched / inverted */}
          <path
            d="M50 100 Q70 44 100 60"
            stroke={softColor}
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.55"
          />
          <circle cx="48" cy="104" r="13" fill={softColor} opacity="0.7" />
          {/* Dynamic figure 2 — standing/supporting */}
          <ellipse cx="120" cy="82" rx="16" ry="42" fill={softColor} opacity="0.45" />
          <circle cx="120" cy="34" r="14" fill={softColor} opacity="0.9" />
          <ellipse cx="96" cy="78" rx="20" ry="20" fill={glow} />
        </svg>
      );

    case 'Oral':
      return (
        <svg {...svgProps}>
          <ellipse cx="100" cy="130" rx="80" ry="6" fill={glow} />
          {/* Two figures head-to-toe */}
          <ellipse cx="96" cy="110" rx="54" ry="13" fill={faded} />
          <circle cx="38" cy="106" r="12" fill={softColor} opacity="0.7" />
          <ellipse cx="104" cy="94" rx="50" ry="12" fill={softColor} opacity="0.4" transform="rotate(180 104 94)" />
          <circle cx="156" cy="94" r="11" fill={softColor} opacity="0.9" />
          <ellipse cx="100" cy="102" rx="24" ry="14" fill={glow} />
        </svg>
      );

    default:
      return (
        <svg {...svgProps}>
          <ellipse cx="100" cy="132" rx="50" ry="6" fill={glow} />
          <ellipse cx="100" cy="90" rx="28" ry="38" fill={faded} />
          <circle cx="90" cy="46" r="13" fill={softColor} opacity="0.7" />
          <circle cx="110" cy="42" r="13" fill={softColor} opacity="0.9" />
          <ellipse cx="100" cy="78" rx="18" ry="22" fill={glow} />
        </svg>
      );
  }
}

