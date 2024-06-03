import SvgIcon from "@mui/joy/SvgIcon";
import React from "react";

export default function AICloseSearchIcon(props) {
  return (
    <SvgIcon {...props} style={{ height: 12, width: 12 }} viewBox="0 0 12 12">
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_692_3629)">
          <path
            d="M0.375 11.6245L11.625 0.374496"
            stroke="#232930"
            strokeOpacity="0.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.625 11.6245L0.375 0.374496"
            stroke="#232930"
            strokeOpacity="0.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_692_3629">
            <rect width="12" height="12" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  );
}
