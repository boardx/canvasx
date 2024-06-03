import SvgIcon from "@mui/joy/SvgIcon";
import React from "react";

export default function PanelIcon(props) {
  // fill="#757575"
  return (
    <SvgIcon fill={props.panelIconColor} viewBox="0 0 24 24">
      <svg
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          fill={props.panelIconColor}
          height="2"
          rx="1"
          width="19"
          x="3"
          y="5"
        />
        <rect
          fill={props.panelIconColor}
          height="2"
          rx="1"
          width="19"
          x="3"
          y="16"
        />
        <rect
          fill={props.panelIconColor}
          height="2"
          rx="1"
          transform="rotate(90 8 2)"
          width="19"
          x="8"
          y="2"
        />
        <rect
          fill={props.panelIconColor}
          height="2"
          rx="1"
          transform="rotate(90 19 2)"
          width="19"
          x="19"
          y="2"
        />
      </svg>
    </SvgIcon>
  );
}
