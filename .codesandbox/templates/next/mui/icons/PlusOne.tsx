import SvgIcon from "@mui/joy/SvgIcon";
import React from "react";

export default function PlusOne(props) {
  return (
    <span {...props}>
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2_277)">
          <path
            d="M0.5 7.99866C0.5 9.98778 1.29018 11.8954 2.6967 13.302C4.10322 14.7085 6.01088 15.4987 8 15.4987C9.98912 15.4987 11.8968 14.7085 13.3033 13.302C14.7098 11.8954 15.5 9.98778 15.5 7.99866C15.5 6.00953 14.7098 4.10188 13.3033 2.69536C11.8968 1.28883 9.98912 0.498657 8 0.498657C6.01088 0.498657 4.10322 1.28883 2.6967 2.69536C1.29018 4.10188 0.5 6.00953 0.5 7.99866V7.99866Z"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.767 5.18182V11H10.8864V6.0625H10.8523L9.46023 6.97159V6.13068L10.9119 5.18182H11.767Z"
            fill="var(--joy-palette-text-icon)"
          />
          <line
            x1="3"
            y1="8.5"
            x2="8"
            y2="8.5"
            stroke="var(--joy-palette-text-icon)"
          />
          <line
            x1="5.5"
            y1="11"
            x2="5.5"
            y2="6"
            stroke="var(--joy-palette-text-icon)"
          />
        </g>
        <defs>
          <clipPath id="clip0_2_277">
            <rect width="16" height="16" fill="neutral.500" />
          </clipPath>
        </defs>
      </svg>
    </span>
  );
}
