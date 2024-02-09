export function CheckCircleBroken(
  props: React.ComponentPropsWithoutRef<'svg'>
) {
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
        d="M7 .875a6.125 6.125 0 105.684 3.84c-.119-.296-.178-.444-.319-.539a.61.61 0 00-.42-.085c-.166.032-.296.162-.555.422l-3.996 4a.557.557 0 01-.788 0l-1.67-1.67a.557.557 0 01.787-.788L7 7.332l3.885-3.89c.21-.21.314-.314.354-.45a.606.606 0 00-.019-.366c-.054-.132-.154-.214-.354-.377A6.1 6.1 0 007 .875z"
      />
    </svg>
  );
}
