export function Scissors(props: React.ComponentPropsWithoutRef<'svg'>) {
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
        d="M2.308 5.508A2.332 2.332 0 013.5 1.168a2.333 2.333 0 011.273 4.289l1.748.89 5.464-2.782a.583.583 0 01.53 1.04L7.807 7l4.708 2.397a.583.583 0 11-.53 1.04L6.521 7.656l-1.748.89a2.333 2.333 0 11-2.243-.167L5.235 7 2.53 5.624a2.327 2.327 0 01-.222-.116zM2.333 3.5A1.167 1.167 0 113.03 4.57l-.115-.058a1.166 1.166 0 01-.582-1.01zm.582 5.99a1.166 1.166 0 10.115-.058l-.115.059z"
        clipRule="evenodd"
      />
    </svg>
  );
}
