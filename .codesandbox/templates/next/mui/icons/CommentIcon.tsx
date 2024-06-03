import React from 'react';
import SvgIcon from '@mui/joy/SvgIcon';

export default function CommentIcon(props) {
  const { size } = props;
  return (
    <SvgIcon
      {...props}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.125 15.625H9.375L4.375 19.375V15.625H1.875C1.54348 15.625 1.22554 15.4933 0.991117 15.2589C0.756696 15.0245 0.625 14.7065 0.625 14.375V1.875C0.625 1.54348 0.756696 1.22554 0.991117 0.991117C1.22554 0.756696 1.54348 0.625 1.875 0.625H18.125C18.4565 0.625 18.7745 0.756696 19.0089 0.991117C19.2433 1.22554 19.375 1.54348 19.375 1.875V14.375C19.375 14.7065 19.2433 15.0245 19.0089 15.2589C18.7745 15.4933 18.4565 15.625 18.125 15.625Z" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.375 6.25H15.625" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.375 10H13.125" stroke="var(--joy-palette-text-icon)"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </SvgIcon>
  );
}