import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function GroupDistributeH(props) {
  return (
    <SvgIcon sx={{color:        'var(--joy-palette-text-icon)'}} {...props}>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      strokeWidth="1.5"
      stroke='var(--joy-palette-text-icon)'
      className="widgetMenuImgSize"
    >
      <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
        <title>align-left-right</title>
        <polyline className="a" points="13.705 9.955 15.75 12 13.705 14.045" />
        <polyline className="a" points="10.295 9.955 8.25 12 10.295 14.045" />
        <line className="a" x1="21" y1="22.5" x2="21" y2="18.75" />
        <line className="a" x1="21" y1="5.25" x2="21" y2="1.5" />
        <rect
          className="a"
          x="14.25"
          y="9.75"
          width="13.5"
          height="4.5"
          rx="0.5"
          ry="0.5"
          transform="translate(9 33) rotate(-90)"
          fill='var(--joy-palette-text-icon)'
        />
        <line className="a" x1="3" y1="20.25" x2="3" y2="17.25" />
        <line className="a" x1="3" y1="6.75" x2="3" y2="3.75" />
        <rect
          className="a"
          x="-2.25"
          y="9.75"
          width="10.5"
          height="4.5"
          rx="0.5"
          ry="0.5"
          transform="translate(-9 15) rotate(-90)"
          fill='var(--joy-palette-text-icon)'
        />
      </g>
    </svg>
    </SvgIcon>
  );
}
