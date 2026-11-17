export function BotanicalSprig({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 400" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M100 395V120" />
      <path d="M100 300c-48-8-76-46-76-86 40 4 72 38 76 86Z" />
      <path d="M100 250c42-8 68-42 70-80-36 4-66 36-70 80Z" />
      <path d="M100 200c-36-6-58-34-58-66 32 3 56 30 58 66Z" />
      <path d="M100 150c-22-18-28-50-8-88 24 24 30 58 8 88Z" />
      <circle cx="100" cy="46" r="14" />
    </svg>
  );
}