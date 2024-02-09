export function MarkerPin(props: React.ComponentPropsWithoutRef<'svg'>) {
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
        fillRule="evenodd"
        d="M2 6.668a6 6 0 1112 0c0 2.08-1.163 3.577-2.352 4.816-.287.3-.584.59-.87.872l-.037.037c-.3.295-.59.58-.862.867-.547.576-.993 1.127-1.283 1.706a.667.667 0 01-1.192 0c-.29-.579-.736-1.13-1.283-1.706a35.619 35.619 0 00-.862-.867l-.037-.037a43.003 43.003 0 01-.87-.872C3.162 10.245 2 8.747 2 6.668zm8-.333a2 2 0 11-4 0 2 2 0 014 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
