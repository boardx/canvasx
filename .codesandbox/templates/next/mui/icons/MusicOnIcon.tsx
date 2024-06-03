import SvgIcon from "@mui/joy/SvgIcon";
import React from "react";

export default function MusicOnIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <svg
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" fill="#F7F6F3" r="10" />
        <path
          clipRule="evenodd"
          d="M12.5063 13.4688L12.5 6.875H16.25V9.375H13.75V15.625C13.75 17.0063 12.6438 18.125 11.2563 18.125C9.86875 18.125 8.75 17.0063 8.75 15.625C8.75 14.2438 9.86875 13.125 11.2563 13.125C11.7125 13.125 12.1375 13.2562 12.5063 13.4688ZM10.0063 15.625C10.0063 16.3125 10.5688 16.875 11.2563 16.875C11.9438 16.875 12.5063 16.3125 12.5063 15.625C12.5063 14.9375 11.9438 14.375 11.2563 14.375C10.5688 14.375 10.0063 14.9375 10.0063 15.625Z"
          fill="black"
          fillOpacity="0.54"
          fillRule="evenodd"
        />
      </svg>
    </SvgIcon>
  );
}
