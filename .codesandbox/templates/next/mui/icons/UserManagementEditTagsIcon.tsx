import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function UserManagementEditTagsIcon(props) {
  return (
    <SvgIcon {...props} style={{ width: 20, height: 20 }} viewBox="0 0 20 20">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.33317 1.66699C2.41234 1.66699 1.6665 2.41283 1.6665 3.33366V13.3337C1.6665 14.2545 2.41234 15.0003 3.33317 15.0003H13.3332C14.254 15.0003 14.9998 14.2545 14.9998 13.3337V3.33366C14.9998 2.41283 14.254 1.66699 13.3332 1.66699H3.33317ZM3.33317 3.33366H13.3332V13.3337H3.33317V3.33366ZM16.6665 5.00033V16.667H4.99984V18.3337H16.6665C17.5873 18.3337 18.3332 17.5878 18.3332 16.667V5.00033H16.6665ZM11.0773 5.24447L7.49984 8.82194L5.58903 6.91113L4.41064 8.08952L7.49984 11.1787L12.2557 6.42285L11.0773 5.24447Z"
          fill={props.color}
        />
      </svg>
    </SvgIcon>
  );
}

