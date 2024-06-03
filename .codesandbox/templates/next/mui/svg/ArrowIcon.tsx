import React from "react";
import SvgIcon from "@mui/joy/SvgIcon";

export default function ArrowIcon(props) {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="widgetMenuArrowImgSize"
        viewBox="0 0 6 6"
      >
        <g transform="matrix(0.25,0,0,0.25,0,0)">
          <path
            d="M23.25,7.311,12.53,18.03a.749.749,0,0,1-1.06,0L.75,7.311"
            fill="none"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
        </g>
      </svg>
    </SvgIcon>
  );
}
