import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function SlideIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 20 20">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke='currentColor'>
        <path d="M10 14.375V19.375" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 14.375L5 19.375" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 14.375L15 19.375" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.5 0.625H2.5C1.80964 0.625 1.25 1.18464 1.25 1.875V13.125C1.25 13.8154 1.80964 14.375 2.5 14.375H17.5C18.1904 14.375 18.75 13.8154 18.75 13.125V1.875C18.75 1.18464 18.1904 0.625 17.5 0.625Z" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.25 4.375H18.75" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </SvgIcon>
  );
}