import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { useSelector } from "react-redux";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sheet from "@mui/joy/Sheet";
import MenuPanSelect from "./MenuPanSelect";
import MenuText from "./MenuText";
import MenuDrawing from "./MenuDrawing";
import MenuArrow from "./MenuArrow";
import MenuShape from "./MenuShapes";

// import MenuTemplate from "./MenuTemplate";
import StickyNoteMenu from "./StickNoteMenu";

import usePanActions from "./modeHandlers/usePanActions";
import useDrawActions from "./modeHandlers/useDrawActions";
import useDefaultEventActions from "./modeHandlers/useDefaultEventActions";
import useEraserActions from "./modeHandlers/useEraserActions";
import useMouseActions from "./modeHandlers/useMouseActions";
import useArrowActions from "./modeHandlers/useLineActions";
import useTextActions from "./modeHandlers/useTextActions";
import useShapeActions from "./modeHandlers/useShapeActions";
import useStickNoteActions from "./modeHandlers/useStickNoteActions";
import { handlePreventDefaultEvent } from "./events";
import List from "@mui/joy/List";
import store, { RootState } from "../../redux/store";
import { BoardService } from "../../services";
import { changeMode } from '../../redux/features/mode.slice';
import { XCanvas } from "../../../../../fabric";
export function MenuBar() {
  const modeType = useSelector((state: RootState) => state.mode.type);
  const { startMouseListener, endMouseListener } = useMouseActions();
  const { startDefaultListener, endDefaultListener } = useDefaultEventActions();
  const { handlePanBefore, handlePanAfter } = usePanActions();
  const { handleDrawBefore, handleDrawAfter } = useDrawActions();
  const { handleEraseBefore, handleEraseAfter } = useEraserActions();
  const { handleLineBefore, handleLineAfter } = useArrowActions();
  const { handleTextBefore, handleTextAfter } = useTextActions();
  const { handleShapeBefore, handleShapeAfter } = useShapeActions();
  const { handleStickNoteBefore, handleStickNoteAfter } = useStickNoteActions();
  const hideBoardMenu = useSelector(
    (state: RootState) => state.board.hideBoardMenu
  );
  const canvas: XCanvas = BoardService.getInstance().getBoard();

  useEffect(() => {



    canvas?.getObjects().forEach((obj: any) => {
      if (obj.controls.mbaStart) {
        obj.controls.mbaStart.mouseDownHandler = (e: any) => {
          store.dispatch(changeMode("line"));
        };
        obj.controls.mlaStart.mouseDownHandler = (e: any) => {
          store.dispatch(changeMode("line"));
        };
        obj.controls.mraStart.mouseDownHandler = (e: any) => {
          store.dispatch(changeMode("line"));
        };
        obj.controls.mtaStart.mouseDownHandler = (e: any) => {
          store.dispatch(changeMode("line"));
        };
      }
    });

  }, [canvas, modeType]);
  useEffect(() => {
    console.log("!@startMouseListener", modeType);
    startMouseListener();
    startDefaultListener();

    const ele = document.getElementById("menuBar");
    ele && ele.addEventListener("wheel", handlePreventDefaultEvent);

    switch (modeType) {
      case "pan":
        handlePanBefore();
        break;
      case "draw":
        handleDrawBefore();
        break;
      case "eraser":
        handleEraseBefore();
        break;
      case "line":
        console.log("!@startMouseListener---line", modeType);
        canvas?.initializeConnectorMode();
        handleLineBefore();
        break;
      case "text":
        handleTextBefore();
        break;
      case "shapeNote":
        handleShapeBefore();
        break;
      case "stickNote":
        handleStickNoteBefore();
      case "default":
        canvas?.exitConnectorMode();
        break;
    }

    return () => {
      switch (modeType) {
        case "pan":
          handlePanAfter();
          break;
        case "draw":
          handleDrawAfter();
          break;
        case "eraser":
          handleEraseAfter();
          break;
        case "line":
          handleLineAfter();
          break;
        case "text":
          handleTextAfter();
          break;
        case "shapeNote":
          handleShapeAfter();
          break;
        case "stickNote":
          handleStickNoteAfter();
          break;
        case "default":

          endDefaultListener();
          break;
      }

      ele && ele.removeEventListener("wheel", handlePreventDefaultEvent);

      endMouseListener();
      endDefaultListener();
    };
  }, [canvas, modeType]);

  return (
    <DndProvider backend={HTML5Backend}>
      {/* {!hideBoardMenu ? ( */}
      <Sheet
        invertedColors
        id="menuBar"
        sx={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 0,
          height: "60px",
          boxShadow: "var(--joy-shadow-xl)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: "8px 8px 0 0",
          boxSizing: "border-box",
          padding: "10px 8px",

          // Nested selectors
          ".menuImgSize": {
            width: "24px",
            height: "24px",
          },

          ".mainBtn": {
            // width: '60px',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },

          ".optionsBtn": {
            border: 0,
            outline: "none",
            cursor: "pointer",
            textAlign: "center",
            boxSizing: "border-box",

            "&:hover svg": {
              transform: "translateY(-6px)",
            },
          },
        }}
      >
        <List sx={{ flexDirection: "row" }}>
          <MenuPanSelect />
          <StickyNoteMenu />
          {/* <MenuPanel /> */}
          <MenuDrawing />
          <MenuText />
          <MenuArrow />
          <MenuShape />
          {/* <MenuResources /> */}
          {/* <MenuTemplate /> */}
          {/* <MenuAIAssist /> */}
        </List>
      </Sheet>
      {/* ) : null} */}
    </DndProvider>
  );
}

const MenuBarMemo = React.memo(MenuBar);

export default MenuBarMemo;
