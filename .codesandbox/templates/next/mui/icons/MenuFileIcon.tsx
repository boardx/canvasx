import React from 'react';
import SvgIcon from '@mui/joy/SvgIcon';

export default function TemplateIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        className="menuImgSize svg"
      >
        <g transform="matrix(1,0,0,1,0,0)">
          <path
            d="M12.001 15.75L12.001 3.75"
            fill="none"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M16.501 8.25L12.001 3.75 7.501 8.25"
            fill="none"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M23.251,15.75v1.5a3,3,0,0,1-3,3H3.751a3,3,0,0,1-3-3v-1.5"
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
