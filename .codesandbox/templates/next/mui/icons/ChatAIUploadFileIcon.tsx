import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function ChatAIUploadFileIcon(props) {
  return (
    <SvgIcon
      {...props}
      style={{ width: '20px', height: '20px' }}
      viewBox="0 0 20 20"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 4C9.3832 4 4 9.3832 4 16C4 22.6168 9.3832 28 16 28C22.6168 28 28 22.6168 28 16C28 9.3832 22.6168 4 16 4ZM10 17.5C9.172 17.5 8.5 16.828 8.5 16C8.5 15.172 9.172 14.5 10 14.5C10.828 14.5 11.5 15.172 11.5 16C11.5 16.828 10.828 17.5 10 17.5ZM16 17.5C15.172 17.5 14.5 16.828 14.5 16C14.5 15.172 15.172 14.5 16 14.5C16.828 14.5 17.5 15.172 17.5 16C17.5 16.828 16.828 17.5 16 17.5ZM22 17.5C21.172 17.5 20.5 16.828 20.5 16C20.5 15.172 21.172 14.5 22 14.5C22.828 14.5 23.5 15.172 23.5 16C23.5 16.828 22.828 17.5 22 17.5Z"
          fill="var(--joy-palette-text-icon)"
        />
      </svg>
    </SvgIcon>
  );
}
