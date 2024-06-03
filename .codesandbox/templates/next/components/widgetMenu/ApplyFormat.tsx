import React from "react";
import ToggleButton from "@mui/material/ToggleButton";



export default function ApplyFormat({ canvas }: { canvas: any }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const canvas: any = BoardService.getInstance().getBoard();
  const [] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickApplyFormat = (e: any) => {
    e.preventDefault();
    const object = canvas.getActiveObject();

    const { scaleX, scaleY, backgroundColor, fill, fontFamily, fontSize } =
      canvas.defaultNote;

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    // if (!object) {
    //   return $("#notesMenu").hide();
    // }

    if (!group) {
      object.set({
        scaleX,
        scaleY,
        backgroundColor,
        fill,
        fontFamily,
        fontSize,
      });
      // object.saveData("MODIFIED", [
      //   "scaleX",
      //   "scaleY",
      //   "backgroundColor",
      //   "fill",
      //   "fontFamily",
      //   "fontSize",
      // ]);
    } else {
      group._objects.forEach((obj: any) => {
        obj.set({
          scaleX,
          scaleY,
          backgroundColor,
          fill,
          fontFamily,
          fontSize,
        });
      });
      group.saveData("MODIFIED", [
        "scaleX",
        "scaleY",
        "backgroundColor",
        "fill",
        "fontFamily",
        "fontSize",
      ]);
    }
    canvas.requestRenderAll();

    if (canvas.getActiveObject().hiddenTextarea)
      canvas.getActiveObject().hiddenTextarea.focus();
  };

  return (
    <div>
      <ToggleButton
        aria-label="bold"
        sx={{ borderRightWidth: 1, width: 40 }}
        onClick={onClickApplyFormat}
        selected={false}
        value="backgroundColor"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          strokeWidth="1.5"
          className="widgetMenuImgSize"
        >
          <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
            <title>color-rolling-brush</title>
            <rect
              className="a"
              x="4.125"
              y="0.75"
              width="16.5"
              height="7.5"
              rx="1.5"
              ry="1.5"
            />
            <path
              className="a"
              d="M4.125,4.5h-1.5A1.5,1.5,0,0,0,1.125,6V9.75a1.5,1.5,0,0,0,1.5,1.5h8.25a1.5,1.5,0,0,1,1.5,1.5v1.5"
            />
            <path
              className="a"
              d="M13.125,23.25h-1.5a1.5,1.5,0,0,1-1.5-1.5V16.5a2.25,2.25,0,0,1,2.25-2.25h0a2.25,2.25,0,0,1,2.25,2.25v5.25A1.5,1.5,0,0,1,13.125,23.25Z"
            />
            <line className="a" x1="20.625" y1="4.5" x2="22.875" y2="4.5" />
          </g>
        </svg>
      </ToggleButton>
    </div>
  );
}
