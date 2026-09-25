import type { SVGProps } from "react";
type IconProps = SVGProps<SVGSVGElement> & { size?: number };
export function Github({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M9 19c-4 1.2-4-2-6-2m12 5v-3.9a3.4 3.4 0 0 0-1-2.6c3.4-.4 7-1.7 7-7.5a5.8 5.8 0 0 0-1.5-4A5.4 5.4 0 0 0 19.4 0S18.2-.4 15 1.5a14 14 0 0 0-6 0C5.8-.4 4.6 0 4.6 0a5.4 5.4 0 0 0-.1 4A5.8 5.8 0 0 0 3 8c0 5.8 3.6 7.1 7 7.5a3.4 3.4 0 0 0-1 2.6V22"
        transform="translate(1 2) scale(.9)"
      />
    </svg>
  );
}
export function Linkedin({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10v7M11.5 17v-7m0 3a3 3 0 0 1 6 0v4" />
      <circle cx="7.5" cy="7" r=".7" fill="currentColor" stroke="none" />
    </svg>
  );
}
