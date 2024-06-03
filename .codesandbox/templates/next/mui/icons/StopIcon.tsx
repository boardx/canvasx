import SvgIcon from "@mui/joy/SvgIcon";
import React from "react";

export default function StopIcon(props) {
  return (
    <span {...props}>
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2_285)">
          <path
            d="M0.5 7.99866C0.5 9.98778 1.29018 11.8954 2.6967 13.302C4.10322 14.7085 6.01088 15.4987 8 15.4987C9.98912 15.4987 11.8968 14.7085 13.3033 13.302C14.7098 11.8954 15.5 9.98778 15.5 7.99866C15.5 6.00953 14.7098 4.10188 13.3033 2.69536C11.8968 1.28883 9.98912 0.498657 8 0.498657C6.01088 0.498657 4.10322 1.28883 2.6967 2.69536C1.29018 4.10188 0.5 6.00953 0.5 7.99866V7.99866Z"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 5.49866H10.5V10.4987H5.5V5.49866Z"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_2_285">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </span>
  );
}
