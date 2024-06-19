//** Import react
import React, { useEffect } from "react";


import IconButton from "@mui/joy/IconButton";
// import FitScreenOutlinedIcon from "../../mui/icons/FitScreenOutlinedIcon";
import { IconMinus, IconPlus, IconViewportWide } from "@tabler/icons-react";


import Sheet from "@mui/joy/Sheet";

import { Typography } from "@mui/joy";

import * as fabric from '../../../../../fabric';
import { useSelector } from "react-redux";
import store, { RootState } from "../../redux/store";
import { handleSetZoomFactor, handleWidgetMenuDisplay } from "../../redux/features/board.slice";



export default function MiniCanvas({ canvas }: { canvas: fabric.XCanvas }) {

  //@ts-ignore
  // const users = useUsers(Boardx.awareness);
  //slide dom

  //dom
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [isSlidemode, setIsSlidemode] = React.useState(false);
  // const [isPresentationMode, setIsPresentationMode] = React.useState(false);
  const miniMapElement: any = React.useRef();
  const zoomFactor = useSelector((state: RootState) => state.board.zoomFactor) || 1;


  const [miniMapSize, setMiniMapSize] = React.useState(zoomFactor || 1);
  // const [timers, setTimers] = React.useState([]);
  // const zoomCallBack: any = React.useRef();

  useEffect(() => {
    let valueSlider = 0;
    valueSlider = parseInt(
      ((zoomFactor == undefined ? 1 : zoomFactor) * 100).toString() || "10",
      10
    );
    setMiniMapSize(valueSlider);
  }, [zoomFactor]);

  // useEffect(() => {
  //   EventService.getInstance().register(
  //     EventNames.RETURN_DEFAULT_ZOOMM,
  //     returnDefaultZoom
  //   );
  // }, []);

  let isLarger = false;
  const handleZoom = () => {
    let zoom = getZoomSize();
    if (!isLarger) {
      zoom += random(20, 10);
      if (zoom > 100) zoom = 100;
    } else {
      zoom -= random(20, 10);
      if (zoom < 100) zoom = 100;
    }
    handleChange(zoom);
    setMiniMapSize(zoom);
    store.dispatch(handleSetZoomFactor(zoom / 100));
    // if (zoom === 100) {
    //   timers.forEach((timer) => {
    //     clearInterval(timer);
    //   });
    // }
  };
  const random = (max: number, min: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  const getZoomSize = () => {
    return parseInt((zoomFactor * 100).toString() || "10", 10);
  };

  const handleFitToScreen = async () => {
    const zoom = await canvas?.zoomToViewAllObjects();
    handleChange(zoom);
    setMiniMapSize(zoom);
  };

  const returnDefaultZoom = () => {
    if (getZoomSize() === 100) {
      return;
    }
    if (getZoomSize() > 100) {
      isLarger = true;
    } else {
      isLarger = false;
    }
    handleZoom();
  };

  const handleChange = (newValue: number) => {
    let canvas = (window as any).canvas;
    store.dispatch(handleWidgetMenuDisplay(false))
    if (typeof newValue === 'number') {
      canvas.setZoom(newValue / 100);
      store.dispatch(handleSetZoomFactor(newValue / 100));
      canvas.zoomToCenterPoint(canvas.getVpCenter(), newValue / 100);
      canvas.updateViewport();
      canvas.requestRenderAll();
    }
  };

  const handleClickZoominOut = (change: any) => {
    // Determine the new zoom level, ensuring it doesn't go below 0.05
    const newZoom = Math.max(canvas.getZoom() + change, 0.05);

    // Zoom to the center point of the canvas with the new zoom level
    canvas.zoomToCenterPoint(canvas.getVpCenter(), newZoom);

    // Re-render the canvas to apply the zoom change
    canvas.renderAll();

    // Adjust the miniMapSize and handle the change
    const newMiniMapSize = newZoom * 100;
    handleChange(newMiniMapSize);
  };

  // if (store.getState().slides.createSlidesMode == true && anchorEl) {
  //   setIsSlidemode(true);
  //   setAnchorEl(null);
  // }

  // if (store.getState().slides.presentationMode == true && anchorEl) {
  //   setIsPresentationMode(true);
  //   setAnchorEl(null);
  // }

  // React.useEffect(() => {
  //   if (isSlidemode && store.getState().slides.createSlidesMode == false) {
  //     if (miniMapElement.current) {
  //       setAnchorEl(miniMapElement.current);
  //       setIsSlidemode(false);
  //     }
  //   }

  //   if (
  //     isPresentationMode &&
  //     store.getState().slides.presentationMode == false
  //   ) {
  //     if (miniMapElement.current) {
  //       setAnchorEl(miniMapElement.current);
  //       setIsPresentationMode(false);
  //     }
  //   }
  // }, [miniMapElement.current]);

  return (
    <Sheet
      sx={{
        zIndex: 1000,
        position: "fixed",
        bottom: "15px",
        right: "92px",
        height: "44px",
        padding: "12px 0",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "var(--joy-shadow-md)",
        borderRadius: "8px",
        boxSizing: "border-box",
      }}
      id="miniMapContainer"
      data-tut="reactour__miniMap"
      ref={miniMapElement}
    >

      <IconButton onClick={handleFitToScreen}>
        <IconViewportWide style={{ width: "20px", height: "20px" }} />
      </IconButton>


      <IconButton onClick={() => handleClickZoominOut(-0.1)}>
        <IconMinus />
      </IconButton>
      <Typography /*width='52px' justifyContent="center"*/>
        {miniMapSize}%
      </Typography>

      <IconButton onClick={() => handleClickZoominOut(0.1)}>
        <IconPlus />
      </IconButton>
    </Sheet>
  );
}
