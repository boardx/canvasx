import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function GroupAlignVLeft(props) {
  return (
    <SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      strokeWidth="1.5"
      className="widgetMenuImgSize"
    >
      <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
        <title>align-left</title>
        <rect
          className="a"
          x="3.75"
          y="14.25"
          width="19.5"
          height="6.018"
          rx="1"
          ry="1"
        />
        <rect
          className="a"
          x="3.75"
          y="3.732"
          width="11.25"
          height="6.018"
          rx="1"
          ry="1"
        />
        <line className="a" x1="0.75" y1="0.75" x2="0.75" y2="23.25" />
      </g>
    </svg>
    </SvgIcon>
  );
}
