import { useMemo, useState, useEffect } from "react";
import Tooltip from "@mui/joy/Tooltip";
import Popover from "@mui/material/Popover";
import Slider from "@mui/joy/Slider";
import { useTranslation } from "../../services/i18n/client";
import Sheet from "@mui/joy/Sheet";
import ToggleButton from "@mui/material/ToggleButton";
import StandardColor from "../widgetMenu/Colors/StandardColor";
import CustomColor from "../widgetMenu/Colors/CustomColor";
import { DrawSvg } from "../svg/widgetToolBarMenuSvg";
import { useSelector } from "react-redux";
import store, { RootState } from "../../redux/store";
import {
  updateDrawColor,
  updateDrawWidth,
} from "../../redux/features/widget/draw";
import { useDispatch } from "react-redux";
import { changeMode } from "../../redux/features/mode.slice";
import { handleSetDrawColorPopUp } from "../../redux/features/board.slice";
import { handleSetCustomColors } from "../../redux/features/widgets.slice";
import { updateStickyNoteMenuBarOpenStatus } from "../../redux/features/widget/stickNote";
import IconButton from "@mui/joy/IconButton";
import { Box } from "@mui/joy";
import { IconChevronDown, IconEraser, IconX } from "@tabler/icons-react";
import { BoardService } from "../../services";

