import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function ChatAIDisagreeIcon(props) {
  return (
    <SvgIcon {...props} style={{ width: 18, height: 18 }} viewBox="0 0 18 18">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1_1357)">
          <path
            d="M11.25 2.25H4.5C3.8775 2.25 3.345 2.625 3.12 3.165L0.855 8.4525C0.7875 8.625 0.75 8.805 0.75 9V10.5C0.75 11.325 1.425 12 2.25 12H6.9825L6.27 15.4275L6.2475 15.6675C6.2475 15.975 6.375 16.26 6.5775 16.4625L7.3725 17.25L12.315 12.3075C12.585 12.0375 12.75 11.6625 12.75 11.25V3.75C12.75 2.925 12.075 2.25 11.25 2.25ZM11.25 11.25L7.995 14.505L9 10.5H2.25V9L4.5 3.75H11.25V11.25ZM14.25 2.25H17.25V11.25H14.25V2.25Z"
            fill={props.fill || 'var(--joy-palette-text-icon)'}
            fillOpacity={props.fillOpacity || '0.54'}
          />
        </g>
        <defs>
          <clipPath id="clip0_1_1357">
            <rect width="18" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}
