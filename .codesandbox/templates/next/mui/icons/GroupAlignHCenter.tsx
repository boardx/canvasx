import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function GroupAlignHCenter(props) {
  return (
    <SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      strokeWidth="1.5"
      className="widgetMenuImgSize"
    >
      <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
        <title>align-middle</title>
        <line className="a" x1="3.75" y1="12" x2="0.75" y2="12" />
        <line className="a" x1="14.25" y1="12" x2="9.75" y2="12" />
        <line className="a" x1="23.25" y1="12" x2="20.25" y2="12" />
        <rect
          className="a"
          x="-3"
          y="9"
          width="19.5"
          height="6"
          rx="1"
          ry="1"
          transform="translate(18.75 5.25) rotate(90)"
        />
        <rect
          className="a"
          x="10.5"
          y="9"
          width="13.5"
          height="6"
          rx="1"
          ry="1"
          transform="translate(29.25 -5.25) rotate(90)"
        />
      </g>
    </svg>
    </SvgIcon>
  );
}
