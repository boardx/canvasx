import React, { useState } from "react";
import Tooltip from "@mui/joy/Tooltip";
import { useTranslation } from "../../services/i18n/client";
import {
  AntTabs,
  TabPanel,
  AntTab,
  a11yProps,
} from "../../mui/components/TabPanelObjects";

import { MenuStickyNoteDragItem } from "./MenuStickyNoteDragItem";
import {
  BoardService,
  WidgetService,
  DrawingService, UtilityService
} from "../../services";
import showMenu from "../widgetMenu/ShowMenu";
import { useSelector } from "react-redux";
import store, { RootState } from "../../redux/store";
import { handleSetOpenCreateStickyNoteTips } from "../../redux/features/board.slice";
import { stickyNoteColorSeriesOne } from "../../utils/stickynoteColor";
import { handleSetMenuFontWeight } from "../../redux/features/widgets.slice";
import Popover from "@mui/material/Popover";
import { ListItem, ListItemButton, Sheet } from "@mui/joy";
import getMobileOperatingSystem from "../../utils/getMobileOperatingSystem";

const StickyNoteIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      strokeWidth="1.5"
      className="menuImgSize"
    >
      <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
        <path
          d="M13.629,23.25H2.25a1.5,1.5,0,0,1-1.5-1.5V2.25A1.5,1.5,0,0,1,2.25.75h19.5a1.5,1.5,0,0,1,1.5,1.5V13.629a1.5,1.5,0,0,1-.439,1.06l-8.122,8.122A1.5,1.5,0,0,1,13.629,23.25Z"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M14.25,23.115V15.75a1.5,1.5,0,0,1,1.5-1.5h7.365"
          fill="none"
          stroke="var(--joy-palette-text-icon)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
};

export const createStickNote = () => {
  const canvas: any = BoardService.getInstance().getBoard();

  canvas.discardActiveObject();
  const cursorNote =
    "data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.6863 0H0.313719C0.1405 0 0 0.1405 0 0.313719V15.6863C0 15.8595 0.1405 16 0.313719 16H11.5815C11.7548 16 16 11.6732 16 11.5V0.313719C16 0.1405 15.8595 0 15.6863 0ZM13.8977 13.5L12.0252 15.3726L15.3725 12.0252L13.8977 13.5ZM11.5815 14.9288V11.5815H14.9288L11.5815 14.9288ZM15.3726 10.954H11.2677C11.0945 10.954 10.954 11.0945 10.954 11.2677V15.3725H0.627437V0.627437H15.3725L15.3726 10.954Z' fill='%23232930'/%3E%3C/svg%3E";

  DrawingService.getInstance().getReadyToDrawWidget(
    `url("${cursorNote}") 0 0, auto`,
    "XRectNotes",
    canvas
  );
};

