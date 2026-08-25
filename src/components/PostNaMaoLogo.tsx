import React from 'react';

export function PostNaMaoLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 130" className={className}>
      <g transform="translate(10, 5)">
        {/* Hand - Back Fingers */}
        <rect x="70" y="35" width="22" height="14" rx="7" fill="#0b2136" transform="rotate(-20 70 35)" className="dark:fill-slate-100" />
        <rect x="74" y="55" width="22" height="14" rx="7" fill="#0b2136" transform="rotate(-20 74 55)" className="dark:fill-slate-100" />
        <rect x="71" y="75" width="20" height="14" rx="7" fill="#0b2136" transform="rotate(-20 71 75)" className="dark:fill-slate-100" />

        {/* Phone Body */}
        <rect x="25" y="10" width="54" height="96" rx="10" fill="white" stroke="#0b2136" strokeWidth="5" className="dark:stroke-slate-100 dark:fill-slate-900" />
        
        {/* Phone Screen Orange Area */}
        <rect x="32" y="27" width="40" height="62" rx="5" fill="#f35c27" />
        
        {/* Screen Top UI */}
        <circle cx="42" cy="36" r="4" fill="white" />
        <rect x="50" y="34" width="16" height="4" rx="2" fill="white" />
        <rect x="38" y="78" width="28" height="6" rx="3" fill="white" />
        
        {/* Hand - Palm & Thumb */}
        <path d="M 15 70 C 0 115, 60 125, 80 95 L 75 80 L 20 80 Z" fill="#0b2136" className="dark:fill-slate-100" />
        <rect x="12" y="35" width="16" height="50" rx="8" fill="#0b2136" className="dark:fill-slate-100" />

        {/* Checkmark (Overlaps everything) */}
        <path d="M 40 60 L 55 75 L 90 35" fill="none" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-slate-900" />
        <path d="M 40 60 L 55 75 L 90 35" fill="none" stroke="#f35c27" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Text */}
        <text x="110" y="58" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="52" fill="#0b2136" className="dark:fill-white">POST</text>
        <text x="110" y="108" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="52" fill="#f35c27">NA</text>
        <text x="195" y="108" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="52" fill="#0b2136" className="dark:fill-white">MÃO</text>
      </g>
    </svg>
  );
}
