import React from 'react';

interface Props {
  color: string;
}

export const StickyNoteSmallSvg = (props: Props) => {
  const { color } = props;

  return (
    <svg
      className="svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M48 0H0V38.4L9.6 48H48V0Z"
        style={{ stroke: 'none' }}
        fill={color}
        fillOpacity="0.69"
      />
      <path
        d="M0 38.4H9.6V48L0 38.4Z"
        style={{ stroke: 'none' }}
        fill={color}
        fillOpacity="0.69"
      />
    </svg>
  );
};

export const StickyNoteLargeSvg = (props: Props) => {
  const { color } = props;

  return (
    <svg
      className="svg"
      width="60"
      height="52"
      viewBox="0 0 78 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M77.9086 3.95117L2.51208 -0.000198364L0.502384 38.3472L9.5868 48.4364L75.3965 51.8854L77.9086 3.95117Z"
        fill={color}
        fillOpacity="0.69"
        style={{ stroke: 'none' }}
      />
      <path
        d="M0.502384 38.3472L10.0892 38.8496L9.5868 48.4364L0.502384 38.3472Z"
        fill="grey"
        fillOpacity="0.69"
        style={{ stroke: 'none' }}
      />
    </svg>
  );
};

export const StickyNoteCicleSvg = (props: Props) => {
  const { color } = props;

  return (
    <svg
      className="svg"
      width="45"
      height="40"
      viewBox="0 0 52 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_1090_241)">
        <path
          d="M26 5C14.5125 5 5.19999 14.0121 5.19999 25.129L26 45.2581C37.4875 45.2581 46.8 36.246 46.8 25.129C46.8 14.0121 37.4875 5 26 5Z"
          fill={color}
          fillOpacity="0.2"
          style={{ stroke: 'none' }}
        />
      </g>
      <path
        d="M26 6.54839C12.7452 6.54839 2 16.9469 2 29.7742L26 53C39.2548 53 50 42.6015 50 29.7742C50 16.9469 39.2548 6.54839 26 6.54839Z"
        fill={color}
        fillOpacity="1"
        style={{ stroke: 'none' }}
      />
      <path
        d="M2 29.7742C15.2548 29.7742 26 40.1727 26 53L2 29.7742Z"
        fill="grey"
        fillOpacity="0.6"
        style={{ stroke: 'none' }}
      />
      <defs>
        <filter
          id="filter0_f_1090_241"
          x="0.200012"
          y="0"
          width="51.6"
          height="50.2581"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="2.5"
            result="effect1_foregroundBlur_1090_241"
          />
        </filter>
      </defs>
    </svg>
  );
};

export const SmallNoteSvg = (props: Props) => {
  const { color } = props;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 0H0V19.2L4.8 24H24V0Z"
        style={{ stroke: 'none' }}
        fill={color}
        fillOpacity="0.51"
      />
      <path
        d="M0 19.2H4.8V24L0 19.2Z"
        style={{ stroke: 'none' }}
        fill={color}
        fillOpacity="0.51"
      />
    </svg>
  );
};

export const LagerNoteSvg = (props: Props) => {
  const { color } = props;

  return (
    <svg
      width="35"
      height="24"
      viewBox="0 0 35 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M35 0H0V19.2L4.66667 24H35V0Z"
        style={{ stroke: 'none' }}
        fill={color}
        fillOpacity="0.51"
      />
      <path
        d="M0 19.2H4.66667V24L0 19.2Z"
        style={{ stroke: 'none' }}
        fill={color}
        fillOpacity="0.51"
      />
    </svg>
  );
};

