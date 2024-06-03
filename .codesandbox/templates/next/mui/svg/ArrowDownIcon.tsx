import React from "react";

export default function ArrowDownIcon(props) {
  const { size } = props;
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 6 6"
      style={{ width: "6px", height: "6px", transform: "rotate(180deg)" }}
    >
      <path
        d="M0.1875 4.17224L2.8675 1.49249C2.88489 1.47507 2.90555 1.46126 2.92828 1.45183C2.95102 1.4424 2.97539 1.43755 3 1.43755C3.02461 1.43755 3.04898 1.4424 3.07172 1.45183C3.09445 1.46126 3.11511 1.47507 3.1325 1.49249L5.8125 4.17224"
        stroke="currentColor"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
