import React from "react";
import PanoramaFishEyeOutlinedIcon from "@mui/icons-material/PanoramaFishEyeOutlined";
import PaletteIcon from "@mui/icons-material/Palette";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import Popover from "@mui/material/Popover";
import ColorOpacity from "./ColorOpacity";
import StandardColor from "./StandardColor";
import CustomColor from "./CustomColor";

import store from "../../../redux/store";
import {
  handleSetCustomColors,
  handleSetDropdownDisplayed,
  handleSetCurrentCustomColor,
} from "../../../redux/features/widgets.slice";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import {
  IconChevronDown,
  IconCircleFilled,
  IconTextColor,
} from "@tabler/icons-react";


const opacityFromRgbA = function (orig: any) {
  let a;
  let isPercent;
  let rgb: any = orig
    .replace(/\s/g, "")
    .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
  return parseInt((rgb[4] * 100).toString());
}

export default function ColorWidget(props: any) {
  const {
    objectType,
    color,
    setColor,
    opacityValue,
    touch,
    paddingLeft,
    paddingRight,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [pCustomColor, setpCustomColor] = React.useState(null);

  let syncOpacityValue;

  if (color.indexOf("rgba") > -1) {
    syncOpacityValue = opacityFromRgbA(color);
  } else {
    syncOpacityValue = 100;
  }

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    loadCustomColorList();
  };

  const handleModalClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
    addCustomColor();
  };

  const handleBlur = (e: any) => {
    store.dispatch(handleSetDropdownDisplayed(false));
  };

  const handleFocus = (e: any) => {
    store.dispatch(handleSetDropdownDisplayed(true));
  };

  const loadCustomColorList = () => {
    const colorArray = [];
    let array = [];
    const arraySize = 11;

    if (localStorage.getItem("customColors")) {
      // @ts-ignore
      array = JSON.parse(localStorage.getItem("customColors"));
    }
    store.dispatch(handleSetCustomColors(array));
  };

  const addCustomColor = () => {
    if (store.getState().widgets.currentCustomColor) {
      const currentColor = store.getState().widgets.currentCustomColor;
      let colorArray = [];
      let array = [];
      const arraySize = 11;
      let isColorExist = false;

      if (localStorage.getItem("customColors")) {
        // @ts-ignore
        array = JSON.parse(localStorage.getItem("customColors"));
        colorArray = array.slice(0, arraySize);
      }

      colorArray.forEach((pColor: any) => {
        if (pColor.color === currentColor) {
          isColorExist = true;
        }
      });

      if (!isColorExist) {
        colorArray.unshift({ color: currentColor });
      }

      localStorage.setItem("customColors", JSON.stringify(colorArray));
      store.dispatch(handleSetCustomColors(colorArray));
      store.dispatch(handleSetCurrentCustomColor(null));
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const setToggleIcon = () => {
    if (
      objectType === "backgroundColor" ||
      objectType === "shapeBackgroundColor" ||
      objectType === "oldShapeBackgroundColor"
    ) {
      if (
        color === "#FBFCFC" ||
        color === "white" ||
        color === "#ffffff" ||
        color === "#FFFFFF"
      ) {
        return (
          // <div
          //   style={{
          //     width: '16px',
          //     height: '16px',
          //     border: '0.5px solid rgba(0,0,0,.15)',
          //     display: 'inline-block',
          //     borderRadius: '50%',
          //     backgroundColor: '#F0F0F0'
          //   }}
          // />
          <IconCircleFilled style={{ color: "#F0F0F0" }} />
        );
      }
      if (syncOpacityValue === 0) {
        return (
          <img
            style={{ width: "16px", height: "16px" }}
            src="/images/BackgroundTransparentImg.png"
          />
        );
      }
      return (
        // <div
        //   style={{
        //     width: '16px',
        //     height: '16px',
        //     border: '0.5px solid rgba(0,0,0,.15)',
        //     display: 'inline-block',
        //     borderRadius: '50%', backgroundColor: color
        //   }}
        // />
        <IconCircleFilled style={{ color: color }} />
      );
    }
    if (objectType === "fontColor") {
      if (
        color === "#FBFCFC" ||
        color === "#fff" ||
        color === "#ffffff" ||
        color === "#FFFFFF" ||
        color === "#FFFFFF"
      ) {
        return (
          // <FormatColorTextOutlinedIcon
          //   style={{ width: 26, color: '#E8E8E8' }}
          // />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <g clipPath="url(#clip0_252_290)">
              <path
                d="M3.66016 13H2.47692L6.97443 0.636363H8.18182L12.6793 13H11.4961L7.62038 2.10334H7.53587L3.66016 13ZM4.51136 8.26101H10.6449V9.27521H4.51136V8.26101Z"
                fill="var(--joy-palette-text-icon)"
              />
              <rect y="14" width="16" height="2" fill="#E8E8E8" />
            </g>
            <defs>
              <clipPath id="clip0_252_290">
                <rect
                  width="16"
                  height="16"
                  fill="var(--joy-palette-text-icon)"
                />
              </clipPath>
            </defs>
          </svg>
        );
      }
      if (syncOpacityValue === 0) {
        return (
          // <FormatColorTextOutlinedIcon
          //   style={{ width: 26, color: '#A8A8A8' }}
          // />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <g clipPath="url(#clip0_252_290)">
              <path
                d="M3.66016 13H2.47692L6.97443 0.636363H8.18182L12.6793 13H11.4961L7.62038 2.10334H7.53587L3.66016 13ZM4.51136 8.26101H10.6449V9.27521H4.51136V8.26101Z"
                fill="#A8A8A8"
              />
              <rect y="14" width="16" height="2" fill="#A8A8A8" />
            </g>
            <defs>
              <clipPath id="clip0_252_290">
                <rect
                  width="16"
                  height="16"
                  fill="var(--joy-palette-text-icon)"
                />
              </clipPath>
            </defs>
          </svg>
        );
      }
      return (
        <>
          {/* <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2829_4007)" fill={color}>
              <path
                strokeWidth="0.1"
                d="M3.66016 12H2.47692L6.97443 -0.363637H8.18182L12.6793 12H11.4961L7.62038 1.10334H7.53587L3.66016 12ZM4.51136 7.26101H10.6449V8.27521H4.51136V7.26101Z"
                fill="var(--joy-palette-text-icon)"
              />
              <rect y="14" width="16" height="3" style={{ stroke: color }} />
            </g>
            <defs>
              <clipPath id="clip0_2829_4007">
                <rect width="16" height="17" fill="white" />
              </clipPath>
            </defs>
          </svg> */}

          <IconTextColor style={{ color: color }} />
        </>
      );
    }
    if (objectType === "strokeColor" || objectType === "polylineArrowColor") {
      if (
        color === "#FBFCFC" ||
        color === "#fff" ||
        color === "#ffffff" ||
        color === "#FFFFFF" ||
        color === "#FFFFFF" ||
        color === "standard"
      ) {
        return (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="widgetMenuImgSize"
            >
              <circle
                cx="8"
                cy="8"
                r="8"
                fill="#E8E8E8"
                style={{ stroke: "transparent" }}
              />
              <circle
                cx="8"
                cy="8"
                r="7.5"
                style={{ stroke: "transparent" }}
                strokeOpacity="0.16"
              />
            </svg>
          </>
        );
      }
      if (syncOpacityValue === 0) {
        return (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="widgetMenuImgSize"
            >
              <circle
                cx="8"
                cy="8"
                r="8"
                style={{ stroke: "transparent" }}
                fill="#A8A8A8"
              />
              <circle
                cx="8"
                cy="8"
                r="7.5"
                style={{ stroke: "transparent" }}
                strokeOpacity="0.16"
              />
            </svg>
          </>
        );
      }
      return (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="widgetMenuImgSize"
          >
            <circle
              cx="8"
              cy="8"
              r="8"
              fill={color}
              style={{ stroke: "transparent" }}
            />
            <circle
              cx="8"
              cy="8"
              r="7.5"
              style={{ stroke: "transparent" }}
              strokeOpacity="0.16"
            />
          </svg>
        </>
      );
    }
    if (objectType === "shapeBorderColor") {
      //
      if (
        color === "#FBFCFC" ||
        color === "#fff" ||
        color === "#ffffff" ||
        color === "#FFF" ||
        color === "#FFFFFF"
      ) {
        return (
          <>
            <svg
              width="17"
              height="17"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="7.5" fill="white" stroke="#F5F5F5" />
            </svg>
          </>
        );
      }
      if (syncOpacityValue === 0) {
        return (
          <img
            style={{ width: "16px", height: "16px" }}
            src="/images/BorderTransparentImg.png"
          />
        );
      }
      return (
        <>
          <svg
            width="17"
            height="17"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="8"
              cy="8"
              r="7.5"
              fill="white"
              style={{ stroke: color }}
            />
          </svg>
        </>
      );
    }
    if (objectType === "fillColor") {
      if (
        color === "#FBFCFC" ||
        color === "#fff" ||
        color === "#ffffff" ||
        color === "#FFF" ||
        color === "#FFFFFF"
      ) {
        return <FormatColorFillIcon style={{ color: "#E8E8E8" }} />;
      }
      if (syncOpacityValue === 0) {
        return <FormatColorFillIcon style={{ color: "#A8A8A8" }} />;
      }
      return <FormatColorFillIcon style={{ color }} />;
    }
    if (objectType === "noteDrawColor") {
      if (
        color === "#FBFCFC" ||
        color === "#fff" ||
        color === "#ffffff" ||
        color === "#FFF" ||
        color === "#FFFFFF"
      ) {
        return <PaletteIcon style={{ width: 16, color: "#E8E8E8" }} />;
      }
      if (syncOpacityValue === 0) {
        return <PaletteIcon style={{ width: 16, color: "#A8A8A8" }} />;
      }
      return <PaletteIcon style={{ width: 16, color }} />;
    }
    return <PanoramaFishEyeOutlinedIcon style={{ color }} />;
  };

  return (
    <Box>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "60px",
        }}
        onClick={handleClick}
      >
        <Button
          aria-describedby={id}
          aria-label="bold"
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
            <IconChevronDown style={{ width: "20px", height: "20px" }} />
          }
        >
          {setToggleIcon()}
        </Button>
      </div>

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          top: 10,
          left: 230,
          "& .MuiPopover-paper": {
            padding: "4px 8px",
            borderRadius: "8px",
          },
        }}
        id={id}
        onBlur={handleBlur}
        onClose={handleClose}
        onFocus={handleFocus}
        open={open}
        transformOrigin={{
          vertical: touch ? "bottom" : "top",
          horizontal: "right",
        }}
      >
        <StandardColor
          clickMe={handleClose}
          objectType={objectType}
          opacityValue={syncOpacityValue}
          color={color}
          setColor={setColor}
          canvas={props.canvas}
        />
        {touch ? null : (
          <CustomColor
            clickMe={handleClose}
            color={color}
            objectType={objectType}
            opacityValue={syncOpacityValue}
            setpCustomColor={setpCustomColor}
            setColor={setColor}
            canvas={canvas}
          />
        )}
        {touch ? null : (
          <ColorOpacity
            objectType={objectType}
            opacityValue={syncOpacityValue}
          />
        )}
      </Popover>
    </Box>
  );
}
