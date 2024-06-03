import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function LineIcon(props) {
  return (
    <SvgIcon {...props}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_3289_3792)">
          <circle cx="10" cy="10" r="9.375" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_3289_3792">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}
