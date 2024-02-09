export function TimesCircle(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 12 12"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6 11.5a5.5 5.5 0 110-11 5.5 5.5 0 010 11zM6.972 6L8.55 7.576a.688.688 0 01-.973.973L6 6.972 4.424 8.55a.688.688 0 01-.973-.973L5.028 6 3.45 4.424a.688.688 0 01.973-.973L6 5.028 7.576 3.45a.688.688 0 01.973.973L6.972 6z"
        clipRule="evenodd"
      />
    </svg>
  );
}
