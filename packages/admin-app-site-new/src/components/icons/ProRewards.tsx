import { useId } from 'react';

function Emerald(props: React.ComponentPropsWithoutRef<'svg'>) {
  const filter0Id = useId();
  const filter1Id = useId();
  const filter2Id = useId();

  const linearGradient0Id = useId();
  const linearGradient1Id = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <g filter={`url(#${filter0Id})`}>
        <g fill="#063" filter={`url(#${filter1Id})`}>
          <path d="M1.077 9.077a1.524 1.524 0 010-2.154l5.846-5.846a1.524 1.524 0 012.155 0l5.845 5.846c.595.595.595 1.56 0 2.155l-5.846 5.845a1.524 1.524 0 01-2.154 0L1.077 9.076z" />
          <path d="M1.077 9.077a1.524 1.524 0 010-2.154l5.846-5.846a1.524 1.524 0 012.155 0l5.845 5.846c.595.595.595 1.56 0 2.155l-5.846 5.845a1.524 1.524 0 01-2.154 0L1.077 9.076z" />
        </g>
        <g filter={`url(#${filter2Id})`}>
          <path
            fill={`url(#${linearGradient0Id})`}
            d="M2.808 8.808a1.143 1.143 0 010-1.616l4.384-4.384a1.143 1.143 0 011.616 0l4.384 4.384c.446.446.446 1.17 0 1.616l-4.384 4.384a1.143 1.143 0 01-1.616 0L2.808 8.808z"
          />
          <path
            fill={`url(#${linearGradient1Id})`}
            d="M2.808 8.808a1.143 1.143 0 010-1.616l4.384-4.384a1.143 1.143 0 011.616 0l4.384 4.384c.446.446.446 1.17 0 1.616l-4.384 4.384a1.143 1.143 0 01-1.616 0L2.808 8.808z"
          />
        </g>
      </g>
      <defs>
        <filter
          id={filter0Id}
          width="15.957"
          height="15.957"
          x="0.022"
          y="0.021"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="0.305" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4292_30471"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_4292_30471"
            result="shape"
          />
        </filter>
        <filter
          id={filter1Id}
          width="24.49"
          height="24.491"
          x="-4.245"
          y="-4.245"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="2.438" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4292_30471"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_4292_30471"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.19" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0" />
          <feBlend in2="shape" result="effect2_innerShadow_4292_30471" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.762" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.48 0" />
          <feBlend
            in2="effect2_innerShadow_4292_30471"
            result="effect3_innerShadow_4292_30471"
          />
        </filter>
        <filter
          id={filter2Id}
          width="27.053"
          height="27.055"
          x="-5.527"
          y="-5.527"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="4" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4292_30471"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.19" />
          <feGaussianBlur stdDeviation="0.381" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
          <feBlend
            in2="effect1_backgroundBlur_4292_30471"
            result="effect2_dropShadow_4292_30471"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect2_dropShadow_4292_30471"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.19" />
          <feGaussianBlur stdDeviation="0.095" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.48 0" />
          <feBlend in2="shape" result="effect3_innerShadow_4292_30471" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="-0.19" />
          <feGaussianBlur stdDeviation="0.095" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
          <feBlend
            in2="effect3_innerShadow_4292_30471"
            result="effect4_innerShadow_4292_30471"
          />
        </filter>
        <linearGradient
          id={linearGradient0Id}
          x1="8"
          x2="8"
          y1="2"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#62F5AB" />
          <stop offset="0.636" stopColor="#0C6" />
        </linearGradient>
        <linearGradient
          id={linearGradient1Id}
          x1="8"
          x2="8"
          y1="2"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#62F5AB" />
          <stop offset="0.636" stopColor="#0C6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Gold(props: React.ComponentPropsWithoutRef<'svg'>) {
  const filter0Id = useId();
  const filter1Id = useId();
  const filter2Id = useId();

  const linearGradient0Id = useId();
  const linearGradient1Id = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <g filter={`url(#${filter0Id})`}>
        <g fill="#B77105" filter={`url(#${filter1Id})`}>
          <path d="M1.077 9.077a1.524 1.524 0 010-2.154l5.846-5.846a1.524 1.524 0 012.155 0l5.845 5.846c.595.595.595 1.56 0 2.155l-5.846 5.845a1.524 1.524 0 01-2.154 0L1.077 9.076z" />
          <path d="M1.077 9.077a1.524 1.524 0 010-2.154l5.846-5.846a1.524 1.524 0 012.155 0l5.845 5.846c.595.595.595 1.56 0 2.155l-5.846 5.845a1.524 1.524 0 01-2.154 0L1.077 9.076z" />
        </g>
        <g filter={`url(#${filter2Id})`}>
          <path
            fill={`url(#${linearGradient0Id})`}
            d="M2.808 8.808a1.143 1.143 0 010-1.616l4.384-4.384a1.143 1.143 0 011.616 0l4.384 4.384c.446.446.446 1.17 0 1.616l-4.384 4.384a1.143 1.143 0 01-1.616 0L2.808 8.808z"
          />
          <path
            fill={`url(#${linearGradient1Id})`}
            d="M2.808 8.808a1.143 1.143 0 010-1.616l4.384-4.384a1.143 1.143 0 011.616 0l4.384 4.384c.446.446.446 1.17 0 1.616l-4.384 4.384a1.143 1.143 0 01-1.616 0L2.808 8.808z"
          />
        </g>
      </g>
      <defs>
        <filter
          id={filter0Id}
          width="15.957"
          height="15.957"
          x="0.022"
          y="0.021"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="0.305" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4292_30476"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_4292_30476"
            result="shape"
          />
        </filter>
        <filter
          id={filter1Id}
          width="24.49"
          height="24.491"
          x="-4.245"
          y="-4.245"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="2.438" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4292_30476"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_4292_30476"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.19" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0" />
          <feBlend in2="shape" result="effect2_innerShadow_4292_30476" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.762" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.48 0" />
          <feBlend
            in2="effect2_innerShadow_4292_30476"
            result="effect3_innerShadow_4292_30476"
          />
        </filter>
        <filter
          id={filter2Id}
          width="27.053"
          height="27.055"
          x="-5.527"
          y="-5.527"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="4" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4292_30476"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.19" />
          <feGaussianBlur stdDeviation="0.381" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
          <feBlend
            in2="effect1_backgroundBlur_4292_30476"
            result="effect2_dropShadow_4292_30476"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect2_dropShadow_4292_30476"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.19" />
          <feGaussianBlur stdDeviation="0.095" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0" />
          <feBlend in2="shape" result="effect3_innerShadow_4292_30476" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="-0.19" />
          <feGaussianBlur stdDeviation="0.095" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
          <feBlend
            in2="effect3_innerShadow_4292_30476"
            result="effect4_innerShadow_4292_30476"
          />
        </filter>
        <linearGradient
          id={linearGradient0Id}
          x1="8"
          x2="8"
          y1="2"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD86C" />
          <stop offset="0.636" stopColor="#FFAF0A" />
        </linearGradient>
        <linearGradient
          id={linearGradient1Id}
          x1="8"
          x2="8"
          y1="2"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD86C" />
          <stop offset="0.636" stopColor="#FFAF0A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Platinum(props: React.ComponentPropsWithoutRef<'svg'>) {
  const filter0Id = useId();
  const filter1Id = useId();
  const filter2Id = useId();

  const linearGradient0Id = useId();
  const linearGradient1Id = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <g filter={`url(#${filter0Id})`}>
        <g fill="#AAAAAB" filter={`url(#${filter1Id})`}>
          <path d="M1.077 9.077a1.524 1.524 0 010-2.154l5.846-5.846a1.524 1.524 0 012.155 0l5.845 5.846c.595.595.595 1.56 0 2.155l-5.846 5.845a1.524 1.524 0 01-2.154 0L1.077 9.076z" />
          <path d="M1.077 9.077a1.524 1.524 0 010-2.154l5.846-5.846a1.524 1.524 0 012.155 0l5.845 5.846c.595.595.595 1.56 0 2.155l-5.846 5.845a1.524 1.524 0 01-2.154 0L1.077 9.076z" />
        </g>
        <g filter={`url(#${filter2Id})`}>
          <path
            fill={`url(#${linearGradient0Id})`}
            d="M2.808 8.808a1.143 1.143 0 010-1.616l4.384-4.384a1.143 1.143 0 011.616 0l4.384 4.384c.446.446.446 1.17 0 1.616l-4.384 4.384a1.143 1.143 0 01-1.616 0L2.808 8.808z"
          />
          <path
            fill={`url(#${linearGradient1Id})`}
            d="M2.808 8.808a1.143 1.143 0 010-1.616l4.384-4.384a1.143 1.143 0 011.616 0l4.384 4.384c.446.446.446 1.17 0 1.616l-4.384 4.384a1.143 1.143 0 01-1.616 0L2.808 8.808z"
          />
        </g>
      </g>
      <defs>
        <filter
          id={filter0Id}
          width="15.957"
          height="15.957"
          x="0.022"
          y="0.021"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="0.305" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4292_30483"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_4292_30483"
            result="shape"
          />
        </filter>
        <filter
          id={filter1Id}
          width="24.49"
          height="24.491"
          x="-4.245"
          y="-4.245"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="2.438" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4292_30483"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_4292_30483"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.19" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0" />
          <feBlend in2="shape" result="effect2_innerShadow_4292_30483" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.762" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.48 0" />
          <feBlend
            in2="effect2_innerShadow_4292_30483"
            result="effect3_innerShadow_4292_30483"
          />
        </filter>
        <filter
          id={filter2Id}
          width="27.053"
          height="27.055"
          x="-5.527"
          y="-5.527"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="4" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4292_30483"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.19" />
          <feGaussianBlur stdDeviation="0.381" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
          <feBlend
            in2="effect1_backgroundBlur_4292_30483"
            result="effect2_dropShadow_4292_30483"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect2_dropShadow_4292_30483"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.19" />
          <feGaussianBlur stdDeviation="0.095" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0" />
          <feBlend in2="shape" result="effect3_innerShadow_4292_30483" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="-0.19" />
          <feGaussianBlur stdDeviation="0.095" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
          <feBlend
            in2="effect3_innerShadow_4292_30483"
            result="effect4_innerShadow_4292_30483"
          />
        </filter>
        <linearGradient
          id={linearGradient0Id}
          x1="8"
          x2="8"
          y1="2"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F4F4F4" />
          <stop offset="0.636" stopColor="#DFDFDF" />
        </linearGradient>
        <linearGradient
          id={linearGradient1Id}
          x1="8"
          x2="8"
          y1="2"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F4F4F4" />
          <stop offset="0.636" stopColor="#DFDFDF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Diamond(props: React.ComponentPropsWithoutRef<'svg'>) {
  const filter0Id = useId();
  const filter1Id = useId();
  const filter2Id = useId();

  const linearGradient0Id = useId();
  const linearGradient1Id = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <g filter={`url(#${filter0Id})`}>
        <g fill="#782CAD" filter={`url(#${filter1Id})`}>
          <path d="M1.077 9.077a1.524 1.524 0 010-2.154l5.846-5.846a1.524 1.524 0 012.155 0l5.845 5.846c.595.595.595 1.56 0 2.155l-5.846 5.845a1.524 1.524 0 01-2.154 0L1.077 9.076z" />
          <path d="M1.077 9.077a1.524 1.524 0 010-2.154l5.846-5.846a1.524 1.524 0 012.155 0l5.845 5.846c.595.595.595 1.56 0 2.155l-5.846 5.845a1.524 1.524 0 01-2.154 0L1.077 9.076z" />
        </g>
        <g filter={`url(#${filter2Id})`}>
          <path
            fill={`url(#${linearGradient0Id})`}
            d="M2.808 8.808a1.143 1.143 0 010-1.616l4.384-4.384a1.143 1.143 0 011.616 0l4.384 4.384c.446.446.446 1.17 0 1.616l-4.384 4.384a1.143 1.143 0 01-1.616 0L2.808 8.808z"
          />
          <path
            fill={`url(#${linearGradient1Id})`}
            d="M2.808 8.808a1.143 1.143 0 010-1.616l4.384-4.384a1.143 1.143 0 011.616 0l4.384 4.384c.446.446.446 1.17 0 1.616l-4.384 4.384a1.143 1.143 0 01-1.616 0L2.808 8.808z"
          />
        </g>
      </g>
      <defs>
        <filter
          id={filter0Id}
          width="15.957"
          height="15.957"
          x="0.022"
          y="0.021"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="0.305" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4292_30488"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_4292_30488"
            result="shape"
          />
        </filter>
        <filter
          id={filter1Id}
          width="24.49"
          height="24.491"
          x="-4.245"
          y="-4.245"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="2.438" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4292_30488"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_4292_30488"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.19" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0" />
          <feBlend in2="shape" result="effect2_innerShadow_4292_30488" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.762" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.48 0" />
          <feBlend
            in2="effect2_innerShadow_4292_30488"
            result="effect3_innerShadow_4292_30488"
          />
        </filter>
        <filter
          id={filter2Id}
          width="27.053"
          height="27.055"
          x="-5.527"
          y="-5.527"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="4" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_4292_30488"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.19" />
          <feGaussianBlur stdDeviation="0.381" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
          <feBlend
            in2="effect1_backgroundBlur_4292_30488"
            result="effect2_dropShadow_4292_30488"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect2_dropShadow_4292_30488"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0.19" />
          <feGaussianBlur stdDeviation="0.095" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0" />
          <feBlend in2="shape" result="effect3_innerShadow_4292_30488" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="-0.19" />
          <feGaussianBlur stdDeviation="0.095" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
          <feBlend
            in2="effect3_innerShadow_4292_30488"
            result="effect4_innerShadow_4292_30488"
          />
        </filter>
        <linearGradient
          id={linearGradient0Id}
          x1="8"
          x2="8"
          y1="2"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EE9BFA" />
          <stop offset="0.636" stopColor="#C859F1" />
        </linearGradient>
        <linearGradient
          id={linearGradient1Id}
          x1="8"
          x2="8"
          y1="2"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EE9BFA" />
          <stop offset="0.636" stopColor="#C859F1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const ProRewards = {
  Emerald,
  Gold,
  Platinum,
  Diamond,
};
