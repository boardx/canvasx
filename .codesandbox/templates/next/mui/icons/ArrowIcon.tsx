import SvgIcon from "@mui/joy/SvgIcon";
import React from "react";

export default function ArrowIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 30 30">
      <svg
        fill="none"
        height="30"
        viewBox="0 0 30 30"
        width="30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.9351 8.40784L3.96448 25.3784"
          stroke="#232930"
          strokeWidth="9"
        />
        <path
          d="M22.2071 6.79293L20.268 13.5947L15.4053 8.73206L22.2071 6.79293Z"
          fill="#232930"
          stroke="#232930"
          strokeWidth="8"
        />
      </svg>
    </SvgIcon>
  );
}
