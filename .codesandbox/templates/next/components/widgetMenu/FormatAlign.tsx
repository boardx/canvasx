import React, { useEffect } from "react";
import Popover from "@mui/material/Popover";
// import { WidgetService } from "../../services";
//** Import Redux toolkit
import store, { RootState } from "../../redux/store";
import { handleSetDropdownDisplayed } from "../../redux/features/widgets.slice";
import { useSelector } from "react-redux";
import { handleSetCurrentAlign } from "../../redux/features/board.slice";
//@ts-ignore
import $ from "jquery";
import IconButton from "@mui/joy/IconButton";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconChevronDown,
} from "@tabler/icons-react";


export default function FormatAlign({
  paddingLeft,
  paddingRight,
  canvas
}: {
  paddingLeft: number;
  paddingRight: number;
  canvas: any;
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [align, setAlign] = React.useState<string>("");
  const textAlign = useSelector((state: RootState) => state.board.currentAlign);
  useEffect(() => {
    if (textAlign === "left") {
      setAlign("left");
    }
    if (textAlign === "center") {
      setAlign("center");
    }
    if (textAlign === "right") {
      setAlign("right");
    }
    if (!textAlign) {
      setAlign("center");
    }
    const activeObj = canvas.getActiveObjects();
    //判断activeObj的所有对象的textAlign都是left right 或center
    if (activeObj[0] && activeObj[0].textAlign && activeObj.length > 1) {
      let isSame = true;
      activeObj.forEach((obj: any) => {
        if (obj.textAlign && obj.textAlign !== activeObj[0].textAlign) {
          isSame = false;
        }
      });
      if (isSame) {
        setAlign(activeObj[0].textAlign);
      }
    }
  }, [textAlign]);
  const fontAlign = align;

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleBlur = (e: any) => {
    store.dispatch(handleSetDropdownDisplayed(false));
  };

  const handleFocus = (e: any) => {
    store.dispatch(handleSetDropdownDisplayed(true));
  };

  const [open, setOpen] = React.useState(false);
  const id = open ? "formatAlignment-popover" : undefined;

  const changeAlign = (e: any, alignment: any) => {
    const textAlign = alignment;
    const object = canvas.getActiveObject();
    const menu = $("#notesMenu");
    let data = null;
    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (object.isEditing) {
      object.exitEditing();
    }

    store.dispatch(handleSetCurrentAlign(textAlign));

    if (!object) {
      return menu.hide();
    }
    // if (object) {
    //   data = WidgetService.getInstance().getWidgetFromWidgetList(object.id);

    //   object.set("textAlign", textAlign);
    //   // object.resetResizeControls();
    //   canvas.requestRenderAll();
    //   object.saveData("MODIFIED", ["textAlign"]);
    // }
    canvas.requestRenderAll();
    if (group && group._objects) {
      group._objects.forEach((obj: any) => {
        obj.set("textAlign", textAlign);
      });
      group.saveData("MODIFIED", ["textAlign"]);
    }
    setOpen(false);
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        aria-label="formatAlignCenter"
        data-cy="formatAlign"
        component="label"
        tabIndex={-1}
        role={undefined}
        variant="plain"
        color="neutral"
        size="sm"
        sx={{
          p: "4px",
          m: 0,
          color: "currentcolor",
          ".MuiButton-endDecorator": {
            ml: "4px",
          },
        }}
        endDecorator={
          <IconChevronDown
            style={{
              width: "20px",
              height: "20px",
              strokeWidth: "var(--joy-lineHeight-sm)",
            }}
          />
        }
      >
        {fontAlign === "center" ? (
          <IconAlignCenter
            fontSize="small"
            style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
          />
        ) : null}
        {fontAlign === "" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            strokeWidth="1.5"
            className="widgetMenuImgSize"
          >
            <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
              <path
                d="M2.241 2.998L21.741 2.998"
                fill="none"
                stroke="var(--joy-palette-text-icon)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M5.241 7.498L18.741 7.498"
                fill="none"
                stroke="var(--joy-palette-text-icon)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M0.741 11.998L23.241 11.998"
                fill="none"
                stroke="var(--joy-palette-text-icon)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M5.241 16.498L18.741 16.498"
                fill="none"
                stroke="var(--joy-palette-text-icon)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M2.241 20.998L21.741 20.998"
                fill="none"
                stroke="var(--joy-palette-text-icon)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </g>
          </svg>
        ) : null}
        {fontAlign === "left" ? (
          <IconAlignLeft
            fontSize="small"
            style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
          />
        ) : null}
        {fontAlign === "right" ? (
          <IconAlignRight
            fontSize="small"
            style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
          />
        ) : null}
      </Button>

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          top: 10,
          left: 35,
          "& .MuiPopover-paper": {
            borderRadius: "8px",
          },
        }}
        id={id}
        onBlur={handleBlur}
        onClose={handleClose}
        onFocus={handleFocus}
        open={open}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "6px 0px",
          }}
        >
          <IconButton
            aria-label="Align Left"
            onClick={(e) => changeAlign(e, "left")}
            className={
              align === "left"
                ? "widgetMenuImgSize customClass active"
                : "widgetMenuImgSize customClass align"
            }
            sx={{ p: "6px 12px", minWidth: "48px !important" }}
          >
            <IconAlignLeft
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          </IconButton>

          <IconButton
            aria-label="Align Center"
            onClick={(e) => changeAlign(e, "center")}
            className={
              align === "center"
                ? "widgetMenuImgSize customClass active"
                : "widgetMenuImgSize customClass align"
            }
            sx={{ p: "6px 12px", minWidth: "48px !important" }}
          >
            <IconAlignCenter
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          </IconButton>

          <IconButton
            aria-label="Align Right"
            onClick={(e) => changeAlign(e, "right")}
            className={
              align === "right"
                ? "widgetMenuImgSize customClass active"
                : "widgetMenuImgSize customClass align"
            }
            sx={{ p: "6px 12px", minWidth: "48px !important" }}
          >
            <IconAlignRight
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          </IconButton>
        </Box>
      </Popover>
    </Box>
  );
}
