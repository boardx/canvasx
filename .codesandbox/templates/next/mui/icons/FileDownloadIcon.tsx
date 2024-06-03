import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function FileDownloadIcon(props) {
  return (
    <SvgIcon {...props} style={{ height: 16, width: 16 }} viewBox="0 0 16 16">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.00067 2.5V10.5"
          stroke="var(--joy-palette-text-icon)" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.00067 7.5L8.00067 10.5L11.0007 7.5"
          stroke="var(--joy-palette-text-icon)" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.5007 10.5V11.5C15.5007 12.0304 15.29 12.5391 14.9149 12.9142C14.5398 13.2893 14.0311 13.5 13.5007 13.5H2.50067C1.97024 13.5 1.46153 13.2893 1.08646 12.9142C0.711385 12.5391 0.500671 12.0304 0.500671 11.5V10.5"
          stroke="var(--joy-palette-text-icon)" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
}
