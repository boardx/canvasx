import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function LineIcon(props) {
  return (
    <SvgIcon {...props}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_3289_3760)">
          <rect x="0.625" y="0.625" width="18.75" height="18.75" rx="3.375" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_3289_3760">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}
