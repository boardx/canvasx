import ToggleButton from "@mui/material/ToggleButton";
import showMenu from "./ShowMenu";
import { IconTrash } from "@tabler/icons-react";

export default function Delete({ canvas }: { canvas: any }) {
  const onDelete = (e: any) => {
    e.preventDefault();
    const currentObject = canvas.getActiveObject();
    if (currentObject) {
      canvas.removeWidget(currentObject);
    }
    showMenu(canvas);
  };

  return (
    <div>
      <ToggleButton
        aria-label="bold"
        sx={{ borderRightWidth: 1, borderWidth: "0px", width: 40 }}
        onClick={onDelete}
        selected={false}
        value="backgroundColor"
        style={{ borderWidth: "0px" }}
      >
        <IconTrash stroke={2} fontSize="small" />
        {/* <svg
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth="1.5"
          className="widgetMenuImgSize"
        >
          <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
            <path
              d="M17.25,21H6.75a1.5,1.5,0,0,1-1.5-1.5V6h13.5V19.5A1.5,1.5,0,0,1,17.25,21Z"
              fill="none"
              stroke="var(--joy-palette-text-icon)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            ></path>
            <path
              d="M9.75 16.5L9.75 10.5"
              fill="none"
              stroke="var(--joy-palette-text-icon)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            ></path>
            <path
              d="M14.25 16.5L14.25 10.5"
              fill="none"
              stroke="var(--joy-palette-text-icon)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            ></path>
            <path
              d="M2.25 6L21.75 6"
              fill="none"
              stroke="var(--joy-palette-text-icon)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            ></path>
            <path
              d="M14.25,3H9.75a1.5,1.5,0,0,0-1.5,1.5V6h7.5V4.5A1.5,1.5,0,0,0,14.25,3Z"
              fill="none"
              stroke="var(--joy-palette-text-icon)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            ></path>
          </g>
  </svg>*/}
      </ToggleButton>
    </div>
  );
}
