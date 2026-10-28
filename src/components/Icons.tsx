export function CheckIcon({ color = '#f5c842' }: { color?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M18 52 L40 74 L84 28" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CrossIcon({ color = '#fff4d6' }: { color?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path d="M24 24 L76 76 M76 24 L24 76" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
}
