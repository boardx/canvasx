import React, { useEffect } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import { IconArrowUp } from "@tabler/icons-react";

import store from "../../redux/store";
import { handleSetTips } from "../../redux/features/widgets.slice";
import Box from "@mui/joy/Box";
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowsHorizontal,
} from "@tabler/icons-react";



export default function ConnectorTips({ canvas }: { canvas: any }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tips, setTips] = React.useState(null);
  const [] = React.useState(null);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (e: any, value: any) => {
    onClickConnectorTips(e, value);
  };

  useEffect(() => {
    if (canvas.getActiveObject() && canvas.getActiveObject().tips) {
      setTips(canvas.getActiveObject().tips);
    }
    if (canvas.getActiveObjects() && canvas.getActiveObjects().length > 0) {
      const tips = canvas.getActiveObjects()[0].tips || "none";
      setTips(tips);
    }
  }, [tips]);

  const onClickConnectorTips = (e: any, tip: any) => {
    const curStyle = tip;

    const object = canvas.getActiveObject();

    let group = null;
    if (canvas.getActiveObject().objType === "WBGroup")
      group = canvas.getActiveObject();

    if (object && !group) {
      object.tips = curStyle;
      object.dirty = true;
      canvas.requestRenderAll();
      if (object.objType === "XConnector") {
        store.dispatch(handleSetTips(curStyle));
      }
      object.saveData("MODIFIED", ["tips"]);
    }

    if (group && group._objects) {
      group._objects.forEach((obj: any) => {
        obj.tips = curStyle;
        obj.dirty = true;
        canvas.requestRenderAll();
        if (obj.objType === "XConnector") {
          store.dispatch(handleSetTips(curStyle));
        }
      });
      group.saveData("MODIFIED", ["tips"]);
    }
    setTips(curStyle);
    handleClose();
  };

  const handleArrowTipIconDOM = () => {
    if (tips && tips === "start") {
      return (
        <IconArrowLeft style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
      );
    }

    if (tips && tips === "end") {
      return (
        <IconArrowRight style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
      );
    }

    if (tips && tips === "both") {
      return (
        <IconArrowsHorizontal
          style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
        />
      );
    }

    if (!tips || tips === "none") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          strokeWidth={"1.5"}
          fill="none"
          className="widgetMenuImgSize"
        >
          <rect width="16" height="15.7811" fill="" />
          <path
            d="M0.583252 7.89062H15.4166"
            stroke="var(--joy-palette-text-icon)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
  };

  return (
    <Box>
      <ToggleButton
        sx={{
          borderWidth: "0px",
          height: 44,
        }}
        selected={false}
        value="connectorTips"
        onClick={handleClick}
      >
        {handleArrowTipIconDOM()}
        <IconArrowUp fontSize="md" />
      </ToggleButton>

      <Menu
        anchorEl={anchorEl}
        id="simple-menu"
        keepMounted
        //@ts-ignore
        onChange={handleChange}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        className="simple-menu"
        sx={{
          "&& .Mui-selected": {
            backgroundColor: "var(--joy-palette-background-level1)",
          },
        }}
      >
        <MenuItem
          onClick={(event) => onClickConnectorTips(event, "start")}
          className={tips && tips === "start" ? "Mui-selected" : ""}
        >
          <IconArrowLeft style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
        </MenuItem>
        <MenuItem
          onClick={(event) => onClickConnectorTips(event, "end")}
          className={tips && tips === "end" ? "Mui-selected" : ""}
        >
          <IconArrowRight style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
        </MenuItem>
        <MenuItem
          onClick={(event) => onClickConnectorTips(event, "both")}
          className={tips && tips === "both" ? "Mui-selected" : ""}
        >
          <IconArrowsHorizontal
            style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
          />
        </MenuItem>
        <MenuItem
          onClick={(event) => onClickConnectorTips(event, "none")}
          className={tips && tips === "none" ? "Mui-selected" : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke-width="1.5"
            className="widgetMenuImgSize"
          >
            <rect width="16" height="15.7811" fill="" />
            <path
              d="M0.583252 7.89062H15.4166"
              stroke="var(--joy-palette-text-icon)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </MenuItem>
      </Menu>
    </Box>
  );
}
