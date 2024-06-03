import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function PolygonIcon(props) {
  return (
    <SvgIcon {...props}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5455 16H1L3.45455 4H19L16.5455 16Z" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" />
      </svg>
    </SvgIcon>
  );
}
