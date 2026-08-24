import React from 'react';

export function PostNaMaoLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" className={className}>
      <g transform="translate(10, 10)">
        {/* Smartphone body - Navy Blue */}
        <rect x="15" y="5" width="50" height="90" rx="8" fill="#0f172a" className="dark:fill-slate-800" />
        {/* Screen */}
        <rect x="20" y="15" width="40" height="70" rx="2" fill="#1e293b" className="dark:fill-slate-700" />
        {/* Checkmark - Vibrant Orange */}
        <path d="M 30 50 L 40 60 L 65 30" fill="none" stroke="#f97316" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        {/* Bottom button */}
        <circle cx="40" cy="90" r="3" fill="#334155" />
      </g>
    </svg>
  );
}