export const CircleNoteSvg = (props: Props) => {
  const { color } = props;

  return (
    <svg
      width="31"
      height="32"
      viewBox="0 0 31 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_1094_207)">
        <path
          d="M25.9999 16C25.9999 21.7438 21.4938 26.4 15.9354 26.4L5.87085 16C5.87085 10.2562 10.3769 5.60001 15.9354 5.60001C21.4938 5.60001 25.9999 10.2562 25.9999 16Z"
          fill={color}
          fillOpacity="0.1"
          style={{ stroke: 'none' }}
        />
      </g>
      <path
        d="M25.2258 16C25.2258 22.6274 20.0265 28 13.6129 28L2 16C2 9.37258 7.19927 4 13.6129 4C20.0265 4 25.2258 9.37258 25.2258 16Z"
        fill={color}
        fillOpacity="0.51"
        style={{ stroke: 'none' }}
      />
      <path
        d="M13.6129 28C13.6129 21.3726 8.41363 16 2 16L13.6129 28Z"
        fill={color}
        fillOpacity="0.15"
        style={{ stroke: 'none' }}
      />
      <defs>
        <filter
          id="filter0_f_1094_207"
          x="0.87085"
          y="0.600006"
          width="30.1292"
          height="30.8"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="2.5"
            result="effect1_foregroundBlur_1094_207"
          />
        </filter>
      </defs>
    </svg>
  );
};

