import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function GroupAlignVCenter(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      strokeWidth="1.5"
      className="widgetMenuImgSize"
    >
      <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
        <title>align-center</title>
        <line className="a" x1="12" y1="20.25" x2="12" y2="23.25" />
        <line className="a" x1="12" y1="9.75" x2="12" y2="14.25" />
        <line className="a" x1="12" y1="0.75" x2="12" y2="3.75" />
        <rect
          className="a"
          x="2.25"
          y="14.25"
          width="19.5"
          height="6"
          rx="1"
          ry="1"
        />
        <rect
          className="a"
          x="5.25"
          y="3.75"
          width="13.5"
          height="6"
          rx="1"
          ry="1"
        />
      </g>
    </svg>
  );
}
