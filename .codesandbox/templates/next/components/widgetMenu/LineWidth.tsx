
import React, { useEffect } from "react";
import Slider from "@mui/joy/Slider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import store from "../../redux/store";
import { handleSetArrowSize } from "../../redux/features/widgets.slice";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import SvgIcon from "@mui/joy/SvgIcon";


const PrettoSlider = Slider;

const lineThinWidth = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="widgetMenuImgSize"
  >
    <rect y="7" width="16" height="1.5" fill="#150D33" />
  </svg>
);

const lineMidWidth = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="widgetMenuImgSize"
  >
    <rect y="5.5" width="16" height="3" fill="#150D33" />
  </svg>
);

const lineThickWidth = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="widgetMenuImgSize"
  >
    <rect y="4" width="16" height="6" fill="#150D33" />
  </svg>
);

export default function LineWidth({
  paddingLeft,
  paddingRight,
  canvas
}: {
  paddingLeft: number;
  paddingRight: number;
  canvas: any
}) {
  //
  // const canvas: any = BoardService.getInstance().getBoard();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [widthValue, setWidthValue] = React.useState(null);

  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.objType == "XShapeNotes") {
    const lineWidth = canvas.getActiveObject().lineWidth;

    useEffect(() => {
      setWidthValue(lineWidth);
    }, [lineWidth]);
  } else {
    const strokeWidth = canvas.getActiveObject()
      ? canvas.getActiveObject().strokeWidth
      : 4;

    useEffect(() => {
      setWidthValue(strokeWidth);
    }, [strokeWidth]);
  }

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getwidthchanged = (e: any) => {
    const object = canvas.getActiveObject();
    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) {
      if (object.objType === "XShapeNotes") {
        object.saveData("MODIFIED", ["fixedLineWidth", "lineWidth"]);
      } else {
        object.saveData("MODIFIED", ["strokeWidth"]);
      }
    } else {
      group.saveData("MODIFIED", ["strokeWidth"]);
    }
    canvas.requestRenderAll();
  };

  const onChangeLineWidth = (e: any, value: any) => {
    setWidthValue(value);

    const object = canvas.getActiveObject();

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    // if (!object) {
    //   return $("#notesMenu").hide();
    // }

    const arrowLineWidth = value;
    localStorage.setItem("arrowLineWidth", arrowLineWidth);

    if (!group) {
      if (
        canvas &&
        canvas.getActiveObject() &&
        canvas.getActiveObject().objType === "XRectNotes"
      ) {
        if (
          canvas &&
          canvas.notesDrawCanvas &&
          canvas.notesDrawCanvas.freeDrawingBrush
        ) {
          canvas.notesDrawCanvas.freeDrawingBrush.width = arrowLineWidth;
        }
      } else {
        if (object.objType === "XShapeNotes") {
          object.set("fixedLineWidth", arrowLineWidth);
          object.set("lineWidth", arrowLineWidth / object.scaleX);
          object.set("dirty", true);
        } else if (object.objType === "XConnector") {
          object.set("strokeWidth", arrowLineWidth);
          store.dispatch(handleSetArrowSize(arrowLineWidth));
        } else object.set("strokeWidth", arrowLineWidth);
      }
    } else {
      group._objects.forEach((obj: any) => {
        const strokeWidth = arrowLineWidth;
        if (obj.objType === "XShapeNotes") {
          obj.set("fixedLineWidth", arrowLineWidth);
          obj.set("lineWidth", arrowLineWidth / obj.scaleX);
          obj.set("dirty", true);
        } else if (obj.objType === "XConnector") {
          obj.set("strokeWidth", arrowLineWidth);
          store.dispatch(handleSetArrowSize(arrowLineWidth));
        } else {
          obj.set("strokeWidth", arrowLineWidth);
        }

        if (
          canvas &&
          canvas.getActiveObject() &&
          canvas.getActiveObject().objType === "XRectNotes"
        ) {
          if (
            canvas &&
            canvas.notesDrawCanvas &&
            canvas.notesDrawCanvas.freeDrawingBrush
          ) {
            canvas.notesDrawCanvas.freeDrawingBrush.width = arrowLineWidth;
          }
        }
      });
    }
    canvas.requestRenderAll();
  };

  return (
    <Box>
      <div className={"customClass"} onClick={handleClick}>
        <Button
          aria-label="bold"
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ p: 0, m: 0, width: "60px", height: "44px" }}
          endDecorator={
            <SvgIcon fontSize="md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </SvgIcon>
          }
        >
          {widthValue === 2
            ? lineThinWidth
            : widthValue === 4
              ? lineMidWidth
              : lineThickWidth}
        </Button>
      </div>
      <Menu
        anchorEl={anchorEl}
        className={"simple-menu"}
        id={id}
        onClose={handleClose}
        open={open}
        sx={{
          "&& .Mui-selected": {
            backgroundColor: "var(--joy-palette-background-level1)",
          },
        }}
      >
        <MenuItem
          onClick={(event: any) => {
            onChangeLineWidth(event, 4);
            getwidthchanged(event);
            handleClose();
          }}
          className={widthValue === 4 ? "Mui-selected" : ""}
        >
          {lineThinWidth}
        </MenuItem>
        <MenuItem
          onClick={(event: any) => {
            onChangeLineWidth(event, 8);
            getwidthchanged(event);
            handleClose();
          }}
          className={widthValue === 8 ? "Mui-selected" : ""}
        >
          {lineMidWidth}
        </MenuItem>
        <MenuItem
          onClick={(event: any) => {
            onChangeLineWidth(event, 12);
            getwidthchanged(event);
            handleClose();
          }}
          className={widthValue === 12 ? "Mui-selected" : ""}
        >
          {lineThickWidth}
        </MenuItem>
      </Menu>
    </Box>
  );
}
