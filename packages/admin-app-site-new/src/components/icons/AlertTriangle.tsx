export function AlertTriangle(props: React.ComponentPropsWithoutRef<'svg'>) {
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
        d="M6.406.834a1 1 0 00-.812 0c-.2.09-.33.246-.42.373-.09.125-.184.29-.289.47L.752 8.817c-.105.181-.2.346-.265.486a1.048 1.048 0 00-.115.55 1 1 0 00.407.706c.177.129.378.163.534.177.154.014.344.014.553.014h8.267c.21 0 .4 0 .554-.014.155-.014.357-.048.534-.177a1 1 0 00.406-.705 1.047 1.047 0 00-.114-.551c-.065-.14-.16-.305-.265-.486l-4.134-7.14c-.104-.18-.2-.345-.288-.47a1.048 1.048 0 00-.42-.373zM6.5 4.5a.5.5 0 00-1 0v2a.5.5 0 001 0v-2zM6 8a.5.5 0 000 1h.005a.5.5 0 000-1H6z"
        clipRule="evenodd"
      />
    </svg>
  );
}
