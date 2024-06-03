import { useState } from "react";
import Slider from "@mui/joy/Slider";
import Typography from "@mui/joy/Typography";
import { useTranslation } from "../../../services/i18n/client";
import store from "../../../redux/store";
import { handleSetOpacityValue } from "../../../redux/features/widgets.slice";
import Box from "@mui/joy/Box";

const hexToRgbA = function (hex: any, opacity: any) {
  let c: any;
  let o: any;

  if (hex.length === 9) {
    hex = hex.substr(0, 7);
  }
  if (hex.length != 7) {
    const op = hex.slice(-2);
    o = parseInt(op, 16) / 100;
  } else {
    o = opacity;
  }
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join("")}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",")},${o})`;
  }
  return "rgba(0, 0, 0, 0)";
};

const rgbaToHex = function (orig: any) {
  let a: any;
  let isPercent;
  const rgb = orig
    .replace(/\s/g, "")
    .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
  var alpha = ((rgb && rgb[4]) || "").trim();
  const hex = rgb
    ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
    (rgb[2] | (1 << 8)).toString(16).slice(1) +
    (rgb[3] | (1 << 8)).toString(16).slice(1)
    : orig;
  if (alpha !== "") {
    a = alpha;
  } else {
    a = "01";
  }

  a = Math.round(a * 100) / 100;
  var alpha: any = Math.round(a * 255);
  const hexAlpha = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();

  return `#${hex}`;
};

