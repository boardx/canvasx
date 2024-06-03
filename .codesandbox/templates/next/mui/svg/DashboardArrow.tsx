import React from "react";

export default function DashboardArrow(props: any) {
  return (
    <div {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        style={{ width: 12, height: 12, marginLeft: 8 }}
      >
        <g transform="matrix(1,0,0,1,0,0)">
          <path
            d="M23.25,7.311,12.53,18.03a.749.749,0,0,1-1.06,0L.75,7.311"
            fill="none"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}
