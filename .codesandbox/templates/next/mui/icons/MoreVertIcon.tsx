import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function MoreVertIcon(props) {
  return (
    <SvgIcon {...props} style={{ width: 4, height: 18 }} viewBox="0 0 4 18">
      <svg
        width="4"
        height="18"
        viewBox="0 0 4 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 0C0.448 0 0 0.448 0 1V3C0 3.552 0.448 4 1 4H3C3.552 4 4 3.552 4 3V1C4 0.448 3.552 0 3 0H1ZM1 7C0.448 7 0 7.448 0 8V10C0 10.552 0.448 11 1 11H3C3.552 11 4 10.552 4 10V8C4 7.448 3.552 7 3 7H1ZM1 14C0.448 14 0 14.448 0 15V17C0 17.552 0.448 18 1 18H3C3.552 18 4 17.552 4 17V15C4 14.448 3.552 14 3 14H1Z"
          fill="var(--joy-palette-text-icon)"
        />
      </svg>
    </SvgIcon>
  );
}
