import React from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import store from "../../redux/store";
import {
  handleSetConnectorShape
} from "../../redux/features/widgets.slice";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import { SvgIcon } from "@mui/joy";
import {
  IconVectorSpline,
  IconLine,
  IconArrowGuide,
} from "@tabler/icons-react";


export default function ConnectorStyle({ canvas }: { canvas: any }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickConnectorShape = (e: any, value: any) => {
    const curShape = value;
    let object;

    if (canvas) {
      object = canvas.getActiveObject();

      let group = null;
      if (canvas.getActiveObjects().length > 1)
        group = canvas.getActiveObject();

      // if (!object) {
      //   return $("#notesMenu").hide();
      // }
      if (object) {
        object.connectorShape = curShape;
        object.dirty = true;
        store.dispatch(handleSetConnectorShape(curShape));

        object.saveData("MODIFIED", ["connectorShape"]);
      }
      canvas.requestRenderAll();

      if (group && group._objects) {
        group._objects.forEach((obj: any) => {
          if (obj.objType === "XConnector") {
            obj.connectorShape = curShape;
            obj.dirty = true;
            canvas.requestRenderAll();
            store.dispatch(handleSetConnectorShape(curShape));
          }
        });
        group.saveData("MODIFIED", ["connectorShape"]);
      }
    }
    setAnchorEl(null);
  };

  const handleArrowShapeIconDOM = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().connectorShape === "straight"
    ) {
      return <IconLine style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />;
    } else if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().connectorShape === "angled"
    ) {
      return (
        <IconArrowGuide style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
      );
    } else
      return (
        <IconVectorSpline style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
      );
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        variant="plain"
        color="neutral"
        size="sm"
        sx={{
          p: 0,
          m: 0,
          width: "60px",
          height: "44px",
          "&:hover": {
            backgroundColor: "var(--joy-palette-background-level1)",
          },
        }}
        endDecorator={
          <SvgIcon fontSize="md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </SvgIcon>
        }
      >
        {handleArrowShapeIconDOM()}
      </Button>

      <Menu
        anchorEl={anchorEl}
        id="simple-menu"
        keepMounted
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
          onClick={(event) => onClickConnectorShape(event, "straight")}
          className={
            canvas.getActiveObject() &&
              canvas.getActiveObject().connectorShape === "straight"
              ? "Mui-selected"
              : ""
          }
        >
          <IconLine style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
        </MenuItem>
        <MenuItem
          onClick={(event) => onClickConnectorShape(event, "angled")}
          className={
            canvas.getActiveObject() &&
              canvas.getActiveObject().connectorShape === "angled"
              ? "Mui-selected"
              : ""
          }
        >
          <IconArrowGuide style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
        </MenuItem>
        <MenuItem
          onClick={(event) => onClickConnectorShape(event, "curved")}
          className={
            canvas.getActiveObject() &&
              canvas.getActiveObject().connectorShape === "curved"
              ? "Mui-selected"
              : ""
          }
        >
          <IconVectorSpline
            style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
}
