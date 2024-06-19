import React, { useEffect } from "react";
import ColorWidget from "./Colors/ColorWidget";
import FormatAlign from "./FormatAlign";
import FontSize from "./FontSize";
import Font from "./Font";
import SwitchNoteType from "./SwitchNoteType";

import FontWeight from "./FontWeight";
import AlignGroup from "./AlignGroup";
import ConnectorShape from "./ConnectorShape";

import ConnectorTips from "./ConnectorTips";
// import DrawOption from "./DrawOption";
import LineWidth from "./LineWidth";
import NewLayout from "./NewLayout";
// import ResetDraw from "./ResetDraw";
import ObjectLock from "./ObjectLock";
// import CropImage from "./CropImage";
import FileName from "./FileName";
import FileDownload from "./FileDownload";
import TextToMultipleStickyNotes from "./TextToMultipleStickyNotes";
// import { SysService, WidgetService } from "../../services";

import Delete from "./Delete";
// import AIAssist from "./AIAssist/AIAssistWidget";
import AudioToTextAI from "./AudioToTextAI";
//** Import Redux toolkit
import store, { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { handleChangeFontFamily } from "../../redux/features/widgetMenu.slice";
import { handleSetMenuFontWeight } from "../../redux/features/widgets.slice";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import { ActiveSelection, XCanvas, XFile } from "../../../../../fabric";


export default function ({ canvas }: { canvas: XCanvas }) {

  // const canvas: any = BoardService.getInstance().getBoard();

  const [formats, setFormats] = React.useState(() => ["bold", "italic"]);
  const [left, setLeft] = React.useState(400);
  const [top, setTop] = React.useState(500);
  const widgetMenuList: any = useSelector(
    (state: RootState) => state.board.widgetMenuList
  );
  const display = useSelector((state: RootState) => state.board.menuDisplay);
  const font = useSelector((state: RootState) => state.widgetMenu.fontFamily);
  const [fontColor, setFontColor] = React.useState(" ");
  const [fillColor, setFillColor] = React.useState("");
  const [backgroundColor, setBackgroundColor] = React.useState("");
  const [shapeBackgroundColor, setShapeBackgroundColor] = React.useState("");
  const fontSize = useSelector(
    (state: RootState) => state.widgetMenu.menuFontSize
  );
  const [strokeColor, setStrokeColor] = React.useState("");
  const [shapeBorderColor, setShapeBorderColor] = React.useState("");
  const [oldShapeBackgroundColor, setOldShapeBackgroundColor] =
    React.useState("");
  const [polylineArrowColor, setPolylineArrowColor] = React.useState("");
  const [noteDrawColor, setNoteDrawColor] = React.useState("");
  const [width, setWidth] = React.useState(2);
  const [maxlinewidth, setMaxlinewidth] = React.useState(10);
  const fontWeight = useSelector(
    (state: RootState) => state.widgets.menuFontWeight
  );
  const [textAlign, setTextAlign] = React.useState("");
  const position: any = useSelector(
    (state: RootState) => state.widgetMenu.position
  );
  const [opacityValue, setOpacityValue] = React.useState(0);
  const modeType = useSelector((state: RootState) => state.mode.type);

  useEffect(() => {
    if (position) {
      setLeft(position.left || 400);
      setTop(position.top || 500);
    }
    setOpacityValue(
      store.getState().widgets.opacityValue == 0
        ? 0
        : store.getState().widgets.opacityValue || 100
    );

    let singleObject: any = null;
    if (canvas && canvas.getActiveObject()) {
      if (canvas.getActiveObject()?.parent) {
        singleObject = (canvas.getActiveObject() as ActiveSelection)?._objects?.find((c: any) => !c.WBRectPanelId);
      } else {
        singleObject = canvas.getActiveObject();
      }
    }

    if (singleObject && singleObject.fontWeight) {
      store.dispatch(handleSetMenuFontWeight(singleObject.fontWeight || 400));
    }

    if (singleObject && singleObject.textAlign) {
      setTextAlign(singleObject.textAlign || "center");
    }

    if (singleObject && singleObject.fontFamily) {
      store.dispatch(handleChangeFontFamily(singleObject.fontFamily || " "));
    }

    if (singleObject && singleObject.backgroundColor) {
      setBackgroundColor(singleObject.backgroundColor || " ");
      setShapeBackgroundColor(singleObject.backgroundColor || " ");
    }
    if (singleObject && singleObject.stroke) {
      setStrokeColor(singleObject.stroke || " ");
      setShapeBorderColor(singleObject.stroke || " ");
      setPolylineArrowColor(singleObject.stroke || " ");
    }
    if (singleObject && singleObject.fill) {
      let { fill } = singleObject;
      // if (singleObject.type == 'activeselection') {
      //   fill = singleObject._objects[0].fill;
      // }
      setFillColor(fill || " ");
      setFontColor(fill || " ");
      setOldShapeBackgroundColor(fill || " ");
    }

    if (
      singleObject &&
      (singleObject.strokeWidth || singleObject.fixedLineWidth)
    ) {
      if (singleObject.objType == "XShapeNotes")
        setWidth(singleObject.fixedLineWidth || 1);
      else setWidth(singleObject.strokeWidth || 2);
      if (singleObject.objType == "XConnector") setMaxlinewidth(10);
      else setMaxlinewidth(25);
    }
  }, [position]);

  const handleFormat = (event: any, newFormats: any) => {
    setFormats(newFormats);
  };

  React.useEffect(() => {
    const isLock = store.getState().board.currentLockStatus;
    const menuLeft = store.getState().widgets.menuLeft;
    if (
      (widgetMenuList && widgetMenuList.length == 0) ||
      !display ||
      modeType === "pan"
    ) {
      return;
    }

    if (
      menuLeft >
      document.body.clientWidth -
      (document as any).querySelector("#widgetMenuGroup").offsetWidth
    ) {
      let mleft =
        document.body.clientWidth -
        (document as any).querySelector("#widgetMenuGroup").offsetWidth -
        20;

      if (isLock) {
        mleft += store.getState().widgets.menuWidth;
      }
      setLeft(mleft || 400);
    }
  }, [display, widgetMenuList]);

  // const handleWheel = e => {
  //   store.dispatch(handleWidgetMenuDisplay(false))
  //   //todo: this line might be moved to a more appropriate place if I know the reason why it is here.
  //   handlePreventDefaultEvent(e);
  // };

  // React.useEffect(() => {
  //   const widgetMenuRef = document.getElementById('widgetMenuList');
  //   widgetMenuRef.addEventListener('wheel', handleWheel);

  //   return () => {
  //     widgetMenuRef.removeEventListener('wheel', handleWheel);
  //   };
  // }, []);

  return (
    widgetMenuList &&
    widgetMenuList.length > 0 &&
    display &&
    modeType !== "pan" && (
      <Sheet
        id="widgetMenuGroup"
        invertedColors
        sx={{
          borderRadius: "md",
          display: "flex",
          p: "4px 8px",
          position: "fixed",
          height: "40px",
          maxWidth: "100%",
          left,
          top,

          flexDirection: "row",
          justifyContent: "flex-start",
          boxShadow: "var(--joy-shadow-md)",
          alignItems: "center",
          zIndex: 1200,
          overflow: "hidden",
          color: "neutral",
        }}
      >
        {widgetMenuList.includes("switchNoteType") ? (
          <SwitchNoteType paddingLeft={16} paddingRight={16} canvas={canvas} />
        ) : null}

        {widgetMenuList.includes("backgroundColor") ? (
          <ColorWidget
            canvas={canvas}
            color={backgroundColor}
            setColor={setBackgroundColor}
            data-cy="backgroundColor"
            objectType="backgroundColor"
            opacityValue={opacityValue}
            paddingLeft={16}
            paddingRight={
              canvas!.getActiveObject() &&
                canvas!.getActiveObject()?.objType === "XText"
                ? 16
                : 8
            }
          />
        ) : null}

        {widgetMenuList.includes("borderLineIcon") &&
          widgetMenuList.includes("backgroundColor") ? (
          <Box
            sx={{
              width: "1px",
              height: "32px",
              backgroundColor: "#CDD7E1",
            }}
          ></Box>
        ) : null}

        {/* {widgetMenuList.includes("crop") &&
          canvas!.getActiveObjects().length === 1 ? (
          <CropImage />
        ) : null} */}
        {widgetMenuList.includes("fillColor") ? (
          <ColorWidget
            canvas={canvas}
            color={fillColor}
            setColor={setFillColor}
            objectType="fillColor"
            opacityValue={opacityValue}
            paddingLeft={8}
            paddingRight={16}
          />
        ) : null}
        {widgetMenuList.includes("noteDrawColor") ? (
          <ColorWidget
            canvas={canvas}
            color={noteDrawColor}
            setColor={setNoteDrawColor}
            objectType="noteDrawColor"
            opacityValue={opacityValue}
          />
        ) : null}

        {/* {widgetMenuList.includes('borderLineIcon') &&
          widgetMenuList.includes('switchNoteType') ? (
            <Divider orientation="vertical"   />
        ) : null} */}
        {/* {widgetMenuList.includes("resetDraw") ? <ResetDraw /> : null} */}

        {/* --- */}
        {widgetMenuList.includes("changeFont") ? (
          <Font font={font} paddingLeft={"0"} paddingRight={"0"} canvas={canvas} />
        ) : null}
        {widgetMenuList.includes("fontSize") ? (
          <FontSize
            canvas={canvas}
            fontSize={fontSize}
            paddingLeft={16}
            paddingRight={
              canvas!.getActiveObject() &&
                (canvas!.getActiveObject()?.objType === "XText" ||
                  canvas!.getActiveObject()?.objType === "XShapeNotes")
                ? 16
                : 8
            }
          />
        ) : null}

        {widgetMenuList.includes("borderLineIcon") &&
          widgetMenuList.includes("fontSize") ? (
          <Box
            sx={{
              width: "1px",
              height: "32px",
              backgroundColor: "#CDD7E1",
            }}
          ></Box>
        ) : null}

        {/* {widgetMenuList.includes('fontSize') &&
          canvas.getActiveObject() &&
          (canvas.getActiveObject().objType === 'XText' ||
            canvas.getActiveObject().objType === 'XShapeNotes') ? (
              <Divider orientation="vertical"   />
        ) : null} */}
        {widgetMenuList.includes("fontWeight") ? (
          <FontWeight
            canvas={canvas}
            fontWeight={parseInt(fontWeight)}
            paddingLeft={
              canvas!.getActiveObject() &&
                (canvas!.getActiveObject()?.objType === "XText" ||
                  canvas!.getActiveObject()?.objType === "XShapeNotes")
                ? 16
                : 8
            }
            paddingRight={8}
          />
        ) : null}

        {widgetMenuList.includes("fontColor") ? (
          <ColorWidget
            canvas={canvas}
            color={fontColor}
            setColor={setFontColor}
            data-cy="fontColor"
            objectType="fontColor"
            opacityValue={opacityValue}
            paddingLeft={8}
            paddingRight={
              canvas!.getActiveObject() &&
                canvas!.getActiveObject()?.objType === "XText"
                ? 16
                : 8
            }
          />
        ) : null}

        {widgetMenuList.includes("textAlign") && (
          <FormatAlign
            canvas={canvas}
            paddingLeft={8}
            paddingRight={
              canvas!.getActiveObject() &&
                canvas!.getActiveObject()?.objType === "XText"
                ? 8
                : 16
            }
          />
        )}

        {widgetMenuList.includes("alignGroup") ? (
          <AlignGroup canvas={canvas} ></AlignGroup>
        ) : null}

        {widgetMenuList.includes("borderLineIcon") &&
          widgetMenuList.includes("textAlign") ? (
          <Box
            sx={{
              width: "1px",
              height: "32px",
              backgroundColor: "#CDD7E1",
            }}
          ></Box>
        ) : null}

        {/* {widgetMenuList.includes('borderLineIcon') &&
          widgetMenuList.includes('textAlign') ? (
            <Divider orientation="vertical"   />
        ) : null} */}
        {/* {widgetMenuList.includes('applyFormat') ? <ApplyFormat /> : null}
          {widgetMenuList.includes('applyFormat') ? (
            <BorderLineIcon style={{ position: 'relative' }} />
          ) : null} */}

        {widgetMenuList.includes("connectorShape") ? (
          <ConnectorShape canvas={canvas} />
        ) : null}
        {/* {widgetMenuList.includes("connectorStyle") ? (
          <ConnectorStyle paddingLeft={8} paddingRight={8} />
        ) : null} */}
        {widgetMenuList.includes("connectorTip") ? (
          <ConnectorTips canvas={canvas} />
        ) : null}
        {/* {widgetMenuList.includes("drawOption") ? (
          <DrawOption paddingLeft={8} paddingRight={8} />
        ) : null} */}
        {widgetMenuList.includes("lineWidth") ? (
          <LineWidth
            canvas={canvas}
            paddingLeft={
              canvas!.getActiveObject() &&
                canvas!.getActiveObject()?.objType === "WBPath"
                ? 16
                : 8
            }
            paddingRight={
              canvas!.getActiveObject() &&
                canvas!.getActiveObject()?.objType === "XShapeNotes"
                ? 16
                : 8
            }
          />
        ) : null}
        {/* {widgetMenuList.includes('borderLineIcon') &&
          canvas.getActiveObject() &&
          canvas.getActiveObject().objType === 'XShapeNotes' ? (
           <Divider orientation="vertical"   />
        ) : null} */}
        {widgetMenuList.includes("newLayout") ? (
          <NewLayout canvas={canvas} paddingLeft={8} paddingRight={8} />
        ) : null}
        {widgetMenuList.includes("borderLineIcon") ? null : null}

        {/* {widgetMenuList.includes('backgroundColor') ? (
          <ColorWidget
            color={backgroundColor}
            setColor={setBackgroundColor}
            data-cy="backgroundColor"
            objectType="backgroundColor"
            opacityValue={opacityValue}
            paddingLeft={16}
            paddingRight={
              canvas.getActiveObject() &&
              canvas.getActiveObject().objType === 'XText'
                ? 16
                : 8
            }
          />
        ) : null} */}
        {/*widgetMenuList.includes('emojiMenu') ? (
        <EmojiMenu paddingLeft={8} paddingRight={16} />
      ) : null*/}

        {widgetMenuList.includes("strokeColor") ? (
          <ColorWidget
            canvas={canvas}
            color={strokeColor}
            setColor={setStrokeColor}
            objectType="strokeColor"
            opacityValue={opacityValue}
            paddingLeft={8}
            paddingRight={16}
          />
        ) : null}
        {widgetMenuList.includes("shapeBorderColor") ? (
          <ColorWidget
            canvas={canvas}
            color={shapeBorderColor}
            setColor={setShapeBorderColor}
            objectType="shapeBorderColor"
            opacityValue={opacityValue}
            paddingLeft={8}
            paddingRight={16}
          />
        ) : null}
        {widgetMenuList.includes("shapeBackgroundColor") ? (
          <ColorWidget
            canvas={canvas}
            color={shapeBackgroundColor}
            setColor={setShapeBackgroundColor}
            objectType="shapeBackgroundColor"
            opacityValue={opacityValue}
            paddingLeft={8}
            paddingRight={16}
          />
        ) : null}
        {widgetMenuList.includes("oldShapeBackgroundColor") ? (
          <ColorWidget
            canvas={canvas}
            color={oldShapeBackgroundColor}
            setColor={setOldShapeBackgroundColor}
            objectType="oldShapeBackgroundColor"
            opacityValue={opacityValue}
            paddingLeft={8}
            paddingRight={8}
          />
        ) : null}
        {widgetMenuList.includes("polylineArrowColor") ? (
          <ColorWidget
            canvas={canvas}
            color={polylineArrowColor}
            setColor={setPolylineArrowColor}
            objectType="polylineArrowColor"
            opacityValue={opacityValue}
            paddingLeft={8}
            paddingRight={8}
          />
        ) : null}
        {/* {widgetMenuList.includes('borderLineIcon') ? (
          <Divider orientation="vertical"   />
        ) : null} */}
        {widgetMenuList.includes("fileName") ? (
          <FileName
            canvas={canvas}
            fileName={canvas &&
              canvas!.getActiveObject() &&
              canvas!.getActiveObject()?.objType === "XFile"
              ? (canvas!.getActiveObject() as XFile)?.fileName
              : ""
            }
          />
        ) : null}
        {/* {widgetMenuList.includes('borderLineIcon') &&
          widgetMenuList.includes('fileDownload') ? (
            <Divider orientation="vertical"   />
        ) : null} */}
        {widgetMenuList.includes("fileDownload") ? (
          <FileDownload
            canvas={canvas}
            fileDownloadSrc={
              canvas!.getActiveObject() &&
                canvas!.getActiveObject()?.objType === "XFile"
                ? (canvas!.getActiveObject() as XFile)?.fileSrc
                : ""
            }
            fileName={
              canvas!.getActiveObject() &&
                canvas!.getActiveObject()?.objType === "XFile"
                ? (canvas!.getActiveObject() as XFile)?.fileName
                : ""
            }
          />
        ) : null}
        {/* {widgetMenuList.includes('borderLineIcon') &&
          widgetMenuList.includes('fileDownload') ? (
            <Divider orientation="vertical"   />
        ) : null} */}
        {widgetMenuList.includes("objectLock") ? (
          <ObjectLock canvas={canvas} paddingLeft={16} paddingRight={16} />
        ) : null}
        {widgetMenuList.includes("textToMultipleStickyNotes") ? (
          <TextToMultipleStickyNotes canvas={canvas} />
        ) : null}
        {widgetMenuList.includes("delete") ? (
          <Delete canvas={canvas} />
        ) : null}
        {/* {widgetMenuList.includes("aiassist") ? <AIAssist /> : null} */}
        {widgetMenuList.includes("audioToText") ? (
          <AudioToTextAI canvas={canvas} />
        ) : null}
      </Sheet>
    )
  );
}
