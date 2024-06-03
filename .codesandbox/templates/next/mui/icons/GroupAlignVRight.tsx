import SvgIcon from "@mui/joy/SvgIcon";
import React from "react";

export default function GroupAlignVRight(props) {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        strokeWidth="1.5"
        className="widgetMenuImgSize"
      >
        <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
          <title>align-right</title>
          <rect
            className="a"
            x="0.75"
            y="14.25"
            width="19.5"
            height="6.018"
            rx="1"
            ry="1"
            transform="translate(21 34.518) rotate(-180)"
          />
          <rect
            className="a"
            x="9"
            y="3.732"
            width="11.25"
            height="6.018"
            rx="1"
            ry="1"
            transform="translate(29.25 13.482) rotate(-180)"
          />
          <line className="a" x1="23.25" y1="0.75" x2="23.25" y2="23.25" />
        </g>
      </svg>
    </SvgIcon>
  );
}
