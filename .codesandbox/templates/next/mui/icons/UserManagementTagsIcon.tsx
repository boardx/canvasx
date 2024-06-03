import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function UserManagementTagsIcon(props) {
  return (
    <SvgIcon {...props} style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 9.99984L16.59 8.58984L12 13.1698L7.41 8.58984L6 9.99984L12 15.9998L18 9.99984Z"
          fill={props.color}
        />
      </svg>
    </SvgIcon>
  );
}
