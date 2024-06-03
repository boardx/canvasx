import SvgIcon from "@mui/joy/SvgIcon";
import React from "react";

export default function NavigateIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24">
      <svg
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="none" height="24" width="24" />
        <path
          d="M7.39953 20.3785L7.05572 4.56314C7.03592 3.65225 8.14516 3.19157 8.77649 3.84848L19.701 15.2157C20.3134 15.8528 19.8589 16.9129 18.9752 16.9086L13.1496 16.8807C12.8554 16.8793 12.5756 17.0075 12.3845 17.2312L9.15964 21.0063C8.56305 21.7047 7.4195 21.2968 7.39953 20.3785Z"
          fill={props.strokeColor}
          stroke={props.strokeColor}
        />
      </svg>
    </SvgIcon>
  );
}
