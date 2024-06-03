import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function GroupDistributeV(props) {
  return (
    <SvgIcon sx={{color: 'white'}} {...props}>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      strokeWidth="1.5"
      stroke='var(--joy-palette-text-icon)'
    
    >
      <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
        <title>align-top-bottom</title>
        <polyline className="a" points="14.045 13.705 12 15.75 9.955 13.705" />
        <polyline className="a" points="14.045 10.295 12 8.25 9.955 10.295" />
        <line className="a" x1="1.5" y1="21" x2="5.25" y2="21" />
        <line className="a" x1="18.75" y1="21" x2="22.5" y2="21" />
        <rect
          className="a"
          x="5.25"
          y="18.75"
          width="13.5"
          height="4.5"
          rx="0.5"
          ry="0.5"
          fill='var(--joy-palette-text-icon)'
        />
        <line className="a" x1="3.75" y1="3" x2="6.75" y2="3" />
        <line className="a" x1="17.25" y1="3" x2="20.25" y2="3" />
        <rect
          className="a"
          x="6.75"
          y="0.75"
          width="10.5"
          height="4.5"
          rx="0.5"
          ry="0.5"
          fill='var(--joy-palette-text-icon)'
        />
      </g>
    </svg>
    </SvgIcon>
  );
}
