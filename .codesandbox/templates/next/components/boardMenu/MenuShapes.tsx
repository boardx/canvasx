import React, { useCallback } from "react";
import { useTranslation } from "../../services/i18n/client";
import { Tooltip } from "@mui/joy";
import MenuItem from "@mui/material/MenuItem";

import { useDispatch, useSelector } from "react-redux";
import { changeMode } from "../../redux/features/mode.slice";
import { updateShapeType } from "../../redux/features/widget/shape";
import { RootState } from "../../redux/store";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";

import {
  IconChevronUp,
  IconRectangle,
  IconSquareRotated,
  IconSquareRounded, IconHexagon,
  IconTriangle,
  IconCircle,
  IconX
} from "@tabler/icons-react";

import StarIcon from "../../mui/icons/StarIcon";
import CrossIcon from "../../mui/icons/CrossIcon";
import LeftsideRightTriIcon from "../../mui/icons/LeftsideRightTriIcon";
import RightsideRightTriIcon from "../../mui/icons/RightsideRightTriIcon";
import TopSemicircleIcon from "../../mui/icons/TopSemicircleIcon";
import TLQuarterCircleIcon from "../../mui/icons/TLQuarterCircleIcon";
import ConstallationRectIcon from "../../mui/icons/ConstallationRectIcon";
import ConstellationRoundIcon from "../../mui/icons/ConstellationRoundIcon";
import { ListItem, ListItemButton, Sheet } from "@mui/joy";
import { BoardService } from "../../services";

//import MenuDragWrap from './MenuDragWrap';
/*
const UpArrow = () => (
  <svg
    width="8"
    height="5"
    viewBox="0 0 8 5"
    fill="var(--joy-palette-text-icon)"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.25 4.72966L3.82333 1.15666C3.84652 1.13343 3.87406 1.11501 3.90437 1.10244C3.93469 1.08987 3.96718 1.0834 4 1.0834C4.03282 1.0834 4.06531 1.08987 4.09563 1.10244C4.12594 1.11501 4.15348 1.13343 4.17667 1.15666L7.75 4.72966"
      stroke="var(--joy-palette-text-icon)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
*/
export type Shape =
  | 'rect'
  | 'diamond'
  | 'roundedRect'
  | 'circle'
  | 'hexagon'
  | 'triangle'
  | 'parallelogramIcon'
  | 'star'
  | 'cross'
  | 'leftsideRightTriangle'
  | 'rightsideRightTriangle'
  | 'topsideSemicircleCircle'
  | 'topLeftQuarterCircle'
  | 'constellationRect'
  | 'constellationRound';


