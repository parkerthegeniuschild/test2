export function XCircle(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M.291 6.999a6.417 6.417 0 1112.833 0 6.417 6.417 0 01-12.833 0zM4.108 4.4a.582.582 0 01.823 0l1.776 1.776 1.776-1.776a.582.582 0 11.823.823L7.53 7l1.776 1.776a.582.582 0 01-.823.823L6.707 7.823 4.931 9.599a.582.582 0 11-.823-.823L5.884 7 4.108 5.224a.582.582 0 010-.823z"
        clipRule="evenodd"
      />
    </svg>
  );
}
