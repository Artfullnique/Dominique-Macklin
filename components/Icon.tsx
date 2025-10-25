
import React from 'react';

interface IconProps {
  name: 'upload' | 'copy' | 'check' | 'sparkles' | 'new' | 'arrow-right';
  className?: string;
}

const ICONS: Record<IconProps['name'], React.ReactNode> = {
  upload: <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h2a4 4 0 014 4v1m-1 8l-2-2m2 2l2-2m-2 2v-4.5A2.5 2.5 0 0112 8.5V6M3 16h12a4 4 0 004-4V7a4 4 0 00-4-4H7" />,
  copy: <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />,
  check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
  sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4-4 6.293-6.293a1 1 0 011.414 0z" />,
  new: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M5.5 9.5L4 11l1.5 1.5M12 4h5v5M13.5 9.5L12 11l1.5 1.5M4 17h5v5M5.5 18.5L4 20l1.5 1.5M17 12v5h5M18.5 13.5L17 15l1.5 1.5" />,
  'arrow-right': <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
};

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    {ICONS[name]}
  </svg>
);
