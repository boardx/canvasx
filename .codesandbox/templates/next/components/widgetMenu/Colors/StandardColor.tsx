
import { useTranslation } from "../../../services/i18n/client";

import store from "../../../redux/store";
import { handleSetCursorColorOfPen } from "../../../redux/features/board.slice";
import {
  handleSetObjectWidgetStatusChange,
  handleSetArrowStroke,
} from "../../../redux/features/widgets.slice";
import Box from "@mui/joy/Box";
//@ts-ignore
import $ from "jquery";

import { hexToRgbA, invertColor } from "./util";
import { getBrushCursorWithColor } from "./util";
import { BoardService } from "../../../services";

export const stickyNoteColorSeriesOne = [
  '#FCEC8A',
  '#FFA930',
  '#93F472',
  '#A9EDF1',
  '#23BFE7',
  '#FF65A3',
  '#919191',
  '#F7F4E5',
  '#354858',
  '#HHHHHH'
];

export const stickyNoteColorSeriesTwo = [
  '#FFFFFF',
  '#D4D4D4',
  '#919191',
  '#1F1F1F',
  '#FCEC8A',
  '#FFF740',
  '#D5F692',
  '#93F472',
  '#FFA930',
  '#E85E5E',
  '#FF65A3',
  '#B384BB',
  '#7AFCFF',
  '#A9EDF1',
  '#23BFE7',
  '#2897DD',
  '#HHHHHH'
];


