import SvgIcon from '@mui/joy/SvgIcon';
import React from 'react';

export default function SendMsgIcon(props) {
  return (
    <SvgIcon
      {...props}
      style={{ width: '32px', height: '32px' }}
      viewBox="0 0 32 32"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 4C9.3868 4 4 9.3868 4 16C4 22.6132 9.3868 28 16 28C22.6132 28 28 22.6132 28 16C28 9.3868 22.6132 4 16 4ZM16 6.4C21.3161 6.4 25.6 10.6839 25.6 16C25.6 21.3161 21.3161 25.6 16 25.6C10.6839 25.6 6.4 21.3161 6.4 16C6.4 10.6839 10.6839 6.4 16 6.4ZM16 9.50313L10.3516 15.1516L12.0484 16.8484L14.8 14.0969V22H17.2V14.0969L19.9516 16.8484L21.6484 15.1516L16 9.50313Z"
          fill={props.color || '#F21D6B'}
        />
      </svg>
    </SvgIcon>
  );
}
