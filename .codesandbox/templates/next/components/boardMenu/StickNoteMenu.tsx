import { ListItem, Tooltip } from "@mui/joy";
import MenuItem from "@mui/material/MenuItem";
//@ts-ignore
import { CirclePicker } from "react-color";
import {
  updateStickNoteType,
  updateStickNoteBackgroundColor
} from "../../redux/features/widget/stickNote";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "../../services/i18n/client";
import { RootState } from "../../redux/store";
import React from "react";
import { changeMode } from "../../redux/features/mode.slice";
import store from "../../redux/store";
import { getStickNoteOptions } from "../../redux/features/widget/stickNote";
//import MenuDragWrap from './MenuDragWrap';
import { stickyNoteColorSeriesOne } from "../../components/widgetMenu/Colors/StandardColor";
import { handleSetMenuFontWeight } from "../../redux/features/widgets.slice";
import { IconChevronUp } from "@tabler/icons-react";

import { ListItemButton, Box } from "@mui/joy";
import Sheet from "@mui/joy/Sheet";
import { IconX } from "@tabler/icons-react";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { XCircleNotes } from "../../../../../fabric";
import { XRectNotes } from "../../../../../fabric";

import { BoardService } from "../../services";

export const UpArrow = () => (
  <svg
    width="8"
    height="5"
    viewBox="0 0 8 5"
    fill="var(--joy-palette-text-icon)"
    xmlns="http://www.w3.org/2000/svg"
    stroke="var(--joy-palette-text-icon)"
  >
    <path
      d="M0.25 4.72966L3.82333 1.15666C3.84652 1.13343 3.87406 1.11501 3.90437 1.10244C3.93469 1.08987 3.96718 1.0834 4 1.0834C4.03282 1.0834 4.06531 1.08987 4.09563 1.10244C4.12594 1.11501 4.15348 1.13343 4.17667 1.15666L7.75 4.72966"
      stroke="var(--joy-palette-text-icon)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Square = (props: any) => {
  const { color } = props;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 0H0V19L5 24H24V0Z" fill={color} />
      <path d="M0 19H3.42857L5 24L0 19Z" fill={color} />
      <g>
        <path d="M0 19H5V24L0 19Z" fill="#9FA6AD" />
      </g>
    </svg>
  );
};

export const Rectangle = (props: any) => {
  const { color } = props;
  return (
    <svg
      width="34"
      height="24"
      viewBox="0 0 34 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M34 0H0V19.9999L4.04762 23.9999H34V0Z" fill={color} />
      <path d="M0 19.9999H4.04762V23.9999L0 19.9999Z" fill={color} />
      <g>
        <path d="M0 20H3.99998V24L0 20Z" fill="#9FA6AD" />
      </g>
    </svg>
  );
};

export const Rectangle2 = (props: any) => {
  const { color } = props;
  return (
    <svg
      width="36"
      height="24"
      viewBox="0 0 36 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M36 0H0V19L5 24H36V0Z" fill={color} />
      <path d="M0 19H5V24L0 19Z" fill={color} />
      <g>
        <path d="M0 19H5V24L0 19Z" fill="#9FA6AD" />
      </g>
    </svg>
  );
};

export const Circle = (props: any) => {
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
        d="M24 12C24 18.6274 18.6274 24 12 24L0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z"
        fill={color}
      />
      <path d="M12 24C12 17.3726 6.62742 12 0 12L12 24Z" fill="#9FA6AD" />
    </svg>
  );
};

export const handleStickyNoteDragEnd = (canvas: any) => {
  const stickNoteInfo = store.getState().widget.stickNote;
  const position = canvas.getPointer(canvas.dragOverEvent);
  const options = getStickNoteOptions(
    stickNoteInfo.noteType,
    stickNoteInfo.backgroundColor,
    position
  );
  const widget: any =
    options.noteType === "circle"
      ? new XCircleNotes("", options)
      : new XRectNotes("", options);
  canvas.add(widget);
  canvas.setActiveObject(widget);
  canvas.requestRenderAll();

  if (widget.lastEditedBy === "AI") {
    widget.author = "AI";
  }

  store.dispatch(handleSetMenuFontWeight(400));
  // WidgetService.getInstance().insertWidget(widget.getObject());

  // canvas.pushNewState([
  //   {
  //     targetId: widget.id,
  //     activeselection: true,
  //     newState: widget.getObject(),
  //     action: "ADDED",
  //   },
  // ]);
};

