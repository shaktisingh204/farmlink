import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 4 13H2a9 9 0 0 0 18 0h-2a7 7 0 0 1-7 7Z" />
      <path d="M12 4v16" />
       <path d="m18.36 6.64-1.42-1.42" />
      <path d="m6.34 18.36.7-3.5-3.5.7.7-3.5-3.5.7.7-3.5-3.5.7" />
    </svg>
  );
}
