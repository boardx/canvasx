import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function UserManagementFilterIcon(props) {
  return (
    <SvgIcon {...props} style={{ width: 18, height: 18 }} viewBox="0 0 18 18">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_10607_168478)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.4444 3.69444C10.4444 3.31091 10.1335 3 9.75 3C9.36647 3 9.05556 3.31091 9.05556 3.69444V8.55556H4.19444C3.81091 8.55556 3.5 8.86647 3.5 9.25C3.5 9.63353 3.81091 9.94444 4.19444 9.94444H9.05556V14.8056C9.05556 15.1891 9.36647 15.5 9.75 15.5C10.1335 15.5 10.4444 15.1891 10.4444 14.8056V9.94444H15.3056C15.6891 9.94444 16 9.63353 16 9.25C16 8.86647 15.6891 8.55556 15.3056 8.55556H10.4444V3.69444Z"
            fill={props.color}
          />
        </g>
        <defs>
          <clipPath id="clip0_10607_168478">
            <rect width="18" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}
