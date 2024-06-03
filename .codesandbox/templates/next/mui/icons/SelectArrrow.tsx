import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function ArrowIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 30 30">
      <svg
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.5 1.37402L8.35333 8.52002C8.30696 8.56647 8.25188 8.60331 8.19125 8.62845C8.13062 8.65359 8.06563 8.66653 8 8.66653C7.93437 8.66653 7.86938 8.65359 7.80875 8.62845C7.74812 8.60331 7.69304 8.56647 7.64667 8.52002L0.5 1.37402"
          stroke="var(--joy-palette-text-icon)" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
}
