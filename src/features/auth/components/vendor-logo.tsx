"use client";

export const VENDOR_ICONS = {
  main: () => (
    <svg
      className="h-10 w-10 shrink-0"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M8 10h16v12H8z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14v8M20 14v8"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="10" r="3" stroke="white" strokeWidth="2" />
    </svg>
  ),
  small: () => (
    <svg
      className="h-6 w-6 shrink-0"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M8 10h16v12H8z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14v8M20 14v8"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="10" r="3" stroke="white" strokeWidth="2" />
    </svg>
  ),
  inline: ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg
      className={`${className} shrink-0`}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M8 10h16v12H8z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14v8M20 14v8"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="10" r="3" stroke="white" strokeWidth="2" />
    </svg>
  ),
};

export function VendorLogo({
  className = "",
  variant = "main",
}: {
  className?: string;
  variant?: "main" | "small" | "inline";
}) {
  const Icon = VENDOR_ICONS[variant];
  return (
    <span className={`inline-flex items-center justify-center text-primary ${className}`}>
      <Icon />
    </span>
  );
}