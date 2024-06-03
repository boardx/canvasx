//@ts-ignore
import { ChromePicker } from "react-color";
import React, { useEffect } from "react";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";

import { useTranslation } from "../../../services/i18n/client";
import { handleSetCursorColorOfPen } from "../../../redux/features/board.slice";
import {
  handleSetCustomColorMode,
  handleSetCurrentCustomColor,
  handleSetArrowStroke,
  handleSetObjectWidgetStatusChange,
  handleSetCustomColors,
} from "../../../redux/features/widgets.slice";
import { updateDrawColor } from "../../../redux/features/widget/draw";

//**utils */
import { getBrushCursorWithColor, hexToRgbA, invertColor } from "./util";

//@ts-ignore
import $ from "jquery";


//** Import Redux toolkit
import store, { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

export default function CustomColor({
  setpCustomColor,
  objectType,
  clickMe,
  color,
  opacityValue,
  setColor,
  canvas
}: {
  setpCustomColor: any;
  objectType: any;
  clickMe: any;
  color: any;
  opacityValue: any;
  setColor: any;
  canvas: any
}) {
  let opacity = opacityValue;
  const type = objectType;
  // const canvas: any = BoardService.getInstance().getBoard();
  const { t } = useTranslation("menu");
  const [customColor, setCustomColor] = React.useState(color);
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);
  const colors = useSelector((state: RootState) => state.widgets.customColors);

  const hexifyColor = (colors: any) => {
    if (!color) return;

    if (colors.slice(0, 1) === "#") {
      return colors;
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
    return (
      "#" +
      ("0" + r.toString(16)).slice(-2) +
      ("0" + g.toString(16)).slice(-2) +
      ("0" + b.toString(16)).slice(-2)
    );
  };

  const getColorFromCanvas = (e: any, canvas: any) => {
    const canvasContext = canvas.getContext("2d");
    const mousePointer = e.pointer;
    const x = parseInt(mousePointer.x);
    const y = parseInt(mousePointer.y);
    const pixel = canvasContext.getImageData(x, y, 1, 1).data;
    const color = rgbaToHex(pixel[0], pixel[1], pixel[2], pixel[3]);
    return color;
  };

  const rgbaToHex = (r: any, g: any, b: any, a: any) => {
    const outParts = [
      r.toString(16),
      g.toString(16),
      b.toString(16),
      Math.round(a * 255)
        .toString(16)
        .substring(0, 2),
    ];
    outParts.map((outPart, i) => {
      if (outPart.length === 1) {
        outParts[i] = `0${outPart}`;
      }
    });
    return `#${outParts.join("")}`;
  };

  const resetMousePointerCursers = (c: any) => {
    const canvas = c;
    /**
     * to reset default cursor from pick color tool cursor
     * for default values refer http://fabricjs.com/docs/fabric.js.html#line9593
     */
    const cursorPen =
      "url(\"data:image/svg+xml,%0A%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M14.6694 0C14.4094 0 14.1594 0.1 13.9594 0.29L10.8394 3.41L8.90937 1.5L7.49937 2.91L8.91937 4.33L-0.00062561 13.25V18H4.74937L13.6694 9.08L15.0894 10.5L16.4994 9.09L14.5794 7.17L17.6994 4.05C18.0994 3.65 18.0994 3.02 17.7094 2.63L15.3694 0.29C15.1694 0.1 14.9194 0 14.6694 0ZM14.6594 2.41L15.5794 3.33L12.8894 6.02L11.9694 5.1L14.6594 2.41ZM1.99937 14.08L3.91937 16L11.9794 7.94L10.0594 6.02L1.99937 14.08Z' fill='black' fill-opacity='0.54'/%3E%3C/svg%3E%0A\") 0 23, auto";

    canvas.defaultCursor = cursorPen;
    /**
     * to reset hover cursor to fabric.js default values for object hovering
     * for default values refer http://fabricjs.com/docs/fabric.js.html#line9593
     */
    canvas.hoverCursor = cursorPen;

    canvas.getObjects().map((object: any) => {
      object.hoverCursor = cursorPen;
    });
  };

  const refreshColorChange = () => {
    if (store.getState().widgets.objectWidgetStatusChange) {
      store.dispatch(handleSetObjectWidgetStatusChange(false));
    } else {
      store.dispatch(handleSetObjectWidgetStatusChange(true));
    }
  };

  const handlePickColorMouseDown = (e: any) => {
    canvas.isPickColorToolActive = false;

    /**
     * remove all pick color tool listeners
     */
    const color = getColorFromCanvas(e, canvas);
    e.hex = color;
    changeColorbyEyeDropper(e);
    // EventService.getInstance().unregister(
    //   EventNames.CANVAS_MOUSE_DOWN,
    //   handlePickColorMouseDown
    // );

    canvas.discardActiveObject();
    canvas.getObjects().map((o: any) => {
      if (o.objType === "common") return;
      // canvas.recoverLockStatusFromCollection(o);
      o.selectable = true;
      o.dirty = true;
      o.hoverCursor = "default";

      canvas.hoverCursor = "default";
      canvas.defaultCursor = "default";
    });

    canvas.requestRenderAll();
  };

  // when clicking the eyedropper, the mouse icon becomes the eye dropper icon
  // when clicking anywhere in the canvas, read the rgb of that pixel and save it to a Session("eyeDropperColor")
  // the eye dropper icon change to the read color
  // at the same time, the background color/stroke color/border color is changed to the read color.
  // click the eyedropper again to disable it.

  const handleclose = () => {
    let drawingMode = store.getState().mode.type === "draw" ? true : false;
    if (drawingMode) {
      setDisplayColorPicker(false);
    }
  };

  // ***************************************************************************************************
  // ***************** Below are functions for Color changing by EyeDropper ****************************
  // ***************************************************************************************************

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

  const changeColorbyEyeDropper = (e: any) => {
    console.log("e", e);
    if (
      objectType === "backgroundColor" ||
      objectType === "shapeBackgroundColor"
    ) {
      changeBGColorbyEyeDropper(e); // --1--
    } else if (
      objectType === "fontColor" ||
      objectType === "oldShapeBackgroundColor" ||
      objectType === "fillColor"
    ) {
      changeFillColorbyEyeDropper(e); // --2--
    } else if (
      objectType === "strokeColor" ||
      objectType === "shapeBorderColor"
    ) {
      changeStrokeColorbyEyeDropper(e); // --3--
    } else if (objectType === "noteDrawColor") {
      changeNoteDrawColorbyEyeDropper(e); // --4--
    } else if (objectType === "drawColor") {
      changeDrawColorbyEyeDropper(e); // --5--
    }
    refreshColorChange();
  };

  // --3--
  const changeStrokeColorbyEyeDropper = (e: any) => {
    setpCustomColor(e.hex);
    store.dispatch(handleSetCustomColorMode(true));

    const strokeColor = e.hex;
    store.dispatch(handleSetCurrentCustomColor(strokeColor));

    const object = canvas.getObjectByID();
    if (!object) return;

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) {
      object.set("stroke", strokeColor);
      if (object.objType === "XConnector") {
        store.dispatch(handleSetCurrentCustomColor(strokeColor));
      }
      object.saveData("MODIFIED", ["stroke"]);
    }

    if (group && group._objects) {
      group._objects.forEach((obj: any) => {
        obj.set("stroke", strokeColor);
        // if (obj.objType === "XConnector") {
        //   WidgetService.getInstance().setArrowStroke(strokeColor);
        // }
      });
      group.saveData("MODIFIED", ["stroke"]);
    }
    canvas.requestRenderAll();
  };

  // --2--
  const changeFillColorbyEyeDropper = (e: any) => {
    setpCustomColor(e.hex);
    store.dispatch(handleSetCustomColorMode(true));

    const inputColor = e.hex;
    store.dispatch(handleSetCurrentCustomColor(inputColor));

    const object = canvas.getObjectByID();
    if (!object) {
      return;
    }

    let group;
    if (object.length > 1) {
      group = object;
    }

    if (object && !group) {
      object.set("fill", inputColor);
      object.saveData("MODIFIED", ["fill"]);
    }

    if (group && group._objects) {
      group._objects.forEach((obj: any) => {
        obj.set("fill", inputColor);
      });
      group.saveData("MODIFIED", ["fill"]);
    }

    canvas.requestRenderAll();
    if (object.hiddenTextarea) {
      object.hiddenTextarea.focus();
    }
  };

  // --1--
  const changeBGColorbyEyeDropper = (e: any) => {
    setpCustomColor(e.hex);
    store.dispatch(handleSetCustomColorMode(true));

    const backgroundColor = e.hex;
    store.dispatch(handleSetCurrentCustomColor(backgroundColor));
    const object = canvas.getObjectByID();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) {
      object.set("backgroundColor", backgroundColor);
      object.saveData("MODIFIED", ["backgroundColor"]);

      if (canvas.notesDrawCanvas) {
        canvas.notesDrawCanvas.backgroundColor = backgroundColor;
        canvas.notesDrawCanvas.requestRenderAll();
      }
    }

    if (group && group._objects) {
      group._objects.forEach((obj: any) => {
        obj.set("backgroundColor", backgroundColor);
      });
      group.saveData("MODIFIED", ["backgroundColor"]);
    }
    canvas.requestRenderAll();
  };

  // --5--
  const changeDrawColorbyEyeDropper = (e: any) => {
    $(".roundColorSelection").children().hide();

    if (e.currentTarget) {
      $(e.currentTarget).siblings(".selected").removeClass("selected");
      $(e.currentTarget).addClass("selected");

      $(e.currentTarget).siblings().children().hide();
      $(e.currentTarget).children().show();

      const strokeColor = $(e.currentTarget).data("color");
      const object = canvas.getObjectByID();
      store.dispatch(handleSetCursorColorOfPen(strokeColor));

      if (canvas && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = strokeColor;
      }
    } else if (e.hex) {
      let strokeColor = e.hex;

      store.dispatch(handleSetCursorColorOfPen(strokeColor));
      if (canvas && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = strokeColor;
      }

      // let brushColor = BoardService.getInstance()
      //   .cursorColorOfPen()
      //   .get();
      if (strokeColor.indexOf("rgb") == -1) {
        strokeColor = hexToRgbA(strokeColor, 1);
      }
      canvas.freeDrawingCursor = getBrushCursorWithColor(strokeColor);
    }
  };

  // --4--
  const changeNoteDrawColorbyEyeDropper = (e: any) => {
    const strokeColor = $(e.currentTarget).data("color");
    const object = canvas.getObjectByID();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) {
      object.set("stroke", strokeColor);
      if (
        canvas &&
        canvas.notesDrawCanvas &&
        canvas.notesDrawCanvas.freeDrawingBrush
      ) {
        canvas.notesDrawCanvas.freeDrawingBrush.color = strokeColor;
      }

      // if (object.objType === "XConnector") {
      //   WidgetService.getInstance().setArrowStroke(strokeColor);
      // }
      object.saveData("MODIFIED", ["stroke"]);
    }

    if (group && group._objects) {
      group._objects.forEach((obj: any) => {
        obj.set("stroke", strokeColor);
        // if (obj.objType === "XConnector") {
        //   WidgetService.getInstance().setArrowStroke(strokeColor);
        // }
      });
      group.saveData("MODIFIED", ["stroke"]);
    }
    canvas.requestRenderAll();
  };

  //   ----- End of Change Color by EyeDropper -----------

  // ----------------------------------------------------------------------------------
  // ------------- below are functions for Color Changing by Picker--------------------
  // ----------------------------------------------------------------------------------

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

  const changeColorbyPicker = (e: any) => {
    setCustomColor(e.rgb);
    store.dispatch(updateDrawColor(e.hex));
    console.log("333344444444444");
    if (
      objectType === "backgroundColor" ||
      objectType === "shapeBackgroundColor"
    ) {
      changeBGColorbyPicker(e); // --1--
    } else if (
      objectType === "fontColor" ||
      objectType === "oldShapeBackgroundColor" ||
      objectType === "fillColor"
    ) {
      changeFillColorbyPicker(e); // --2--
    } else if (
      objectType === "strokeColor" ||
      objectType === "shapeBorderColor"
    ) {
      changeStrokeColorbyPicker(e); // --3--
    } else if (objectType === "noteDrawColor") {
      changeNoteDrawColorbyPicker(e); // --4--
    } else if (objectType === "drawColor") {
      changeDrawColorbyPicker(e); // --5--
    }
    refreshColorChange();
    setColor(e.hex);
  };

  // --1--
  const changeBGColorbyPicker = (e: any) => {
    setpCustomColor(e.hex);
    store.dispatch(handleSetCustomColorMode(true));

    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    const backgroundColor = e.hex;
    store.dispatch(handleSetCurrentCustomColor(backgroundColor));
    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) {
      object.set("backgroundColor", backgroundColor);
      object.saveData("MODIFIED", ["backgroundColor"]);

      if (canvas.notesDrawCanvas) {
        canvas.notesDrawCanvas.backgroundColor = backgroundColor;
        canvas.notesDrawCanvas.requestRenderAll();
      }
    }

    if (group && group._objects) {
      group._objects.forEach((obj: any) => {
        obj.set("backgroundColor", backgroundColor);
      });
      group.saveData("MODIFIED", ["backgroundColor"]);
    }
    canvas.requestRenderAll();
  };

  // --2--
  const changeFillColorbyPicker = (e: any) => {
    setpCustomColor(e.hex);
    store.dispatch(handleSetCustomColorMode(true));

    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    const inputColor = e.hex;
    store.dispatch(handleSetCurrentCustomColor(inputColor));

    let group;
    if (object.length > 1) {
      group = object;
    }

    if (object && !group) {
      object.set("fill", inputColor);
      object.saveData("MODIFIED", ["fill"]);
    }
    if (group && group._objects) {
      group._objects.forEach((obj: any) => {
        obj.set("fill", inputColor);
      });
      group.saveData("MODIFIED", ["fill"]);
    }
    canvas.requestRenderAll();

    if (object.hiddenTextarea) {
      object.hiddenTextarea.focus();
    }
  };

  // --3--
  const changeStrokeColorbyPicker = (e: any) => {
    setpCustomColor(e.hex);
    store.dispatch(handleSetCustomColorMode(true));
    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }
    const strokeColor = e.hex;
    store.dispatch(handleSetCurrentCustomColor(strokeColor));

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) {
      object.set("stroke", strokeColor);
      if (object.objType === "XConnector") {
        store.dispatch(handleSetArrowStroke(strokeColor));
      }
      object.saveData("MODIFIED", ["stroke"]);
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

  // --5--
  const changeDrawColorbyPicker = (e: any) => {
    $(".roundColorSelection").children().hide();

    if (e.currentTarget) {
      $(e.currentTarget).siblings(".selected").removeClass("selected");
      $(e.currentTarget).addClass("selected");

      $(e.currentTarget).siblings().children().hide();
      $(e.currentTarget).children().show();

      const strokeColor = $(e.currentTarget).data("color");
      store.dispatch(handleSetCursorColorOfPen(strokeColor));

      if (canvas && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = strokeColor;
      }
    } else if (e.hex) {
      let strokeColor = e.hex;

      store.dispatch(handleSetCursorColorOfPen(strokeColor));
      store.dispatch(handleSetCurrentCustomColor(strokeColor));

      if (canvas && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = strokeColor;
      }

      // let brushColor = BoardService.getInstance()
      //   .cursorColorOfPen()
      //   .get();
      if (strokeColor.indexOf("rgb") == -1) {
        strokeColor = hexToRgbA(strokeColor, 1);
      }
      canvas.freeDrawingCursor = getBrushCursorWithColor(strokeColor);
    }
  };

  // --4--
  const changeNoteDrawColorbyPicker = (e: any) => {
    const strokeColor = $(e.currentTarget).data("color");

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

  // ----------------------------------------------------------------------------------
  // --------------- End for functions for Color Changing by Picker--------------------
  // ----------------------------------------------------------------------------------

  // ////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////// Below functions (onClickStandardXXColor) are copied from StandardColor///////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////

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
    const color = e.currentTarget.style.backgroundColor;
    store.dispatch(updateDrawColor(color));
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
    clickMe();
    refreshColorChange();
    let c = $(e.currentTarget).data("color");
    setColor(c);
  };

  // Color -- 5
  const onClickStandardDrawColor = (e: any) => {
    $(".roundColorSelection").children().hide();

    $(e.currentTarget).siblings(".selected").removeClass("selected");
    $(e.currentTarget).addClass("selected");

    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data("color");
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
    // For WBRectNote-Draw
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
    let strokeColor;
    if (!opacity) {
      opacity = 100;
    }
    if (inputColor === "#HHH") {
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

    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data("color");
    let fill;
    if (!opacity) {
      opacity = 100;
    }
    if (inputColor === "#HHH") {
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
      object.set("fill", fill);
      object.saveData("MODIFIED", ["fill"]);
    }

    if (group && group._objects) {
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

    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data("color");
    let backgroundColor;
    if (!opacity) {
      opacity = 100;
    }
    if (inputColor === "#HHH") {
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

      if (canvas.notesDrawCanvas) {
        canvas.notesDrawCanvas.backgroundColor = backgroundColor;
        canvas.notesDrawCanvas.requestRenderAll();
      }
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
      canvas.getActiveObject().hiddenTextarea.focus();
  };

  // ////////////////////////////////////////////////////////////////////////////////////////////////////
  // ////////////// Above functions (onClickStandardXXColor) are copied from StandardColor///////////
  // ////////////////////////////////////////////////////////////////////////////////////////////////////

  const isObjectType = () => {
    if (objectType === "drawColor") {
      return (
        <Typography sx={{ p: "6px 0px", fontSize: "14px" }}>
          {t("customColors")}
        </Typography>
      );
    }
    return (
      <div>
        {" "}
        <Typography sx={{ p: "6px 0px", fontSize: "14px" }}>
          {t("customColors")}
        </Typography>
        {/* <ColorizeOutlinedIcon sx={{
          marginLeft: '32px',
          color: '#FFF'
        }} /> */}
      </div>
    );
  };

  const isCustomColorSessionExist = () => {
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
        {colors.map((selection: any, index: any) => (
          <li
            data-color={selection.color}
            key={index}
            onClick={onClickStandardColor}
            style={{
              backgroundColor: selection.color,
              width: "28px",
              height: "28px",
              margin: "8px",
              position: "relative",
              borderRadius: "50%",
              border: "1px solid rgba(0,0,0,.15)",
              listStyle: "none",
              display: "inline-block",
            }}
          >
            <div
              style={{
                display:
                  hexifyColor(color) === selection.color ? "block" : "none",
                backgroundColor: "rgba(255, 255, 255, .15)",
                top: "50%",
                left: "50%",
                width: "28px",
                height: "28px",
                position: "absolute",
                border: "2px solid #F21D6B",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
              }}
            />
          </li>
        ))}
        <li
          style={{
            width: "28px",
            height: "28px",
            margin: "8px",
            position: "relative",
            listStyle: "none",
            display: "inline-block",
          }}
          id="customColors"
          onClick={() => setDisplayColorPicker(!displayColorPicker)}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="14" cy="14" r="14" fill="white" />
            <circle
              cx="14"
              cy="14"
              r="13.5"
              stroke="black"
              strokeOpacity="0.16"
            />
            <path
              d="M14 7V21M7 14H21"
              stroke="#636B74"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {isDisplayColorPicker()}
        </li>
      </Box>
    );
  };

  const isDisplayColorPicker = () => {
    if (displayColorPicker) {
      return (
        <div
          style={{
            position: "fixed",
            zIndex: "50",
            transform: "rotateZ(180deg)",
          }}
        >
          <div>
            <div
              style={{
                position: "fixed",
                zIndex: "100",
                transform: "rotateZ(180deg)",
                left: "17.5px",
                top: "-54px",
              }}
            >
              <ChromePicker
                color={customColor}
                onChangeComplete={changeColorbyPicker}
                onClose={handleclose}
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    let array = [];

    if (localStorage.getItem("customColors")) {
      //@ts-ignore
      array = JSON.parse(localStorage.getItem("customColors"));
    }
    store.dispatch(handleSetCustomColors(array));
  }, []);

  return (
    <div>
      <div
        style={{
          display: "inline-block",
        }}
      >
        {isObjectType()}
        {isCustomColorSessionExist()}
      </div>
    </div>
  );
}