export default function ColorOpacity(props: any) {
  const objectType = props.objectType;
  const opacityValue = props.opacityValue;
  const canvas = props.canvas;
  const [initialValue, setInitialValue] = useState(opacityValue);
  const { t } = useTranslation("menu");
  // const canvas: any = BoardService.getInstance().getBoard();
  const getOpacityonmouseup = (e: any) => {
    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    /** 
    * Object Fields:
    *
    * 1. backgroundColor: backgroundColor, shapeBackgroundColor
    * 2. fill : fillColor, fontColor, oldShapeBackgroundColor
    * 3. stroke : strokeColor, shapeBorderColor
    * 4. canvas.notesDrawCanvas.freeDrawingBrush.color
    * 5. canvas.freeDrawingBrush.color
  
    * a. WBTitle/XText: backgroundColor--1, fontColor--2
    * b. WBCircleNote/WBRectNote: backgroundColor--1, fontColor--2
    * c. WBRectNoteDraw: backgroundColor--1, noteDrawColor--4
    * d. WBPath: background--1, fillColor--2, strokeColor--3, drawColor--5
    * e. (OLD New) WBTriangle/WBRectPanel/WBCircle(Shapes): oldShapeBackgroundColor--2, shapeBorderColor--3
    * e. (Stop using) WBTriangle/WBRectPanel/WBCircle(Shapes): shapeBackgroundColor--1, shapeBorderColor --3, fontColor--2
    * e. (New)XShapeNotes:: shapeBackgroundColor--1, shapeBorderColor --3, fontColor--2
    * f. XConnector: strokeColor--3
    * ----------------------------------------------
    * g. WBPolygon (onClickStandardPolylineArrowColor--color assigned to both stroke & fill) & WBModel:No longer in use.
  
    */
    if (!group) {
      if (objectType === "shapeBorderColor" || objectType === "strokeColor") {
        //old and new shape border color opacity
        object.saveData("MODIFIED", ["stroke"]);
      }
      if (
        objectType === "shapeBackgroundColor" ||
        objectType === "backgroundColor"
      ) {
        //old shapes background color
        object.saveData("MODIFIED", ["backgroundColor"]);
      }
      if (
        objectType === "fillColor" ||
        objectType === "fontColor" ||
        objectType === "oldShapeBackgroundColor"
      ) {
        //old shapes background color
        object.saveData("MODIFIED", ["fill"]);
      }
    } else {
      group.saveData("MODIFIED", ["backgroundColor", "fill", "stroke"]);
    }

    canvas.requestRenderAll();
  };

  const onChangeOpacity = (e: any, newValue: any) => {
    e.stopPropagation();
    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    const opacityLevelValue = parseInt(newValue);
    setInitialValue(opacityLevelValue);
    store.dispatch(handleSetOpacityValue(opacityLevelValue));

    let rgba_backgroundColor;
    let rgba_fillColor;
    let rgba_strokeColor;

    /**
     * 1. backgroundColor: backgroundColor, shapeBackgroundColor
     * 2. fill : fillColor, fontColor, oldShapeBackgroundColor
     * 3. stroke : strokeColor, shapeBorderColor
     * 4. canvas.notesDrawCanvas.freeDrawingBrush.color
     * 5. canvas.freeDrawingBrush.color
     */
    if (!group) {
      if (objectType === "shapeBorderColor" || objectType === "strokeColor") {
        if (object.stroke) {
          if (object.stroke.indexOf("rgb") > -1) {
            rgba_strokeColor = rgbaToHex(object.stroke);
          } else {
            rgba_strokeColor = object.stroke;
          }

          rgba_strokeColor = hexToRgbA(
            rgba_strokeColor.substring(0, 7),
            opacityLevelValue / 100
          );

          object.set("stroke", rgba_strokeColor);
        }
      } else if (
        objectType === "fillColor" ||
        objectType === "fontColor" ||
        objectType === "oldShapeBackgroundColor"
      ) {
        if (object.fill) {
          if (object.fill.indexOf("rgb") > -1) {
            rgba_fillColor = rgbaToHex(object.fill);
          } else {
            rgba_fillColor = object.fill;
          }

          rgba_fillColor = hexToRgbA(
            rgba_fillColor.substring(0, 7),
            opacityLevelValue / 100
          );

          object.set("fill", rgba_fillColor);
        }
      } else if (
        objectType === "shapeBackgroundColor" ||
        objectType === "backgroundColor"
      ) {
        if (object.backgroundColor) {
          if (object.backgroundColor.indexOf("rgb") > -1) {
            rgba_backgroundColor = rgbaToHex(object.backgroundColor);
          } else {
            rgba_backgroundColor = object.backgroundColor;
          }

          rgba_backgroundColor = hexToRgbA(
            rgba_backgroundColor.substring(0, 7),
            opacityLevelValue / 100
          );

          object.set("backgroundColor", rgba_backgroundColor);
        }
      }
    } else {
      /**
       * if group of items are selected, all color's opacities will be changed accordingly.
       */
      group._objects.forEach(function (obj: any) {
        if (obj.backgroundColor) {
          if (obj.backgroundColor.indexOf("rgb") > -1) {
            rgba_backgroundColor = rgbaToHex(obj.backgroundColor);
          } else {
            rgba_backgroundColor = obj.backgroundColor;
          }

          rgba_backgroundColor = hexToRgbA(
            rgba_backgroundColor.substring(0, 7),
            opacityLevelValue / 100
          );

          obj.set("backgroundColor", rgba_backgroundColor);
        }
        if (obj.fill) {
          if (obj.fill.indexOf("rgb") > -1) {
            rgba_fillColor = rgbaToHex(obj.fill);
          } else {
            rgba_fillColor = obj.fill;
          }

          rgba_fillColor = hexToRgbA(
            rgba_fillColor.substring(0, 7),
            opacityLevelValue / 100
          );

          obj.set("fill", rgba_fillColor);
        }

        if (obj.stroke) {
          if (obj.stroke.indexOf("rgb") > -1) {
            rgba_strokeColor = rgbaToHex(obj.stroke);
          } else {
            rgba_strokeColor = obj.stroke;
          }

          rgba_strokeColor = hexToRgbA(
            rgba_strokeColor.substring(0, 7),
            opacityLevelValue / 100
          );

          obj.set("stroke", rgba_strokeColor);
        }
      });
    }
  };

  return (
    <Box
      sx={{
        ".rail": {
          height: 8,
          borderRadius: 4,
        },
        track: {
          height: 8,
          borderRadius: 4,
        },
        valueLabel: { left: "calc(-50% + 4px)" },
        ".thumb": {
          height: 24,
          width: 24,

          border: "2px solid currentColor",
          "&:focus, &:hover, &$active": {
            boxShadow: "inherit",
          },
        },
        ".root": {
          color: "#52af77",
          height: 8,
        },
      }}
    >
      <Typography sx={{ p: "6px 0px", fontSize: "14px" }}>
        {t("opacity")}
      </Typography>
      <Slider
        defaultValue={100}
        aria-label="pretto slider"
        max={100}
        min={0}
        onChange={onChangeOpacity}
        onChangeCommitted={getOpacityonmouseup}
        value={initialValue}
        valueLabelDisplay="auto"
        sx={{ width: "152px", p: "16px 0px", ml: "8px" }}
      />
    </Box>
  );
}
