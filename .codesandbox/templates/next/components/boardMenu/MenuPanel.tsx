import React from "react";
import { useDrag } from "react-dnd";
import Tooltip from "@mui/joy/Tooltip";
import { useTranslation } from "../../services/i18n/client";
import PanelIcon from "../../mui/icons/panelIcon";
import ToggleButton from "@mui/material/ToggleButton";
import { useTheme } from "@mui/material/styles";
import {
  AntTabs,
  TabPanel,
  AntTab,
  a11yProps,
} from "../../mui/components/TabPanelObjects";
import { MenuPanelDragItem } from "./MenuPanelDragItem";
import store from "../../redux/store";
import {
  handleSetIsPanMode,
  handleSetBoardPanelClicked,
  handleSetDrawingEraseMode,
} from "../../redux/features/board.slice";
import Popover from "@mui/material/Popover";
import { BoardService } from "../../services";

export default function MenuPanel() {
  const canvas: any = BoardService.getInstance().getBoard();
  const [panelIconColor, setPanelIconColor] = React.useState("#757575");
  const cursorNote =
    "data:image/svg+xml, %3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='3' y='5' width='19' height='2' rx='1' fill='%23757575'/%3E%3Crect x='3' y='16' width='19' height='2' rx='1' fill='%23757575'/%3E%3Crect x='8' y='2' width='19' height='2' rx='1' transform='rotate(90 8 2)' fill='%23757575'/%3E%3Crect x='19' y='2' width='19' height='2' rx='1' transform='rotate(90 19 2)' fill='%23757575'/%3E%3C/svg%3E";
  const objType = "WBRectPanel";
  const [, drag] = useDrag(() => ({
    type: "widget",
    item: { objType, type: "widget" },
    end: (item: any) => {
      canvas.createWidgetatCurrentLocationByType(item.objType, { text: Text });
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    store.dispatch(handleSetIsPanMode(false));
    setAnchorEl(event.currentTarget);

    store.dispatch(handleSetDrawingEraseMode(false));

    /**
     * @author Gengda
     * @date: 04/05/2021
     * @description: Fix the tab's indicator shift when refresh
     * This is a substitute to solve. We should use the api "updateIndicator()", which is an action at Tabs.
     * However, it comes the error "updateIndicator is not defined". And I don't know how to solve it.
     */
    // TODO: Still have timeout
    setTimeout(() => window.dispatchEvent(new CustomEvent("resize")), 0);

    if (!store.getState().board.boardPanelClicked) {
      store.dispatch(handleSetBoardPanelClicked(true));
      store.dispatch(handleSetIsPanMode(false));
    }
  };

  const { t } = useTranslation("menu");
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "note-popover" : undefined;
  const theme = useTheme();

  return (
    <div>
      <Tooltip title={t("iFrame")} placement="left" arrow>
        <ToggleButton
          onMouseEnter={() => setPanelIconColor("#f21d6b")}
          onMouseLeave={() => setPanelIconColor("#757575")}
          id="menuPanel"
          value="iframe"
          aria-label="iframe"
          //@ts-ignore
          onClick={handleClick}
          sx={{
            width: "24px",
            height: "24px",
            padding: 0,
            marginTop: "12px",
            marginBottom: "12px",
          }}
        >
          <PanelIcon panelIconColor={panelIconColor} />
        </ToggleButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
      >
        <div
          style={{
            flexGrow: 1,
            width: "200px",
          }}
        >
          <div style={{ backgroundColor: theme.palette.background.paper }}>
            <AntTabs
              value={value}
              onChange={handleChange}
              aria-label="ant example"
            >
              <AntTab label="Basic" {...a11yProps(0)} />
              <AntTab label="Device" {...a11yProps(1)} />
            </AntTabs>
            <div
              style={{
                paddingTop: "12px",
                paddingRight: "14px",
                paddingLeft: "14px",
              }}
            >
              <TabPanel value={value} index={0} width="200px" height="120px">
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={0}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={1}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={2}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={3}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={4}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={5}
                />
              </TabPanel>
            </div>
            <div
              style={{
                paddingRight: "14px",
                paddingLeft: "14px",
              }}
            >
              <TabPanel value={value} index={1} width="200px" height="120px">
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={6}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={7}
                />
                <MenuPanelDragItem
                  objType="WBRectPanel"
                  handleClose={handleClose}
                  iconId={8}
                />
              </TabPanel>
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
}
