import type { ReactNode } from "react";
export function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
    back: <path d="M20 12H5m6-6-6 6 6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    monitor: (
      <>
        <rect x="3" y="3" width="18" height="13" rx="2" />
        <path d="M8 21h8m-4-5v5" />
      </>
    ),
    laptop: (
      <path d="M5 17V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12M2 17h20l-2 3H4z" />
    ),
    game: (
      <>
        <path d="M7 7h10c3 0 4 4 4 9 0 3-2 4-4 1l-1-1H8l-1 1c-2 3-4 2-4-1 0-5 1-9 4-9Z" />
        <path d="M8 10v5m-2.5-2.5h5M16 11h.01M18 14h.01" />
      </>
    ),
    study: <path d="m2 9 10-5 10 5-10 5zM6 11v6c4 3 8 3 12 0v-6m4-2v8" />,
    code: <path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18" />,
    create: <path d="m15 3 6 6-11 11-7 1 1-7zM12 6l6 6M4 15l5 5" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
    refresh: <path d="M20 8a8 8 0 1 0 .5 7M20 3v5h-5" />,
    shield: (
      <>
        <path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6z" />
        <path d="m8 11 3 3 5-5" />
      </>
    ),
    tune: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
        <circle cx="8" cy="6" r="2" fill="currentColor" />
        <circle cx="16" cy="12" r="2" fill="currentColor" />
        <circle cx="10" cy="18" r="2" fill="currentColor" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6m0-10h.01" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
    external: (
      <path d="M14 3h7v7m0-7L10 14M10 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-5" />
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    leaf: (
      <>
        <path d="M20 3c-1 8 1 16-9 16-8 0-9-12 0-13 4 0 7-1 9-3Z" />
        <path d="M4 21 16 9" />
      </>
    ),
    spark: (
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2" />
      </>
    ),
  };
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.monitor}
    </svg>
  );
}
export function OSLogo({
  family,
  size = 32,
}: {
  family: string;
  size?: number;
}) {
  if (family === "windows")
    return (
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="currentColor"
      >
        <path d="M2 5 14 3.4v11.4H2zm14-1.9L30 1v13.8H16zM2 17h12v11.5L2 26.9zm14 0h14v14l-14-2.2z" />
      </svg>
    );
  if (family === "macos")
    return (
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="currentColor"
      >
        <path d="M21 1c.3 3-1.8 5.5-4.5 5.6C16 4 18.4 1.4 21 1ZM26 23c-1 2.7-3.5 7-6 7-1.7 0-2-1.1-4.3-1.1S12.8 30 11 30c-3.1 0-7.5-7.5-7.5-13.3 0-5.4 3.5-9 7.2-9 2 0 3.8 1.2 5 1.2 1.1 0 3.1-1.3 5.2-1.3 2.1 0 4.4 1.2 5.5 3.1-5 2.7-4.5 9.4-.4 12.3Z" />
      </svg>
    );
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <path
        fill="currentColor"
        d="M10 10c0-11 12-11 12 0 0 4 6 10 5 15-1 5-21 5-22 0-1-5 5-11 5-15Z"
      />
      <ellipse cx="16" cy="20" rx="7" ry="9" fill="white" />
      <ellipse cx="13" cy="9" rx="2" ry="3" fill="white" />
      <ellipse cx="19" cy="9" rx="2" ry="3" fill="white" />
      <path d="m12 13 4-2 4 2-4 3z" fill="white" />
      <path d="m9 26-6 3 7 2 3-4m10-1 6 3-7 2-3-4" fill="white" />
    </svg>
  );
}
