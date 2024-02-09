export function Plus(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        d="M8.667 3.333a.667.667 0 10-1.334 0v4h-4a.667.667 0 000 1.333h4v4a.667.667 0 101.334 0v-4h4a.667.667 0 000-1.333h-4v-4z"
      />
    </svg>
  );
}