export default function StandardColor(props: any) {
  const { t } = useTranslation("menu");
  const canvas: any = BoardService.getInstance().getBoard();
  const type = props.objectType;
  let opacity = props.opacityValue;
  const setColor = props.setColor;
  // const canvas: any = BoardService.getInstance().getBoard();
  let colorSelections: any = [];

  const colorSeries = (objectType: any) => {
    if (
      objectType === "drawColor" ||
      objectType === "fontColor" ||
      objectType === "strokeColor"
    ) {
      return stickyNoteColorSeriesTwo.slice(
        0,
        stickyNoteColorSeriesTwo.length - 1
      );
    }

    if (
      objectType === "backgroundColor" &&
      canvas.getActiveObject().objType === "XText"
    ) {
      return stickyNoteColorSeriesTwo.slice(
        0,
        stickyNoteColorSeriesTwo.length - 1
      );
    }

    if (
      objectType === "backgroundColor" &&
      (canvas.getActiveObject().objType === "XRectNotes" ||
        canvas.getActiveObject().objType === "XCircleNotes")
    ) {
      return stickyNoteColorSeriesTwo;
    }

    if (
      (objectType === "shapeBorderColor" &&
        canvas.getActiveObject().objType === "XShapeNotes") ||
      (objectType === "backgroundColor" &&
        canvas.getActiveObject().objType === "XShapeNotes")
    ) {
      return stickyNoteColorSeriesTwo;
    }

    if (
      canvas.getActiveObject()._objects &&
      canvas.getActiveObject()._objects.length > 1
    ) {
      let noXShapeNotes = canvas
        .getActiveObject()
        ._objects.filter((item: any) => item.objType !== "XShapeNotes");

      if (objectType === "shapeBorderColor" && noXShapeNotes.length === 0) {
        return stickyNoteColorSeriesTwo;
      }
      if (objectType === "backgroundColor") {
        return stickyNoteColorSeriesTwo;
      }
    }

    return stickyNoteColorSeriesOne.slice(
      0,
      stickyNoteColorSeriesOne.length - 1
    );
  };

  const stickyNoteColorSeries = colorSeries(type);

  stickyNoteColorSeries.map((item: any, index: any) => {
    colorSelections.push({ id: index, color: item });
  });

  const hexifyColor = (colors: any) => {
    if (!colors) return;

    if (colors.slice(0, 1) === "#") {
      return colors.toLocaleUpperCase();
    }

    if (colors === "rgba(0, 0, 0, 0)") {
      return "#HHHHHH";
    }

    var values = colors
      .replace(/rgba?\(/, "")
      .replace(/\)/, "")
      .replace(/[\s+]/g, "")
      .split(",");
    var a = parseFloat(values[3] || 1),
      r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
      g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
      b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);

    var hex =
      "#" +
      ("0" + r.toString(16)).slice(-2) +
      ("0" + g.toString(16)).slice(-2) +
      ("0" + b.toString(16)).slice(-2);

    return hex.toLocaleUpperCase();
  };

  // Function onClickStandardColor()
  //
  // Object Fields:
  //
  // 1. backgroundColor: backgroundColor, shapeBackgroundColor
  // 2. fill : fillColor, fontColor, oldShapeBackgroundColor
  // 3. stroke : strokeColor, shapeBorderColor
  // 4. canvas.notesDrawCanvas.freeDrawingBrush.color
  // 5. canvas.freeDrawingBrush.color

  // a. WBTitle/XText: backgroundColor--1, fontColor--2
  // b. WBCircleNote/WBRectNote: backgroundColor--1, fontColor--2
  // c. WBRectNoteDraw: backgroundColor--1, noteDrawColor--4
  // d. WBPath: background--1, fillColor--2, strokeColor--3, drawColor--5
  // e. (OLD New) WBTriangle/WBRectPanel/WBCircle(Shapes): oldShapeBackgroundColor--2, shapeBorderColor--3
  // e. (Stop using) WBTriangle/WBRectPanel/WBCircle(Shapes): shapeBackgroundColor--1, shapeBorderColor --3, fontColor--2
  // e. (New)XShapeNotes:: shapeBackgroundColor--1, shapeBorderColor --3, fontColor--2
  // f. XConnector: strokeColor--3
  // ----------------------------------------------
  // g. WBPolygon (onClickStandardPolylineArrowColor--color assigned to both stroke & fill) & WBModel:No longer in use.

  const onClickStandardColor = (e: any) => {
    if (type === "backgroundColor" || type === "shapeBackgroundColor") {
      // backgroundColor --1
      onClickStandardBackgroundColor(e);
    } else if (
      type === "fontColor" ||
      type === "fillColor" ||
      type === "oldShapeBackgroundColor"
    ) {
      // fill --2
      onClickStandardFillColor(e);
    } else if (type === "strokeColor" || type === "shapeBorderColor") {
      // stroke --3
      onClickStandardStrokeColor(e);
    } else if (type === "noteDrawColor") {
      // canvas.notesDrawCanvas.freeDrawingBrush.color --4
      onClickStandardNoteDrawColor(e);
    } else if (type === "drawColor") {
      // canvas.freeDrawingBrush.color --5
      onClickStandardDrawColor(e);
    }

    if (store.getState().widgets.objectWidgetStatusChange) {
      store.dispatch(handleSetObjectWidgetStatusChange(false));
    } else {
      store.dispatch(handleSetObjectWidgetStatusChange(true));
    }

    if (type !== "drawColor") {
      props.clickMe();
    }
  };

  // Color -- 5
  const onClickStandardDrawColor = (e: any) => {
    $(".roundColorSelection").children().hide();

    $(e.currentTarget).siblings(".selected").removeClass("selected");
    $(e.currentTarget).addClass("selected");

    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data("color");
    props.clickMe(inputColor);
    if (inputColor === "#HHH") {
      // abort drawing if color is null
      // Util.Msg.info(t("board.color.transparentNotAallowed"));
      return;
    }
    if (!opacity) {
      opacity = 100;
    }
    const strokeColor = hexToRgbA(inputColor, opacity / 100);
    store.dispatch(handleSetCursorColorOfPen(strokeColor));

    const object = canvas.getActiveObject();
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = strokeColor;
    }

    canvas.freeDrawingCursor = getBrushCursorWithColor(strokeColor);
    canvas.requestRenderAll();
  };

  // Color -- 4
  const onClickStandardNoteDrawColor = (e: any) => {
    $(".roundColorSelection").children().hide();

    $(e.currentTarget).siblings(".selected").removeClass("selected");
    $(e.currentTarget).addClass("selected");

    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data("color");

    setColor(inputColor);

    if (inputColor === "#HHH") {
      // abort drawing if color is null
      // Util.Msg.info(t("board.color.transparentNotAallowed"));
      return;
    }
    if (!opacity) {
      opacity = 100;
    }
    const strokeColor = hexToRgbA(inputColor, opacity / 100);
    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (group) {
      // Util.Msg.info(t("board.color.forOneStickyNote"));
      return;
    }

    object.set("stroke", strokeColor);
    if (
      canvas &&
      canvas.notesDrawCanvas &&
      canvas.notesDrawCanvas.freeDrawingBrush
    ) {
      canvas.notesDrawCanvas.freeDrawingBrush.color = strokeColor;
    }
    object.saveData("MODIFIED", ["stroke"]);

    canvas.requestRenderAll();
  };

  // Color -- 3
  const onClickStandardStrokeColor = (e: any) => {
    $(".roundColorSelection").children().hide();

    $(e.currentTarget).siblings(".selected").removeClass("selected");
    $(e.currentTarget).addClass("selected");

    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data("color");
    setColor(inputColor);
    let strokeColor;
    if (!opacity) {
      opacity = 100;
    }
    if (inputColor === "#HHH") {
      // abort drawing if color is null
      strokeColor = null;
    } else {
      strokeColor = hexToRgbA(inputColor, opacity / 100);
    }

    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) {
      // If only one object is selected
      object.set("stroke", strokeColor);
      object.saveData("MODIFIED", ["stroke"]);

      if (object.objType === "XConnector") {
        store.dispatch(handleSetArrowStroke(strokeColor));
      }
    }

    if (group && group._objects) {
      group._objects.forEach((obj: any) => {
        obj.set("stroke", strokeColor);

        if (obj.objType === "XConnector") {
          store.dispatch(handleSetArrowStroke(strokeColor));
        }
      });
      group.saveData("MODIFIED", ["stroke"]);
    }

    canvas.requestRenderAll();
  };

  // Color -- 2
  const onClickStandardFillColor = (e: any) => {
    $(e.currentTarget).siblings(".selected").removeClass("selected");
    $(e.currentTarget).addClass("selected");

    // show and hide the red circle -2
    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data("color");
    setColor(inputColor);
    let fill;
    if (!opacity) {
      opacity = 100;
    }
    if (inputColor === "#HHH") {
      // abort drawing if color is null
      fill = null;
    } else {
      fill = hexToRgbA(inputColor, opacity / 100);
    }
    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) {
      group = canvas.getActiveObject();
    }

    if (!group) {
      // if it is single object update
      object.set("fill", fill);
      object.saveData("MODIFIED", ["fill"]);
    }

    if (group && group._objects) {
      // if it is group object update
      group._objects.forEach((obj: any) => {
        obj.set("fill", fill);
      });
      group.saveData("MODIFIED", ["fill"]);
    }

    canvas.requestRenderAll();
    if (canvas.getActiveObject().hiddenTextarea)
      canvas.getActiveObject().hiddenTextarea.focus();
  };

  // Color -- 1
  const onClickStandardBackgroundColor = (e: any) => {
    e.preventDefault();

    $(".roundColorSelection").children().hide();

    $(e.currentTarget).siblings(".selected").removeClass("selected");
    $(e.currentTarget).addClass("selected");

    // show and hide the red circle -2
    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data("color");
    setColor(inputColor);
    let backgroundColor;
    if (!opacity) {
      opacity = 100;
    }

    if (inputColor === "#HHH") {
      // abort drawing if color is null
      backgroundColor = null;
    } else {
      backgroundColor = hexToRgbA(inputColor, opacity / 100);
    }

    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) {
      // Only one object is selected
      let fontColor;
      if (backgroundColor) {
        if (object.objType == "XRectNotes") {
          fontColor = invertColor(inputColor, true);
        } else {
          fontColor = object.fill;
        }
      } else {
        fontColor = "rgba(0,0,0,1)";
      }
      object.set("backgroundColor", backgroundColor).set("fill", fontColor);
      object.saveData("MODIFIED", ["fill", "backgroundColor"]);
    }

    if (group && group._objects) {
      group._objects.forEach((obj: any) => {
        let fontColor;
        if (backgroundColor) {
          if (obj.objType == "XRectNotes") {
            fontColor = invertColor(backgroundColor, true);
          } else {
            fontColor = obj.fill;
          }
        } else {
          fontColor = "rgba(0,0,0,1)";
        }
        obj.set("backgroundColor", backgroundColor).set("fill", fontColor);
      });
      group.saveData("MODIFIED", ["fill", "backgroundColor"]);
    }

    canvas.requestRenderAll();
    if (canvas.getActiveObject().hiddenTextarea)
      setTimeout(() => {
        canvas.getActiveObject().hiddenTextarea.focus();
      }, 100);
  };

  const populateColorSelectionsDOM = () => {
    return colorSelections.map((selection: any, index: any) => {
      if (selection.color !== "#HHHHHH") {
        return (
          <li
            style={{
              width: "28px",
              height: "28px",
              margin: "8px",
              position: "relative",
              borderRadius: "50%",
              border: "1px solid rgba(0,0,0,.15)",
              listStyle: "none",
              display: "inline-block",
              backgroundColor: selection.color,
            }}
            data-color={selection.color}
            data-cy={selection.color}
            key={index}
            onClick={onClickStandardColor}
          >
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, .15)",
                top: "50%",
                left: "50%",
                width: "130%",
                height: "130%",
                position: "absolute",
                transform: "translate(-50%, -50%)",
                border: "2px solid #f21d6b",
                borderRadius: "50%",
                display:
                  hexifyColor(props.color) === selection.color
                    ? "block"
                    : "none",
              }}
            />
          </li>
        );
      }
      return (
        <li
          style={{
            width: "28px",
            height: "28px",
            margin: "8px",
            borderRadius: "50%",
            position: "relative",
            listStyle: "none",
            backgroundImage:
              "url(\"data:image/svg+xml,%0A%3Csvg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='14' cy='14' r='14' fill='white'/%3E%3Ccircle cx='14' cy='14' r='13.5' stroke='black' strokeOpacity='0.16'/%3E%3Cline x1='4.74703' y1='23.5459' x2='23.747' y2='4.54589' stroke='black' strokeOpacity='0.16'/%3E%3C/svg%3E%0A\")",
            display: "inline-block",
          }}
          data-color="#HHHHHH"
          data-cy="#HHHHHH"
          key={index}
          onClick={onClickStandardColor}
        >
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, .15)",
              top: "50%",
              left: "50%",
              width: "130%",
              height: "130%",
              position: "absolute",
              transform: "translate(-50%, -50%)",
              border: "2px solid #f21d6b",
              borderRadius: "50%",
              display:
                hexifyColor(props.color) === selection.color ? "block" : "none",
            }}
          />
        </li>
      );
    });
  };

  return (
    <Box
      sx={{
        width: "176px",
        padding: "0px",
        overflow: "hidden",
        display: "flex",
        justifyContent: "left",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      {populateColorSelectionsDOM()}
    </Box>
  );
}