export default () => {
  const canvas: any = BoardService.getInstance().getBoard();

  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation("menu");
  const modeType = useSelector((state: RootState) => state.mode.type);
  const shapeType = useSelector((state: RootState) => state.widget.shape.type);




  const ShapeIcon = useCallback(() => {
    switch (shapeType) {
      case 'rect':
        return <IconRectangle className="menuImgSize" />;
      case 'diamond':
        return <IconSquareRotated className="menuImgSize" />;
      case 'roundedRect':
        return <IconSquareRounded className="menuImgSize" />;
      case 'circle':
        return <IconCircle className="menuImgSize" />;
      case "hexagon":
        return <IconHexagon className="menuImgSize" />;
      case "triangle":
        return <IconTriangle className="menuImgSize" />;
      // case "diamond":
      //   return <ParallelogramIcon className="menuImgSize" />;
      case "star":
        return <StarIcon className="menuImgSize" />;
      case "cross":
        return <CrossIcon className="menuImgSize" />;
      case "leftsideRightTriangle":
        return <LeftsideRightTriIcon className="menuImgSize" />;
      case "rightsideRightTriangle":
        return <RightsideRightTriIcon className="menuImgSize" />;
      case "topsideSemicircleCircle":
        return <TopSemicircleIcon className="menuImgSize" />;
      case "topLeftQuarterCircle":
        return <TLQuarterCircleIcon className="menuImgSize" />;
      case "constellationRect":
        return <ConstallationRectIcon className="menuImgSize" />;
      case "constellationRound":
        return <ConstellationRoundIcon className="menuImgSize" />;
    }
  }, [shapeType]);

  const handleShapeClick = (type: any) => {
    dispatch(changeMode("shapeNote"));
    //dispatch(updateStickyNoteMenuBarOpenStatus(false));
  };

  const handleUpdateShapeType = (type: any) => {
    console.log("type change");
    dispatch(updateShapeType(type));
    dispatch(changeMode("shapeNote"));
    setOpen(false);
  };
  /*
    const handleStickyNoteDragEnd = () => {
      const shapeType = store.getState().widget.shape.type;
      canvas.createWidgetatCurrentLocationByType('XShapeNotes', {
        iconId: shapeType
      });
    };
  */
  const handle2LevelClick = (e: any) => {
    e.stopPropagation();
    dispatch(changeMode("default"));
    //dispatch(updateStickyNoteMenuBarOpenStatus(false));
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={t("shapes")} placement="top" arrow>
        <ListItem
          id="shape"
          sx={{ mr: "16px", borderWidth: "0px" }}
          value="shapeNote"
          onClick={handleShapeClick}
        >
          <ListItemButton
            selected={modeType === "shapeNote"}
            variant="plain"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              p: "8px 4px",
              gap: 0,
              borderWidth: "0px",
              borderRadius: "6px",
              backgroundColor: open
                ? "var(--joy-palette-primary-100) !important"
                : null,
              svg: {
                color: open
                  ? "var(--joy-palette-primary-500)"
                  : "var(--joy-palette-neutral-500)",
              },
            }}
          >
            {ShapeIcon()}

            <IconChevronUp
              onClick={handle2LevelClick}
              style={{
                marginLeft: "4px",
                width: "20px",
                height: "20px",
                strokeWidth: "var(--joy-lineHeight-sm)",
              }}
            />
            {/*</MenuDragWrap>*/}
          </ListItemButton>
        </ListItem>
      </Tooltip>

      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={handleClose}
      >
        <Sheet
          sx={{
            position: "fixed",
            bottom: "68px",
            left: "50%",
            transform: "translateX(19%)",
            display: open ? "flex" : "none",
            overflow: "hidden",
            borderRadius: "8px",
            boxShadow: "var(--joy-shadow-md)",
            p: "8px",
            alignItems: "center",
          }}
        >
          <MenuItem
            selected={shapeType === 'circle'}
            sx={{
              p: 0,
              mr: "8px",
              borderRadius: "4px",
              backgroundColor:
                shapeType === "circle" ? "#EAEEF6 !important" : "transparent",
            }}
            onClick={() => handleUpdateShapeType('circle')}
          >
            <IconCircle style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
          </MenuItem>
          <MenuItem
            selected={shapeType === 'triangle'}
            sx={{
              p: 0,
              mr: "8px",
              borderRadius: "4px",
              backgroundColor:
                shapeType === "triangle" ? "#EAEEF6 !important" : "transparent",
            }}
            onClick={() => handleUpdateShapeType('triangle')}
          >
            <IconTriangle style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
          </MenuItem>

          <MenuItem
            selected={shapeType === "diamond"}
            sx={{
              p: 0,
              mr: "8px",
              borderRadius: "4px",
              backgroundColor:
                shapeType === "diamond" ? "#EAEEF6 !important" : "transparent",
            }}
            onClick={() => handleUpdateShapeType('diamond')}
          >
            <IconSquareRotated
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          </MenuItem>
          <MenuItem
            selected={shapeType === 'roundedRect'}
            sx={{
              p: 0,
              mr: "8px",
              borderRadius: "4px",
              backgroundColor:
                shapeType === "roundedRect" ? "#EAEEF6 !important" : "transparent",
            }}
            onClick={() => handleUpdateShapeType('roundedRect')}
          >
            <IconSquareRounded
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          </MenuItem>
          <MenuItem
            selected={shapeType === "rect"}
            sx={{
              p: 0,
              mr: "8px",
              borderRadius: "4px",
              backgroundColor:
                shapeType === "rect" ? "#EAEEF6 !important" : "transparent",
            }}
            onClick={() => handleUpdateShapeType('rect')}
          >
            <IconRectangle
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          </MenuItem>
          <MenuItem
            selected={shapeType === "hexagon"}
            sx={{
              p: 0,
              mr: "8px",
              borderRadius: "4px",
              backgroundColor:
                shapeType === "hexagon" ? "#EAEEF6 !important" : "transparent",
            }}
            onClick={() => handleUpdateShapeType('hexagon')}
          >
            <IconHexagon style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
          </MenuItem>

          <MenuItem sx={{ p: 0, borderRadius: "4px" }} onClick={handleClose}>
            <IconX style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
          </MenuItem>
        </Sheet>
      </ClickAwayListener>
    </>
  );
};