export const DrawSvg = ({color}) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_828_4697)">
        <g  >
          <path
            d="M29.6614 56.702L29.6614 359.412C29.6614 364.703 25.3719 368.993 20.0807 368.993C14.7894 368.993 10.4999 364.703 10.4999 359.412L10.4999 56.6228C10.4999 45.3425 11.7218 34.0954 14.1441 23.0782H25.6645C28.3197 34.089 29.6614 45.3756 29.6614 56.702Z"
            fill="url(#paint0_linear_828_4697)"
          />
          <path
            d="M21.8825 5.55664L25.547 22.7205H14.2617L18.0365 5.5451C18.2348 4.64273 19.0343 3.99988 19.9582 3.99988C20.8866 3.99988 21.6886 4.64877 21.8825 5.55664Z"
            fill="url(#paint1_linear_828_4697)"
          />
          <g filter="url(#filter1_dd_828_4697)">
            <path
              d="M29.6614 56.702L29.6614 359.412C29.6614 364.703 25.3719 368.993 20.0807 368.993C14.7894 368.993 10.4999 364.703 10.4999 359.412L10.4999 56.6228C10.4999 45.3425 11.7218 34.0954 14.1441 23.0782H25.6645C28.3197 34.089 29.6614 45.3756 29.6614 56.702Z"
              fill="url(#paint2_linear_828_4697)"
            />
            <path
              d="M21.8825 5.55664L25.547 22.7205H14.2617L18.0365 5.5451C18.2348 4.64273 19.0343 3.99988 19.9582 3.99988C20.8866 3.99988 21.6886 4.64877 21.8825 5.55664Z"
              fill={color}
            />
          </g>
          <path
            d="M23.7837 22.7204V23.0781H16.0251V22.7204H23.7837Z"
            fill="#C4C4C4"
          />
          <rect
            x="24.2538"
            y="355.199"
            width="8.46395"
            height="325.763"
            rx="4.23197"
            transform="rotate(-180 24.2538 355.199)"
            fill="url(#paint4_linear_828_4697)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_dd_828_4697"
          x="-28.1538"
          y="2"
          width="61.8152"
          height="379.559"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0823529 0 0 0 0 0.0823529 0 0 0 0 0.0823529 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_828_4697"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0823529 0 0 0 0 0.0823529 0 0 0 0 0.0823529 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_828_4697"
            result="effect2_dropShadow_828_4697"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_828_4697"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_dd_828_4697"
          x="6.49994"
          y="2"
          width="27.1614"
          height="372.993"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0823529 0 0 0 0 0.0823529 0 0 0 0 0.0823529 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_828_4697"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0823529 0 0 0 0 0.0823529 0 0 0 0 0.0823529 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_828_4697"
            result="effect2_dropShadow_828_4697"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_828_4697"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_828_4697"
          x1="29.6614"
          y1="323.562"
          x2="10.3824"
          y2="323.562"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.604167" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="#DEDEDE" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_828_4697"
          x1="29.6614"
          y1="323.562"
          x2="10.3824"
          y2="323.562"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.604167" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="#DEDEDE" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_828_4697"
          x1="19.329"
          y1="37.6611"
          x2="18.9898"
          y2="3.99456"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FAFAFA" />
          <stop offset="0.436952" stopColor="#F4F4F4" />
          <stop offset="0.444176" stopColor="#3D3D3D" />
          <stop offset="1" stopColor="#1C1C1C" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_828_4697"
          x1="19.329"
          y1="37.6611"
          x2="18.9898"
          y2="3.99456"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FAFAFA" />
          <stop offset="0.436952" stopColor="#F4F4F4" />
          <stop offset="0.444176" stopColor="#3D3D3D" />
          <stop offset="1" stopColor="#1C1C1C" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_828_4697"
          x1="24.2538"
          y1="545.267"
          x2="32.7178"
          y2="545.267"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F7F7F7" />
          <stop offset="1" stopColor="#F0F0F0" />
        </linearGradient>
        <clipPath id="clip0_828_4697">
          <rect width="40" height="40" rx="4" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ArrowSvg = () => {
  return (
    <svg
      className="svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.25 5.72967L3.82333 2.15667C3.84652 2.13345 3.87406 2.11503 3.90437 2.10246C3.93469 2.08989 3.96718 2.08342 4 2.08342C4.03282 2.08342 4.06531 2.08989 4.09563 2.10246C4.12594 2.11503 4.15348 2.13345 4.17667 2.15667L7.75 5.72967"
        stroke="var(--joy-palette-text-icon)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CursorSvg = () => {
  return (
    <svg
      className="svg"
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <g>
          <path
            d="M17.86,5.57A1.61,1.61,0,0,1,19.47,4h0a1.6,1.6,0,0,1,1.6,1.61V17.76a5.47,5.47,0,0,1-1.6,3.88h0a5.5,5.5,0,0,1-3.88,1.61H12.46a6.42,6.42,0,0,1-5.35-2.86L3.2,14.52a1.65,1.65,0,0,1,0-1.83h0a1.65,1.65,0,0,1,2.4-.37l2.62,2.09V4a1.6,1.6,0,0,1,1.6-1.6h0A1.61,1.61,0,0,1,11.43,4V2.36A1.61,1.61,0,0,1,13,.75h0a1.61,1.61,0,0,1,1.61,1.61V4a1.6,1.6,0,0,1,1.6-1.6h0A1.61,1.61,0,0,1,17.86,4Z"
            stroke= 'var(--joy-palette-text-icon)'
            style={{
              fill: 'none',
              
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: '1.5px',
            }}
          />
          <line
            x1="11.43"
            y1="3.96"
            x2="11.43"
            y2="10.39"
            stroke='var(--joy-palette-text-icon)'
            style={{
              fill: 'none',
             
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: '1.5px',
            }}
          />
          <line
            x1="14.65"
            y1="3.96"
            x2="14.65"
            y2="10.39"
            stroke='var(--joy-palette-text-icon)'
            style={{
              fill: 'none',
          
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: '1.5px',
            }}
          />
          <line
            x1="17.86"
            y1="10.39"
            x2="17.86"
            y2="5.57"
            stroke='var(--joy-palette-text-icon)'
            style={{
              fill: 'none',
          
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: '1.5px',
            }}
          />
        </g>
      </g>
    </svg>
  );
};

export const TextSvg = () => {
  return (
    <svg
      className="svg"
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path
          d="M1.5,3.748V3A2.25,2.25,0,0,1,3.75.748h16.5A2.25,2.25,0,0,1,22.5,3v.75"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M12 0.748L12 23.248"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          style={{ stroke: 'none' }}
        />
        <path
          d="M7.5 23.248L16.5 23.248"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          style={{ stroke: 'none' }}
        />
      </g>
    </svg>
  );
};

export const ShapeSvg = () => {
  return (
    <svg
      className="svg"
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path
          style={{
            fill: 'none',
            stroke: 'var(--joy-palette-text-icon)',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '1.5p',
          }}
          d="M21.8,17.583V6.425a1.545,1.545,0,0,0-.854-1.383L12.691.913a1.546,1.546,0,0,0-1.381,0L3.052,5.033A1.545,1.545,0,0,0,2.2,6.416V17.575a1.545,1.545,0,0,0,.854,1.383l8.258,4.129a1.548,1.548,0,0,0,1.382,0l8.257-4.121A1.545,1.545,0,0,0,21.8,17.583Z"
        />
      </g>
    </svg>
  );
};

export const LineSvg = () => {
  return (
    <svg
      className="svg"
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <circle
          style={{
            fill: 'none',
            stroke: 'var(--joy-palette-text-icon)',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '1.5px',
          }}
          cx="3.75"
          cy="20.25"
          r="3"
        />
        <circle
          style={{
            fill: 'none',
            stroke: 'var(--joy-palette-text-icon)',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '1.5px',
          }}
          cx="20.25"
          cy="3.75"
          r="3"
        />
        <line
          style={{
            fill: 'none',
            stroke: 'var(--joy-palette-text-icon)',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '1.5px',
          }}
          x1="5.92"
          y1="18.179"
          x2="18.132"
          y2="5.875"
        />
      </g>
    </svg>
  );
};

export const TempSvg = () => {
  return (
    <svg
      className="svg"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
    >
      <path
        d="M64 127.712C64 92.512 92.864 64 128.288 64h255.424C419.232 64 448 92.8 448 127.712V896.32c0 35.2-28.864 63.712-64.288 63.712H128.32C92.768 960 64 931.2 64 896.288V127.68z m64 32.32v703.936c0 17.728 14.272 32.032 31.904 32.032h192.192c17.408 0 31.904-14.336 31.904-32V160c0-17.696-14.272-32-31.904-32H159.904C142.496 128 128 142.336 128 160z m384-31.744C512 92.768 540.704 64 576.192 64h319.616C931.264 64 960 92.864 960 128.288v255.424c0 35.52-28.704 64.288-64.192 64.288h-319.616A64.288 64.288 0 0 1 512 383.712V128.32z m64 31.616v192.192a32 32 0 0 0 31.84 31.904h256.32c17.28 0 31.84-14.272 31.84-31.904V159.904A32 32 0 0 0 864.16 128h-256.32c-17.28 0-31.84 14.272-31.84 31.904z m-64 416.288c0-35.456 28.704-64.192 64.192-64.192h319.616c35.456 0 64.192 28.704 64.192 64.192v319.616A64.16 64.16 0 0 1 895.808 960h-319.616A64.16 64.16 0 0 1 512 895.808v-319.616z m64 31.68v256.288c0 17.28 14.272 31.84 31.84 31.84h256.32c17.28 0 31.84-14.272 31.84-31.84v-256.32c0-17.28-14.272-31.84-31.84-31.84h-256.32c-17.28 0-31.84 14.272-31.84 31.84z"
        fill="#333333"
        p-id="2367"
        style={{ stroke: 'none' }}
      ></path>
    </svg>
  );
};

export const UploadSvg = () => {
  return (
    <svg
      className="svg"
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path
          d="M12.001 15.75L12.001 3.75"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          style={{ stroke: 'none' }}
        ></path>
        <path
          d="M16.501 8.25L12.001 3.75 7.501 8.25"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          style={{ stroke: 'none' }}
        ></path>
        <path
          d="M23.251,15.75v1.5a3,3,0,0,1-3,3H3.751a3,3,0,0,1-3-3v-1.5"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          style={{ stroke: 'none' }}
        ></path>
      </g>
    </svg>
  );
};
