import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function PolygonIcon(props) {
  return (
    <SvgIcon {...props}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_3289_3758)">
          <rect x="0.883883" y="10" width="12.75" height="12.75" transform="rotate(-45 0.883883 10)" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_3289_3758">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}
