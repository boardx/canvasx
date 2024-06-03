import SvgIcon from "@mui/joy/SvgIcon";
import React from "react";

export default function PlayIcon(props) {
  return (
    <span {...props}>
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2_267)">
          <path
            d="M8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5Z"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.00002 10.4067C5.99884 10.6165 6.05841 10.8221 6.17154 10.9988C6.28467 11.1755 6.44652 11.3156 6.63755 11.4023C6.82858 11.489 7.04063 11.5186 7.24809 11.4874C7.45555 11.4562 7.64956 11.3657 7.80668 11.2267L10.9267 8.50001C10.9976 8.43745 11.0544 8.36051 11.0934 8.27431C11.1323 8.1881 11.1524 8.0946 11.1524 8.00001C11.1524 7.90543 11.1323 7.81193 11.0934 7.72572C11.0544 7.63952 10.9976 7.56258 10.9267 7.50001L7.80668 4.76668C7.64862 4.63059 7.45493 4.54255 7.24846 4.51296C7.042 4.48336 6.83138 4.51344 6.64145 4.59964C6.45152 4.68584 6.29021 4.82458 6.17656 4.99947C6.0629 5.17436 6.00165 5.37811 6.00002 5.58668V10.4067Z"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_2_267">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </span>
  );
}
