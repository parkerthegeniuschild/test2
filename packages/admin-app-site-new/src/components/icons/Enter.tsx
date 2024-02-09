export function Enter(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="11"
      fill="none"
      viewBox="0 0 14 11"
      {...props}
    >
      <path
        fill="currentColor"
        d="M2.047 6.964v-1.2h8.07c.35 0 .67-.087.96-.259a1.927 1.927 0 00.946-1.653c0-.35-.086-.67-.259-.955a1.964 1.964 0 00-.692-.693 1.817 1.817 0 00-.956-.258H9.6V.75h.517c.573 0 1.093.14 1.56.42.468.28.842.654 1.122 1.122.28.468.42.988.42 1.56 0 .428-.081.83-.244 1.205a3.158 3.158 0 01-1.653 1.667 3.04 3.04 0 01-1.205.24h-8.07zm2.968 3.596L.819 6.364l4.196-4.197.826.827-3.374 3.37 3.374 3.37-.826.826z"
      />
    </svg>
  );
}