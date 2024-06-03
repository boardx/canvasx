import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function Cursor(props) {
  const { htmlColor } = props;
  return (
    <SvgIcon {...props} viewBox="0 0 19 22">
      <svg
        width="22"
        height="24"
        viewBox="0 0 22 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_7776_8186)">
          <path d="M7.5 17L5 4L16 10.5L10.5 12L7.5 17Z" fill="none" />
          <path
            d="M7.009 17.0944L7.25595 18.3786L7.92875 17.2572L10.8254 12.4295L16.1316 10.9824L17.2726 10.6712L16.2544 10.0695L5.25436 3.56954L4.29956 3.00533L4.509 4.09442L7.009 17.0944Z"
            fill={htmlColor}
            style={{ stroke: '#FFFFFF' }}
            strokeLinecap="square"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_7776_8186"
            x="0.599113"
            y="0.0106659"
            width="20.946"
            height="23.7465"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1.5" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_7776_8186"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_7776_8186"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </SvgIcon>
  );
}
