export function CheckCircle(props: React.ComponentPropsWithoutRef<'svg'>) {
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
        d="M8 .667a7.333 7.333 0 100 14.666A7.333 7.333 0 008 .667zm3.47 5.804a.667.667 0 00-.942-.942L6.999 9.057 5.471 7.53a.667.667 0 00-.943.942l2 2c.26.26.682.26.943 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