const MenuDrawing = () => {
  const canvas: any = BoardService.getInstance().getBoard();
  const dispatch = useDispatch();
  const { t } = useTranslation("menu");
  const brushWidth = useSelector(
    (state: RootState) => state.widget.draw.brushWidth
  );
  const brushColor = useSelector(
    (state: RootState) => state.widget.draw.brushColor
  );
  const modeType = useSelector((state: RootState) => state.mode.type);

  const [colorPadOpen, setColorPadOpen] = useState(false);

  const toolBarShow = useMemo(
    () => modeType === "draw" || modeType === "eraser",
    [modeType]
  );

  function handleCloseDrawMode() {
    dispatch(changeMode("default"));
  }

  function toggleColorPad() {
    setColorPadOpen(!colorPadOpen);
  }

  useEffect(() => {
    if (canvas && canvas.freeDrawingBrush)
      canvas.freeDrawingBrush.color = brushColor;
  }, [brushColor]);

  function addCustomColor() {
    if (store.getState().widgets.currentCustomColor) {
      const currentColor = store.getState().widgets.currentCustomColor;
      let colorArray = [];
      let array = [];
      const arraySize = 11;
      let isColorExist = false;

      // console.log('current color: ', currentColor)

      if (localStorage.getItem("customColors")) {
        const storedColors = localStorage.getItem("customColors");
        if (storedColors) {
          const colorArray = JSON.parse(storedColors);
          colorArray.forEach((pColor: any) => {
            if (pColor.color === currentColor) {
              isColorExist = true;
            }
          });

          if (!isColorExist) {
            colorArray.unshift({ color: currentColor });
          }

          localStorage.setItem("customColors", JSON.stringify(colorArray));
        }
      }
      if (!isColorExist) {
        colorArray.unshift({ color: currentColor });
      }

      localStorage.setItem("customColors", JSON.stringify(colorArray));
      store.dispatch(handleSetCustomColors(colorArray));
    }
  }

  function handleCloseColorPad() {
    setColorPadOpen(false);
    store.dispatch(handleSetDrawColorPopUp(false));
    addCustomColor();
  }

  function handleChangeEraserMode() {
    dispatch(changeMode("eraser"));
  }

  function handleOpenDrawMode() {
    dispatch(changeMode("draw"));
    dispatch(updateStickyNoteMenuBarOpenStatus(false));
  }

  function changeDrawThickness(value: any) {
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = value;
    }

    canvas.requestRenderAll();
    dispatch(updateDrawWidth(value));
    dispatch(changeMode("draw"));
  }

  function handleColorSelected(color: any) {
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }

    canvas.requestRenderAll();
    if (color) {
      dispatch(updateDrawColor(color));
    }

    setColorPadOpen(false);
  }

  const id = toolBarShow ? "draw-popover" : undefined;
  useEffect(() => {
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = null;
    }
    dispatch(updateDrawColor("rgba(88,88,88, 1)"));

    dispatch(updateDrawWidth(4));
    return () => {
      setColorPadOpen(false);
      dispatch(updateDrawColor(null));
      dispatch(updateDrawWidth(null));
      dispatch(changeMode("default"));
    };
  }, []);
  return (
    <div>
      <Tooltip arrow placement="top" title={t("draw")}>
        <ToggleButton
          selected={modeType === "draw"}
          value="draw"
          onClick={handleOpenDrawMode}
          sx={{
            borderWidth: "0px",
            p: 0,
            mr: "16px",
            borderRadius: "6px",
            backgroundColor: toolBarShow
              ? "var(--joy-palette-primary-100) !important"
              : null,
          }}
        >
          <DrawSvg color={brushColor} />
        </ToggleButton>
      </Tooltip>

      <Sheet
        sx={{
          height: "40px",
          position: "fixed",
          left: "50%",
          bottom: "68px",
          transform: "translateX(-50%)",
          display: toolBarShow ? "flex" : "none",
          alignItems: "center",
          boxShadow: "var(--joy-shadow-md)",
          justifyContent: "space-around",
          borderRadius: "8px",
          padding: "4px 8px",
        }}
        id={id}
      >
        <div
          style={{
            cursor: "pointer",
          }}
        >
          <IconButton
            aria-describedby={id}
            aria-label="bold"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              p: "6px 4px 6px 7px",
              minHeight: "32px",
            }}
            id="drawColorPopupButton"
            value="backgroundColor"
            onClick={toggleColorPad}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 9C-1.76112e-08 10.1819 0.232792 11.3522 0.685084 12.4442C1.13738 13.5361 1.80031 14.5282 2.63604 15.364C3.47177 16.1997 4.46392 16.8626 5.55585 17.3149C6.64778 17.7672 7.8181 18 9 18C10.1819 18 11.3522 17.7672 12.4442 17.3149C13.5361 16.8626 14.5282 16.1997 15.364 15.364C16.1997 14.5282 16.8626 13.5361 17.3149 12.4442C17.7672 11.3522 18 10.1819 18 9C18 7.8181 17.7672 6.64778 17.3149 5.55585C16.8626 4.46392 16.1997 3.47177 15.364 2.63604C14.5282 1.80031 13.5361 1.13738 12.4442 0.685084C11.3522 0.232792 10.1819 0 9 0C7.8181 0 6.64778 0.232792 5.55585 0.685084C4.46392 1.13738 3.47177 1.80031 2.63604 2.63604C1.80031 3.47177 1.13738 4.46392 0.685084 5.55585C0.232792 6.64778 -1.76112e-08 7.8181 0 9Z"
                fill={brushColor}
              />
            </svg>

            <IconChevronDown
              style={{
                marginLeft: "7px",
                width: "20px",
                height: "20px",
                strokeWidth: "var(--joy-lineHeight-sm)",
              }}
            />
          </IconButton>
          <Popover
            anchorEl={document?.getElementById("drawColorPopupButton")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{
              paper: {
                width: "192px",
                height: "auto",
              },
              "& .MuiPaper-root": {
                p: "4px 8px",
                borderRadius: "8px",
              },
            }}
            id={id}
            onClose={handleCloseColorPad}
            open={colorPadOpen}
            transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <StandardColor
              clickMe={handleColorSelected}
              objectType="drawColor"
            />
            <CustomColor
              canvas={canvas}
              objectType="drawColor"
              setpCustomColor="#fff"
              clickMe={handleColorSelected}
              color={"#fff"}
              opacityValue={1}
              setColor={() => { }}
            />
          </Popover>
        </div>

        <Box
          sx={{
            width: "1px",
            height: "24px",
            backgroundColor: "#CDD7E1",
            m: "0px 8px",
          }}
        ></Box>

        <IconButton
          onClick={() => changeDrawThickness(4)}
          sx={{
            display: "flex",
            justifyContent: "center",
            mr: "8px",
            p: 0,
            minWidth: "24px",
            minHeight: "24px",
            borderRadius: "4px",
            backgroundColor:
              brushWidth === 4 && modeType === "draw"
                ? "#EAEEF6 !important"
                : "transparent",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="11" width="16" height="2" fill="currentColor" />
          </svg>
        </IconButton>

        <IconButton
          onClick={() => changeDrawThickness(8)}
          sx={{
            display: "flex",
            justifyContent: "center",
            mr: "8px",
            p: 0,
            minWidth: "24px",
            minHeight: "24px",
            borderRadius: "4px",
            backgroundColor:
              brushWidth === 8 && modeType === "draw"
                ? "#EAEEF6 !important"
                : "transparent",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="10" width="16" height="4" fill="currentColor" />
          </svg>
        </IconButton>

        <IconButton
          onClick={() => changeDrawThickness(12)}
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 0,
            minWidth: "24px",
            minHeight: "24px",
            borderRadius: "4px",
            backgroundColor:
              brushWidth === 12 && modeType === "draw"
                ? "#EAEEF6 !important"
                : "transparent",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="9" width="16" height="6" fill="currentColor" />
          </svg>
        </IconButton>

        {/* <ListItemButton
          selected={brushWidth === 18 && modeType === 'draw'}
          onClick={() => changeDrawThickness(18)}
          sx={{ width: '40px', display: 'flex', justifyContent: 'center' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="widgetMenuImgSize"
          >
            <rect
              y="2"
              width="16"
              height="18"
              fill="var(--joy-palette-text-icon)"
            />
          </svg>
        </ListItemButton> */}

        <Box
          sx={{
            width: "1px",
            height: "24px",
            backgroundColor: "#CDD7E1",
            m: "0px 8px",
          }}
        ></Box>

        <IconButton
          onClick={handleChangeEraserMode}
          sx={{
            display: "flex",
            justifyContent: "center",
            mr: "8px",
            p: 0,
            minWidth: "24px",
            minHeight: "24px",
            borderRadius: "4px",
            backgroundColor:
              modeType === "eraser" ? "#EAEEF6 !important" : "transparent",
          }}
        >
          <IconEraser style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
        </IconButton>

        <IconButton
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 0,
            minWidth: "24px",
            minHeight: "24px",
            borderRadius: "4px",
          }}
          onClick={handleCloseDrawMode}
        >
          <IconX style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
        </IconButton>
      </Sheet>
    </div>
  );
};

const PrettoSlider = Slider;

export default MenuDrawing;
