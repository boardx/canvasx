import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function TextNoteIcon(props) {
  return (<SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      strokeWidth="1.5"
      stroke='var(--joy-palette-text-icon)'
      className="widgetMenuImgSize"
    >
      <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
        <path
          d="M1.5,3.748V3A2.25,2.25,0,0,1,3.75.748h16.5A2.25,2.25,0,0,1,22.5,3v.75"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M12 0.748L12 23.248"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M7.5 23.248L16.5 23.248"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg></SvgIcon>
  );
}
