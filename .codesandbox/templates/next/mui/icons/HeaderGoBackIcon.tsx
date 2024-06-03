import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function HeaderGoBackIcon(props) {
  return (
    <SvgIcon {...props} style={{ width: 20, height: 20 }} viewBox="0 0 20 20">
      <svg
        width="20px"
        height="20px"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        strokeWidth="1.5"
        className="menuImgSize"
      >
        <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
          <path
            d="M16.25,23.25,5.53,12.53a.749.749,0,0,1,0-1.06L16.25.75"
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
