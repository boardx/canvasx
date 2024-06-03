import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function PolygonIcon(props) {
  return (
    <SvgIcon {...props} >
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M21 22H1V2L21 22Z" fill="#F2F2F3" stroke="#232930" />
      </svg>
    </SvgIcon>
  );
}
