import React from 'react';

export default function DrawingIcon(props) {
  return (
    <div {...props} >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        strokeWidth="1.5"
        className="menuImgSize"
      >
        <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
          <path
            d="M22.19,1.81a3.639,3.639,0,0,0-5.17.035l-14.5,14.5L.75,23.25l6.905-1.771,14.5-14.5A3.637,3.637,0,0,0,22.19,1.81Z"
            fill="none"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M16.606 2.26L21.74 7.394"
            fill="none"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M2.521 16.344L7.66 21.474"
            fill="none"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}


