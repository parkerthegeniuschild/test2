export function Image(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="17"
      fill="none"
      viewBox="0 0 16 17"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 1.834a2.667 2.667 0 100 5.333 2.667 2.667 0 000-5.333zM11.844 8.47a1.333 1.333 0 00-1.022 0c-.247.103-.416.282-.538.433a7.017 7.017 0 00-.345.487L8.076 6.7a7.583 7.583 0 00-.376-.515 1.375 1.375 0 00-.532-.415 1.333 1.333 0 00-1.004 0c-.242.099-.41.27-.532.415-.116.14-.242.32-.376.515L1.26 12.47c-.173.25-.329.475-.436.666-.108.19-.232.452-.217.76.018.393.21.757.521.996.245.187.532.234.749.254.218.02.491.02.796.02h10.695c.3 0 .568 0 .783-.02.215-.02.497-.066.74-.25.311-.235.504-.594.527-.984.018-.304-.1-.565-.202-.754-.103-.19-.252-.414-.418-.663L12.76 9.44a7.774 7.774 0 00-.378-.537 1.38 1.38 0 00-.538-.432z"
      />
    </svg>
  );
}