function debounce(func: any, wait: any) {
  let timeout: any;
  return function () {
    // @ts-ignore
    const context: any = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

export const doubleClickToCreateStickyNote = debounce(async (e: any) => {
  const canvas: any = BoardService.getInstance().getBoard();

  if (
    localStorage.getItem("is_onboard") === "true" &&
    !localStorage.getItem("openCreateStickyNoteTips")
  ) {
    store.dispatch(handleSetOpenCreateStickyNoteTips(true));
  }

  if (
    store.getState().mode.type === "draw" ||
    store.getState().mode.type === "line" ||
    canvas.isDrawingMode ||
    (canvas.getActiveObject() &&
      canvas.getActiveObject().objType === "XFile") ||
    canvas.mouse.moved
  ) {
    return;
  }
  const target = e.target;
  if (
    target &&
    (target.objType === "XRectNotes" ||
      target.objType === "XCircleNotes" ||
      target.objType === "XTextbox" ||
      target.objType === "XText" ||
      target.objType === "XShapeNotes" ||
      target.type === "textbox") &&
    target.editable &&
    !target.isPanel
  ) {
    target.enterEditing();
    return;
  }

  if (
    target &&
    (target.objType === "XRectNotes" ||
      target.objType === "XCircleNotes" ||
      target.objType === "WBUrlImage" ||
      target.objType === "XTextbox" ||
      target.objType === "XText" ||
      target.objType === "XShapeNotes")
  ) {
    return;
  }

  const { defaultNote } = canvas;

  const positionOfClick = e.pointerType ? e.srcEvent : e.e;
  const nextObject = await canvas.getNextObjectByPoint(
    { x: positionOfClick.offsetX, y: positionOfClick.offsetY },
    defaultNote.width * defaultNote.scaleX,
    defaultNote.height * defaultNote.scaleY
  );
  let position: { left: number; top: number } = { left: 0, top: 0 };
  if (!nextObject) {
    const point = canvas.getPositionOnCanvas(
      positionOfClick.offsetX,
      positionOfClick.offsetY
    );
    position = { left: point.left, top: point.top };
  } else {
    position.left = nextObject.left;
    position.top = nextObject.top;
    defaultNote.width = nextObject.width;
    defaultNote.height = nextObject.height;
    defaultNote.scaleX = nextObject.scaleX;
    defaultNote.scaleY = nextObject.scaleY;
    defaultNote.fontSize = nextObject.fontSize;
    defaultNote.fontFamily = nextObject.fontFamily;
    defaultNote.fontWeight = nextObject.fontWeight;
    defaultNote.textAlign = nextObject.textAlign;
    defaultNote.backgroundColor = nextObject.backgroundColor;
    defaultNote.fill = nextObject.fill;
    defaultNote.objType = nextObject.objType;
    canvas.changeDefaulNote(defaultNote);
  }
  const note = {
    angle: 0,
    width: defaultNote.width,
    height: defaultNote.height,
    scaleX: defaultNote.scaleX,
    scaleY: defaultNote.scaleY,
    fontSize: defaultNote.fontSize,
    fontWeight: defaultNote.fontWeight,
    fontFamily: defaultNote.fontFamily,
    textAlign: defaultNote.textAlign,
    backgroundColor: defaultNote.backgroundColor,
    fill: defaultNote.fill,
    isDraw: canvas.defaultNote.isDraw,
    objType: defaultNote.objType,
    emoji: [0, 0, 0, 0, 0],
    selectable: true,
    originX: "center",
    originY: "center",
    left: position.left,
    top: position.top,
    text: "",
    userId: store.getState().user.userInfo.userId,
    whiteboardId: store.getState().board.board.id,
    timestamp: Date.now(),
    zIndex: Date.now() * 100,
    radius: 0,
    id: "",
  };
  if (defaultNote.objType === "XCircleNotes") {
    note.radius = 69;
  }
  note.id = UtilityService.getInstance().generateWidgetID();
  store.dispatch(handleSetMenuFontWeight(note.fontWeight));
  const widget = await canvas.createWidgetAsync(note);
  canvas.add(widget);
  canvas.requestRenderAll();

  widget.index = canvas._objects.length;

  note.left = widget.left;
  note.top = widget.top;
  // if (widget.objType !== '') await canvas.checkIfBindtoPanelNoSaveData(widget);
  WidgetService.getInstance().insertWidget(widget.getObject());
  const newState = await widget.getUndoRedoState("ADDED");
  canvas.pushNewState(newState);
  canvas.setActiveObject(widget);
  canvas.requestRenderAll();
  if (
    !defaultNote.isDraw &&
    (widget.objType === "XText" ||
      widget.objType === "XRectNotes" ||
      widget.objType === "XCircleNotes") &&
    getMobileOperatingSystem() !== "ios"
  ) {
    widget.enterEditing();
  }
  if (
    getMobileOperatingSystem() !== "ios" &&
    getMobileOperatingSystem() !== "android"
  ) {
    showMenu(canvas);
  }
  canvas.requestRenderAll();
}, 100);

export default function CustomizedTabs() {
  const canvas: any = BoardService.getInstance().getBoard();

  const { t } = useTranslation("menu");
  const noteColors = stickyNoteColorSeriesOne.slice(
    0,
    stickyNoteColorSeriesOne.length - 1
  );

  const [value, setValue] = React.useState(0);
  const [open, setOpen] = useState(false);
  const modeType = useSelector((state: RootState) => state.mode.type);

  const handleClose = () => {
    setOpen(false);
  };

  const anchEl = document.getElementById("stickNoteBtn");

  return (
    <div>
      <Tooltip title={t("stickyNotes")} placement="top" arrow>
        <ListItem
          value="note"
          data-tut="reactour__note"
          aria-label="note"
          onClick={() => setOpen(!open)}
        >
          <ListItemButton
            id="stickNoteBtn"
            style={{ width: "40px", paddingTop: "7px" }}
          >
            <StickyNoteIcon />
          </ListItemButton>
        </ListItem>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: 275, horizontal: "center" }}
        sx={{ ".divPadding7": { textAlign: "end" } }}
      >
        <Sheet
          style={{
            flexGrow: 1,
            width: "280px",
          }}
        >
          <div>
            <AntTabs
              value={value}
              onChange={(e, idx) => setValue(idx)}
              aria-label="ant example"
            >
              <AntTab label="5X3" {...a11yProps(0)} />
              <AntTab label="3X3" {...a11yProps(1)} />
              <AntTab label={t("stickyNotesRound")} {...a11yProps(2)} />
            </AntTabs>
            <div className={"divPadding7"}>
              <TabPanel value={value} index={0} width={260} height={201}>
                {noteColors.map((r) => (
                  <MenuStickyNoteDragItem
                    key={r}
                    color={r}
                    objType="XRectNotes"
                    noteType="rect"
                    handleClose={handleClose}
                    name="XRectNotes"
                  />
                ))}
              </TabPanel>
            </div>
            <div className={"divPadding7"}>
              <TabPanel value={value} index={1} width={260} height={201}>
                {noteColors.map((r) => (
                  <MenuStickyNoteDragItem
                    key={r}
                    color={r}
                    objType="XRectNotes"
                    noteType="square"
                    handleClose={handleClose}
                    name={"XRectNotes"}
                  />
                ))}
              </TabPanel>
            </div>
            <div className={"divPadding7"}>
              <TabPanel value={value} index={2} width={260} height={201}>
                {noteColors.map((r) => (
                  <MenuStickyNoteDragItem
                    key={r}
                    color={r}
                    objType="XCircleNotes"
                    noteType="circle"
                    handleClose={handleClose}
                    name="XCircleNotes"
                  />
                ))}
              </TabPanel>
            </div>
          </div>
        </Sheet>
      </Popover>
    </div>
  );
}
