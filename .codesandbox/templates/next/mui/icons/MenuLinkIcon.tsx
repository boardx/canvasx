import React from 'react';
import SvgIcon from '@mui/joy/SvgIcon';

export default function TemplateIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        className="menuImgSize"
      >
        <g transform="matrix(1,0,0,1,0,0)">
          <path
            d="M10.082,9.5A4.47,4.47,0,0,0,6.75,8H5.25a4.5,4.5,0,0,0,0,9h1.5a4.474,4.474,0,0,0,3.332-1.5"
            fill="none"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M13.918,9.5A4.469,4.469,0,0,1,17.25,8h1.5a4.5,4.5,0,1,1,0,9h-1.5a4.472,4.472,0,0,1-3.332-1.5"
            fill="none"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M6.75 12.499L17.25 12.499"
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
