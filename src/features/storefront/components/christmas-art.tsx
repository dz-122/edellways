export function Star({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2l2.4 6.9H22l-6 4.4 2.3 7.2L12 16.1 5.7 20.5 8 13.3 2 8.9h7.6z" />
    </svg>
  );
}

/** Daun holly dengan buah cranberry. */
export function Holly({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 140" className={className} fill="none">
      <path d="M14 96c8-22 26-40 52-48 8 10 6 18 12 24-8 6-6 14-12 22-20 6-40 6-52 2z" fill="#1f6b46" stroke="#d4af6a" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M62 64c18-26 52-38 90-30-2 12 6 18 2 28-10 2-12 12-22 16-26 6-52 0-70-14z" fill="#2a7d55" stroke="#d4af6a" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M20 94c30-8 56-22 82-44M70 70c26-4 52-10 76-28" stroke="#d4af6a" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="110" cy="92" r="10" fill="#a3182f" />
      <circle cx="128" cy="102" r="9" fill="#b81e37" />
      <circle cx="98" cy="106" r="8" fill="#a3182f" />
      <circle cx="107" cy="88" r="2.4" fill="#fff" opacity=".7" />
      <circle cx="125" cy="98" r="2.2" fill="#fff" opacity=".7" />
    </svg>
  );
}