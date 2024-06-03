import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function LineIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 30 30">
      <svg
        fill="none"
        height="30"
        viewBox="0 0 30 30"
        width="30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          stroke="#232930"
          strokeWidth="1.5"
          x1="1.32854"
          x2="25.257"
          y1="25.2571"
          y2="1.32863"
        />
      </svg>
    </SvgIcon>
  );
}
