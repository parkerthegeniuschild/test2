import { useId } from 'react';

export function InProgress(props: React.ComponentPropsWithoutRef<'svg'>) {
  const id = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <g fill="currentColor" clipPath={`url(#${id})`}>
        <path d="M8.334 2.676A.318.318 0 008 2.999v4.807c0 .12.063.23.166.289l4.164 2.404c.16.092.364.037.446-.127a5.333 5.333 0 00-4.443-7.696z" />
        <path
          fillRule="evenodd"
          d="M15.667 7.999a7.667 7.667 0 11-15.333 0 7.667 7.667 0 0115.333 0zm-1.333 0a6.333 6.333 0 11-12.667 0 6.333 6.333 0 0112.667 0z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id={id}>
          <path fill="#fff" d="M0 0H16V16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
