import React from 'react';

export default function WaveBackground() {
  // Generate a bunch of paths for a topological wave effect
  const paths1 = Array.from({ length: 15 }).map((_, i) => {
    const yOffset = i * 4;
    return `M-100,${400 + yOffset} C300,${150 + i * 8} 600,${600 + i * 2} 1600,${300 + yOffset}`;
  });

  const paths2 = Array.from({ length: 15 }).map((_, i) => {
    const yOffset = i * 3;
    return `M-100,${550 + yOffset} C400,${300 - i * 5} 800,${700 + i * 6} 1600,${400 + yOffset}`;
  });

  const paths3 = Array.from({ length: 12 }).map((_, i) => {
    const yOffset = i * 5;
    return `M-100,${250 + yOffset} C500,${600 + i * 4} 900,${100 - i * 3} 1600,${500 + yOffset}`;
  });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none mix-blend-multiply opacity-30">
      <svg
        className="absolute w-full h-full object-cover min-w-[1440px]"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 800"
        fill="none"
        stroke="#4A4843"
        strokeWidth="0.5"
      >
        <g opacity="0.15">
          {paths1.map((d, i) => (
            <path key={`p1-${i}`} d={d} />
          ))}
          {paths2.map((d, i) => (
            <path key={`p2-${i}`} d={d} />
          ))}
          {paths3.map((d, i) => (
            <path key={`p3-${i}`} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}
