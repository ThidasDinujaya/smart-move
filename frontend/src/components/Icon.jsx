const iconPaths = {
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  bus: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M7 19v2m10-2v2M3 11h18M7 15h.01M17 15h.01M7 5l1-2h8l1 2" />
    </>
  ),
  ticket: (
    <>
      <path d="M4 7V5h16v2a2 2 0 0 0 0 4v2a2 2 0 0 0 0 4v2H4v-2a2 2 0 0 0 0-4v-2a2 2 0 0 0 0-4Z" />
      <path d="M13 7v2m0 3v2m0 3v1" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18m-14 5h3" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  edit: <path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z" />,
  trash: <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  download: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5" />
      <path d="M5 17v4h14v-4" />
    </>
  ),
  chevronDown: <path d="m7 10 5 5 5-5" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
};

export default function Icon({ name, size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[name]}
    </svg>
  );
}
