import { useDrag } from "react-dnd";
import React, { useEffect } from "react";
import Tooltip from "@mui/joy/Tooltip";
import { EventService } from "../../services/";
import EventNames from "../../components/EventName";
import { useTranslation } from "../../services/i18n/client";
import store from "../../redux/store";
import {
  handleSetIsPanMode,
  handleSetBoardPanelClicked,
  handleSetDrawingEraseMode,
  handleSetBoardMenuEvents,
} from "../../redux/features/board.slice";

const getMenuBarSelected = (objType: any) => {
  switch (objType) {
    case "XRectNotes":
      return store.getState().widgets.noteSelected;
    case "XText":
      return store.getState().widgets.textSelected;
    case "WBPath":
      return store.getState().widgets.pathSelected;
    case "XConnector":
      return store.getState().widgets.arrowSelected;
    case "XShapeNotes":
      return store.getState().widgets.shapeSelected;
    case "WBImage":
      return store.getState().widgets.fileSelected;
  }
};

function drawXText(canvas: any, options?: any) {
  canvas.hoverCursor = "default";
  canvas.defaultCursor = "default";
  canvas.createWidgetatCurrentLocationByType("XText", {
    position: {
      left: options.x,
      top: options.y,
    },
  });
}

export const MenuTextDragItem = function MenuTextDragItem({
  name,
  objType,
  fontSize,
  handleClose,
  canvas
}: {
  name: string;
  objType: string;
  fontSize: number;
  handleClose: Function;
  canvas: any
}) {
  const { t } = useTranslation("menu");

  // const canvas: any = BoardService.getInstance().getBoard();
  function clickToGenerateTextBoxListener(e: any) {
    drawXText(canvas, e.pointer);
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_DOWN,
      clickToGenerateTextBoxListener
    );
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "widget",
    item: { name, objType, type: "widget" },
    end: (item: any, monitor: any) => {
      handleClose();
      canvas.createWidgetatCurrentLocationByType(item.objType);
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        alert(
          `${t("board.filedrop.youDropped")} ${item.name} ${t(
            "board.filedrop.into"
          )} ${dropResult.name}!`
        );
      }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const onClickItem = (e: any) => {
    store.dispatch(handleSetIsPanMode(false));
    store.dispatch(handleSetDrawingEraseMode(false));
    store.dispatch(handleSetBoardPanelClicked(false));
    if (Date.now() - canvas.__lastClickTimeStamp < 500) return;
    canvas.__lastClickTimeStamp = Date.now();
    handleClose();
    // BoardService.getInstance().resetBoardMenuEvents();
    EventService.getInstance().register(
      EventNames.CANVAS_MOUSE_DOWN,
      clickToGenerateTextBoxListener
    );
    canvas.hoverCursor = "text";
    canvas.defaultCursor = "text";
    let boardMenuEvents = store.getState().board.boardMenuEvents;
    let newEvent = insertNewEvents(boardMenuEvents, {
      eventName: EventNames.CANVAS_MOUSE_DOWN,
      eventHandler: clickToGenerateTextBoxListener,
    });
    store.dispatch(handleSetBoardMenuEvents(newEvent));
  };
  const rectTextSelected = getMenuBarSelected("XText");
  const [selected, setSelected] = React.useState<boolean>(false);

  const insertNewEvents = (list: any, newItem: any) => {
    let newList = [];
    list.map((item: any) => {
      newList.push(item);
    });
    newList.push(newItem);
    return newList;
  };
  useEffect(() => {
    const barSelected: any = getMenuBarSelected("XText");
    setSelected(barSelected);
  }, [rectTextSelected]);

  return (
    <div
      style={{ textAlign: "center", cursor: "pointer" }}
      data-testid="box-WBTitle"
      data-type={objType}
      draggable
      onClick={onClickItem}
      //@ts-ignore
      ref={drag}
      role="Box"
    >
      <Tooltip arrow placement="top" title={t("menuTitleText")}>
        <div style={{ padding: "14px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            strokeWidth="1.5"
            className="menuImgSize svg"
          >
            <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
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
              />
              <path
                d="M7.5 23.248L16.5 23.248"
                fill="none"
                stroke="var(--joy-palette-text-icon)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </g>
          </svg>
        </div>
      </Tooltip>
    </div>
  );
};
