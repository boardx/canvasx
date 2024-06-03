import SvgIcon from "@mui/joy/SvgIcon";
import React from "react";

export default function AISearchIcon(props) {
  return (
    <SvgIcon {...props} style={{ height: 12, width: 12 }} viewBox="0 0 12 12">
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_692_3573)">
          <path
            d="M0.736011 6.67849C1.20609 7.78457 2.0963 8.65862 3.21081 9.10835C4.32532 9.55807 5.57284 9.54664 6.67892 9.07657C7.78501 8.60649 8.65905 7.71628 9.10878 6.60177C9.55851 5.48726 9.54707 4.23974 9.077 3.13365C8.60693 2.02757 7.71671 1.15353 6.6022 0.703799C5.48769 0.254072 4.24017 0.265503 3.13409 0.735578C2.028 1.20565 1.15396 2.09586 0.704231 3.21038C0.254505 4.32489 0.265936 5.57241 0.736011 6.67849V6.67849Z"
            stroke={props.color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.1105 8.11L11.625 11.625"
            stroke={props.color}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_692_3573">
            <rect width="12" height="12" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}
