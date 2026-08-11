import React from 'react';

export function PrismaLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" className={className}>
      <g transform="translate(5, 5)">
        {/* Left vertical */}
        <polygon points="20,25 45,10 45,105 20,85" fill="#1e1147" className="dark:fill-indigo-900" />
        {/* Top part of loop */}
        <polygon points="45,10 85,25 65,45 45,35" fill="#6741d9" className="dark:fill-indigo-400" />
        {/* Outer right vertical */}
        <polygon points="85,25 85,65 65,85 65,45" fill="#5f3dc4" className="dark:fill-indigo-500" />
        {/* Bottom part of loop */}
        <polygon points="65,85 45,75 45,55 65,65" fill="#3b2085" className="dark:fill-indigo-700" />
        
        {/* Sparkle / Star */}
        <path d="M 45 45 Q 55 45 55 35 Q 55 45 65 45 Q 55 45 55 55 Q 55 45 45 45 Z" fill="#ffffff" />
      </g>
    </svg>
  );
}
