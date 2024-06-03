import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function PolygonIcon(props) {
  return (
    <SvgIcon {...props}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_3289_3764)">
          <path d="M1.96475 5.36084L10 0.721688L18.0353 5.36084V14.6392L10 19.2783L1.96475 14.6392V5.36084Z" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_3289_3764">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}
