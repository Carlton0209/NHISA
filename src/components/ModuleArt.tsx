/** Small interface previews for each module, drawn in the card's ink colour. */
export default function ModuleArt({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" fill="none" aria-hidden="true">
      {ART[id] ?? null}
    </svg>
  );
}

const ink = 'currentColor';

const ART: Record<string, JSX.Element> = {
  // A list of resources grouped under four campus topics.
  campus: (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(14 ${14 + i * 32})`}>
          <rect width="212" height="24" rx="8" fill={ink} opacity="0.08" />
          <circle cx="14" cy="12" r="6" fill={ink} opacity={0.5 - i * 0.08} />
          <rect x="28" y="7" width={110 - i * 14} height="4" rx="2" fill={ink} opacity="0.55" />
          <rect x="28" y="14" width={150 - i * 20} height="3" rx="1.5" fill={ink} opacity="0.25" />
        </g>
      ))}
    </g>
  ),
  // Six ascending steps, from Explore to Networking.
  'career-hub': (
    <g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x={14 + i * 36} y={120 - i * 18} width="30" height={16 + i * 18} rx="6" fill={ink} opacity={0.12 + i * 0.08} />
          <text x={29 + i * 36} y={114 - i * 18} textAnchor="middle" fontSize="11" fontWeight="700" fill={ink} opacity="0.7">
            {i + 1}
          </text>
        </g>
      ))}
    </g>
  ),
  // Search bar, filter chips and result rows.
  'career-access': (
    <g>
      <rect x="14" y="12" width="212" height="24" rx="12" fill={ink} opacity="0.1" />
      <circle cx="30" cy="24" r="5" stroke={ink} strokeWidth="2" opacity="0.6" />
      <rect x="42" y="22" width="70" height="4" rx="2" fill={ink} opacity="0.35" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={14 + i * 58} y="44" width="50" height="14" rx="7" fill={ink} opacity={i === 0 ? 0.55 : 0.15} />
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(14 ${68 + i * 26})`}>
          <rect width="212" height="20" rx="6" fill={ink} opacity="0.07" />
          <rect x="10" y="6" width="64" height="4" rx="2" fill={ink} opacity="0.55" />
          <rect x="10" y="12" width="120" height="3" rx="1.5" fill={ink} opacity="0.25" />
          <rect x="170" y="6" width="32" height="8" rx="4" fill={ink} opacity="0.2" />
        </g>
      ))}
    </g>
  ),
  // A wall of portraits.
  alumni: (
    <g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const x = 14 + (i % 4) * 54;
        const y = 12 + Math.floor(i / 4) * 66;
        return (
          <g key={i}>
            <rect x={x} y={y} width="46" height="58" rx="8" fill={ink} opacity={0.1 + (i % 3) * 0.05} />
            <circle cx={x + 23} cy={y + 22} r="9" fill={ink} opacity="0.4" />
            <path d={`M${x + 9} ${y + 52} q14 -18 28 0`} fill={ink} opacity="0.4" />
          </g>
        );
      })}
    </g>
  ),
  // Three overlapping circles: students, alumni, professionals.
  about: (
    <g>
      <circle cx="95" cy="62" r="40" fill={ink} opacity="0.14" />
      <circle cx="145" cy="62" r="40" fill={ink} opacity="0.14" />
      <circle cx="120" cy="100" r="40" fill={ink} opacity="0.14" />
      <circle cx="120" cy="76" r="8" fill={ink} opacity="0.6" />
    </g>
  ),
};
