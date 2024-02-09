export function CornerDownRight(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M2.667 2.666v.933c0 2.24 0 3.36.436 4.216A4 4 0 004.85 9.563C5.706 10 6.826 10 9.067 10h4.266m0 0L10 6.666m3.333 3.333L10 13.333"
      />
    </svg>
  );
}
