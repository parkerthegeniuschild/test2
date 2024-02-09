export function Spinner(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 18 18"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        d="M1.005 9.28a8 8 0 1115.99-.56 8 8 0 01-15.99.56h0z"
        opacity="0.16"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        d="M1.005 9.28a8 8 0 0114.3-5.205"
      />
    </svg>
  );
}
