export function AlertCircle(props: React.ComponentPropsWithoutRef<'svg'>) {
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
        fill="currentColor"
        fillRule="evenodd"
        d="M8 .666a7.333 7.333 0 100 14.667A7.333 7.333 0 008 .666zm.667 4.667a.667.667 0 10-1.333 0v2.666a.667.667 0 101.333 0V5.333zM8 9.999a.667.667 0 100 1.334h.007a.667.667 0 000-1.334H8z"
        clipRule="evenodd"
      />
    </svg>
  );
}
