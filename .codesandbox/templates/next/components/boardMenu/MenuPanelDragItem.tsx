import { useDrag } from "react-dnd";
import PanIconSub1 from "../../mui/icons/PanIconSub1";
import PanIconSub2 from "../../mui/icons/PanIconSub2";
import PanIconSub3 from "../../mui/icons/PanIconSub3";
import PanIconSub4 from "../../mui/icons/PanIconSub4";
import PanIconSub5 from "../../mui/icons/PanIconSub5";
import PanIconSub6 from "../../mui/icons/PanIconSub6";
import PanIconSub7 from "../../mui/icons/PanIconSub7";
import PanIconSub8 from "../../mui/icons/PanIconSub8";
import PanIconSub9 from "../../mui/icons/PanIconSub9";
import { BoardService, EventService } from "../../services";
import EventNames from "../../services/EventNames";
import {
  handleSetIsPanMode,
  handleSetDrawToCreateWidget,
} from "../../redux/features/board.slice";
import store from "../../redux/store";

export const MenuPanelDragItem = function MenuPanelDragItem({
  objType,
  handleClose,
  iconId,
}: {
  objType: string;
  handleClose: Function;
  iconId: number;
}) {
  const canvas: any = BoardService.getInstance().getBoard();
  const widthArray = [400, 595, 612, 1280, 1024, 800, 1440, 834, 390];
  const heightArray = [400, 842, 792, 720, 798, 800, 1024, 1194, 884];
  const NameArray = [
    "Custom",
    "A4",
    "Letter",
    "16:9",
    "4:3",
    "1:1",
    "Desktop",
    "Tablet",
    "Phone",
  ];
  const shapeCursorArray = [
    "data:image/svg+xml, %3Csvg width='35' height='22' viewBox='0 0 35 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='2' y='2' width='29' height='2' rx='1' fill='%23757575'/%3E%3Crect x='2' y='18' width='29' height='2' rx='1' fill='%23757575'/%3E%3Crect x='2' y='2' width='18' height='2' rx='1' transform='rotate(90 2 2)' fill='%23757575'/%3E%3Crect x='31' y='2' width='18' height='2' rx='1' transform='rotate(90 31 2)' fill='%23757575'/%3E%3C/svg%3E",
    "data:image/svg+xml, %3Csvg width='20' height='25' viewBox='0 0 20 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.4 24.2526L12 24.2526L19.2 16.9768L19.2 2.42526C19.2 1.09136 18.12 -7.62939e-06 16.8 -7.62939e-06L2.388 -7.62939e-06C1.068 -7.62939e-06 0 1.09136 0 2.42526L0 21.8274C0 23.1613 1.08 24.2526 2.4 24.2526ZM2.39998 2.42526L16.8 2.42526L16.8 15.7642L10.8 15.7642L10.8 21.8274L2.39998 21.8274L2.39998 2.42526Z' fill='black' fill-opacity='0.54'/%3E%3C/svg%3E",
    "data:image/svg+xml, %3Csvg width='20' height='26' viewBox='0 0 20 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.4 25.6H12L19.2 17.92L19.2 2.56001C19.2 1.15201 18.12 7.62939e-06 16.8 7.62939e-06L2.388 7.62939e-06C1.068 7.62939e-06 0 1.15201 0 2.56001L0 23.04C0 24.448 1.08 25.6 2.4 25.6ZM2.39998 2.56001L16.8 2.56001L16.8 16.64H10.8L10.8 23.04H2.39998L2.39998 2.56001Z' fill='black' fill-opacity='0.54'/%3E%3C/svg%3E",
    "data:image/svg+xml, %3Csvg width='36' height='22' viewBox='0 0 36 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='2' y='2' width='30' height='2' rx='1' fill='%23757575'/%3E%3Crect x='2' y='18' width='30' height='2' rx='1' fill='%23757575'/%3E%3Crect x='2' y='2' width='18' height='2' rx='1' transform='rotate(90 2 2)' fill='%23757575'/%3E%3Crect x='32' y='2' width='18' height='2' rx='1' transform='rotate(90 32 2)' fill='%23757575'/%3E%3C/svg%3E",
    "data:image/svg+xml, %3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='2' y='2' width='26' height='2' rx='1' fill='%23757575'/%3E%3Crect x='2' y='28' width='26' height='2' rx='1' fill='%23757575'/%3E%3Crect x='2' y='2' width='28' height='2' rx='1' transform='rotate(90 2 2)' fill='%23757575'/%3E%3Crect x='28' y='2' width='26' height='2' rx='1' transform='rotate(90 28 2)' fill='%23757575'/%3E%3C/svg%3E",
    "data:image/svg+xml, %3Csvg width='33' height='31' viewBox='0 0 33 31' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M3.37498 0.916667H29.625C31.2291 0.916667 32.5416 2.22917 32.5416 3.83333V21.3333C32.5416 22.9375 31.2291 24.25 29.625 24.25H19.4166V27.1667H22.3333V30.0833H10.6666V27.1667H13.5833V24.25H3.37498C1.77081 24.25 0.458313 22.9375 0.458313 21.3333V3.83333C0.458313 2.22917 1.77081 0.916667 3.37498 0.916667ZM3.37498 21.3333H29.625V3.83333H3.37498V21.3333Z' fill='black' fill-opacity='0.54'/%3E%3C/svg%3E",
    "data:image/svg+xml, %3Csvg width='33' height='31' viewBox='0 0 33 31' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M3.37498 0.916667H29.625C31.2291 0.916667 32.5416 2.22917 32.5416 3.83333V21.3333C32.5416 22.9375 31.2291 24.25 29.625 24.25H19.4166V27.1667H22.3333V30.0833H10.6666V27.1667H13.5833V24.25H3.37498C1.77081 24.25 0.458313 22.9375 0.458313 21.3333V3.83333C0.458313 2.22917 1.77081 0.916667 3.37498 0.916667ZM3.37498 21.3333H29.625V3.83333H3.37498V21.3333Z' fill='black' fill-opacity='0.54'/%3E%3C/svg%3E",
    "data:image/svg+xml, %3Csvg width='35' height='25' viewBox='0 0 35 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M32.0688 18.3333C32.0688 19.9375 30.7708 21.25 29.1667 21.25H35V24.1667H0V21.25H5.83333C4.22917 21.25 2.91667 19.9375 2.91667 18.3333V3.75C2.91667 2.14583 4.22917 0.833334 5.83333 0.833334H29.1667C30.7708 0.833334 32.0833 2.14583 32.0833 3.75L32.0688 18.3333ZM29.1667 3.75002H5.83333V18.3334H29.1667V3.75002Z' fill='black' fill-opacity='0.54'/%3E%3C/svg%3E",
    "data:image/svg+xml, %3Csvg width='18' height='30' viewBox='0 0 18 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M14 0.333313H4C1.925 0.333313 0.25 2.11998 0.25 4.33331V25.6666C0.25 27.88 1.925 29.6666 4 29.6666H14C16.075 29.6666 17.75 27.88 17.75 25.6666V4.33331C17.75 2.11998 16.075 0.333313 14 0.333313ZM15.25 23H2.75V4.33333H15.25V23ZM6.5 27H11.5V25.6666H6.5V27Z' fill='black' fill-opacity='0.54'/%3E%3C/svg%3E",
  ];

  function clickToGenerateNotesListenerItem(e: any) {
    const clicked = store.getState().board.boardPanelClicked;
    if (!clicked) return;
    canvas.hoverCursor = "grab";
    canvas.defaultCursor = "move";
    if (objType !== "WBRectPanel") {
      canvas.createWidgetatCurrentLocationByType(objType, {});
    } else {
      const text = getPanelText();
      canvas.createWidgetatCurrentLocationByType(objType, {
        iconId,
        width: widthArray[iconId],
        height: heightArray[iconId],
        text,
      });
    }
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_DOWN,
      clickToGenerateNotesListenerItem
    );
  }

  function getPanelText() {
    let number = 1;
    canvas.getObjects().forEach((o: any) => {
      if (
        o.objType === "WBRectPanel" &&
        o.text &&
        o.text.indexOf("Frame") == 0
      ) {
        let numbertemp = Number(o.text.replace("Frame", ""));
        if (!isNaN(numbertemp)) {
          numbertemp += 1;
          if (numbertemp > number) {
            number = numbertemp;
          }
        }
      }
    });
    return `Frame${number}`;
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "widget",
    item: { objType, type: "widget" },
    end: (item, monitor) => {
      handleClose();
      if (objType !== "WBRectPanel") {
        canvas.createWidgetatCurrentLocationByType(item.objType, {});
      } else {
        const text = getPanelText();
        canvas.createWidgetatCurrentLocationByType(item.objType, {
          iconId,
          width: widthArray[iconId],
          height: heightArray[iconId],
          text,
        });
      }
      const dropResult = monitor.getDropResult();
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const setCursorForShape = (iconId: any) => {
    const cursorNoteTemp = shapeCursorArray[iconId];

    return cursorNoteTemp;
  };

  const cursorNote = setCursorForShape(iconId);

  const onClickItem = (e: any) => {
    if (Date.now() - canvas.__lastClickTimeStamp < 500) return;
    canvas.__lastClickTimeStamp = Date.now();

    handleClose();
    if (iconId == 0) {
      if (canvas.drawTempWidget) return;
      store.dispatch(handleSetIsPanMode(false));
      canvas.discardActiveObject();
      canvas.defaultCursor = "crosshair";
      store.dispatch(handleSetDrawToCreateWidget("WBRectPanel"));
      canvas.lockObjectsInCanvas();
      canvas.selection = false;
      canvas.isEnablePanMoving = false;
    } else {
      EventService.getInstance().register(
        EventNames.CANVAS_MOUSE_DOWN,
        clickToGenerateNotesListenerItem
      );

      canvas.hoverCursor = `url("${cursorNote}") 0 0, auto`;
      canvas.defaultCursor = `url("${cursorNote}") 0 0, auto`;
    }
  };

  return (
    <div
      style={{
        width: "45px",
        height: "45px",
        display: "inline-block",
        marginLeft: "4px",
        marginTop: "6px",
        marginRight: "4px",
        marginBottom: "6px",
        cursor: "pointer",
        textAlign: "center",
      }}
      data-testid="box-WBTitle"
      data-type={objType}
      draggable
      onClick={onClickItem}
      //@ts-ignore
      ref={drag}
      role="widget"
    >
      {iconId == 0 ? <PanIconSub1 /> : null}
      {iconId == 1 ? <PanIconSub2 /> : null}
      {iconId == 2 ? <PanIconSub3 /> : null}
      {iconId == 3 ? <PanIconSub4 /> : null}
      {iconId == 4 ? <PanIconSub5 /> : null}
      {iconId == 5 ? <PanIconSub6 /> : null}
      {iconId == 6 ? <PanIconSub7 /> : null}
      {iconId == 7 ? <PanIconSub8 /> : null}
      {iconId == 8 ? <PanIconSub9 /> : null}
      <span
        style={{
          display: "block",
          width: "100%",
          fontSize: 12,
        }}
      >
        {NameArray[iconId]}
      </span>
    </div>
  );
};
