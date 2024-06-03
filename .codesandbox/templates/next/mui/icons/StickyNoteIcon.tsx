import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function StickyNoteIcon(props) {
  return (
    <SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      strokeWidth="1.5"
      stroke='var(--joy-palette-text-icon)'
      className="widgetMenuImgSize"
    >
      <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
        <path
          d="M13.629,23.25H2.25a1.5,1.5,0,0,1-1.5-1.5V2.25A1.5,1.5,0,0,1,2.25.75h19.5a1.5,1.5,0,0,1,1.5,1.5V13.629a1.5,1.5,0,0,1-.439,1.06l-8.122,8.122A1.5,1.5,0,0,1,13.629,23.25Z"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M14.25,23.115V15.75a1.5,1.5,0,0,1,1.5-1.5h7.365"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
    </SvgIcon>
  );
}