const StickyNoteMenu = () => {
  const [open, setOpen] = React.useState(false);
  const canvas: any = BoardService.getInstance().getBoard();
  const [defaultColor, selectedColor] = ["#B8B8B8", "#FFF740"];
  const dispatch = useDispatch();
  const { t } = useTranslation("menu");
  const backgroundColor = useSelector(
    (state: RootState) => state.widget.stickNote.backgroundColor
  );
  const noteType = useSelector(
    (state: RootState) => state.widget.stickNote.noteType
  );
  const modeType = useSelector((state: RootState) => state.mode.type);
  const menuBarOpen = useSelector(
    (state: RootState) => state.widget.stickNote.menuBarOpen
  );

  const handleColorChange = (color: any) => {
    dispatch(updateStickNoteBackgroundColor(color.hex));
    dispatch(changeMode("stickNote"));
    setOpen(false);
  };

  const handleNoteTypeChange = (type: any) => {
    dispatch(updateStickNoteType(type));
    dispatch(changeMode("stickNote"));
    setOpen(false);
  };

  const handleOpenStickNoteToolBar = (e: any) => {
    e.stopPropagation();
    canvas.discardActiveObject();
    dispatch(changeMode("default"));
    //dispatch(updateStickyNoteMenuBarOpenStatus(!menuBarOpen));
    setOpen(!open);
  };

  const handleCloseStickNoteToolBar = (e: any) => {
    //e.stopPropagation();
    //dispatch(updateStickyNoteMenuBarOpenStatus(!menuBarOpen));
    setOpen(false);
  };

  const noteColors = stickyNoteColorSeriesOne.slice(0, 7);

  const handleIconClick = () => {
    dispatch(changeMode("stickNote"));
  };

  const StickNoteIcon = () => {
    switch (noteType) {
      case "rect":
        return <Rectangle className="menuImgSize" color={backgroundColor} />;
      case "circle":
        return <Circle className="menuImgSize" color={backgroundColor} />;
      case "square":
        return <Square className="menuImgSize" color={backgroundColor} />;
    }
  };

  return (
    <>
      <Tooltip title={t("stickyNotes")} placement="top" arrow>
        <ListItem
          id="stickNoteBtn"
          value="stickynote"
          data-tut="reactour__note"
          onClick={handleIconClick}
          sx={{ p: 0, borderWidth: "0px", mr: "16px" }}
        >
          <ListItemButton
            selected={modeType === "stickNote"}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              p: "8px 4px",
              borderWidth: "0px",
              m: 0,
              borderRadius: "6px",
              backgroundColor: open
                ? "var(--joy-palette-primary-100) !important"
                : null,
              ".tabler-icon": {
                color: open
                  ? "var(--joy-palette-primary-500)"
                  : "var(--joy-palette-neutral-500)",
              },
            }}
          >
            <StickNoteIcon />
            <IconChevronUp
              onClick={handleOpenStickNoteToolBar}
              style={{
                marginLeft: "4px",
                width: "20px",
                height: "20px",
                strokeWidth: "var(--joy-lineHeight-sm)",
              }}
            />
          </ListItemButton>
        </ListItem>
      </Tooltip>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={handleCloseStickNoteToolBar}
      >
        <Sheet
          sx={{
            position: "fixed",
            bottom: "68px",
            left: "50%",
            transform: "translateX(-47%)",
            display: "flex",
            overflow: "hidden",
            borderRadius: "8px",
            boxShadow: "var(--joy-shadow-md)",
            p: "2px 8px 2px 4px",
            alignItems: "center",
          }}
          //style={{ display: menuBarOpen ? 'flex' : 'none' }}
          style={{ display: open ? "flex" : "none" }}
        >
          <MenuItem
            onClick={() => {
              handleNoteTypeChange("rect");
            }}
            sx={{ p: "6px", height: "36px" }}
          >
            <Rectangle2 color={backgroundColor} />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleNoteTypeChange("square");
            }}
            sx={{ p: "6px", height: "36px" }}
          >
            <Square color={backgroundColor} />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleNoteTypeChange("circle");
            }}
            sx={{ p: "6px", height: "36px" }}
          >
            <Circle color={backgroundColor} />
          </MenuItem>

          <Box
            sx={{
              width: "1px",
              height: "24px",
              backgroundColor: "#CDD7E1",
              m: "0px 8px",
            }}
          ></Box>

          <MenuItem
            sx={{
              p: 0,
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            <CirclePicker
              circleSize={24}
              color={backgroundColor}
              colors={noteColors}
              width={"268px"}
              onChange={(color: any) => handleColorChange(color)}
            />
          </MenuItem>
          <MenuItem
            sx={{ p: 0, ml: "3px" }}
            onClick={handleCloseStickNoteToolBar}
          >
            <IconX />
          </MenuItem>
        </Sheet>
      </ClickAwayListener>
    </>
  );
};

export default StickyNoteMenu;
