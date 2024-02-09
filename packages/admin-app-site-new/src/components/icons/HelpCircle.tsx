export function HelpCircle(props: React.ComponentPropsWithoutRef<'svg'>) {
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
        d="M7 .584a6.417 6.417 0 100 12.833A6.417 6.417 0 007 .584zm-.638 4.242A1.167 1.167 0 018.12 5.833v.001c0 .274-.213.559-.615.827a3.53 3.53 0 01-.737.37.583.583 0 00.37 1.106l.098-.035a4.693 4.693 0 00.916-.47c.473-.315 1.134-.905 1.135-1.798a2.333 2.333 0 00-4.535-.777.583.583 0 101.1.387c.092-.26.273-.479.51-.618zM7 9.334a.583.583 0 100 1.167h.006a.583.583 0 100-1.167H7z"
        clipRule="evenodd"
      />
    </svg>
  );
}
