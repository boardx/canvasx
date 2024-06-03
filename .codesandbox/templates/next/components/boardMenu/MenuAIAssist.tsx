//** Import react
import React, { useState } from "react";
import { useTranslation } from "../../services/i18n/client";

//** Import Mui
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";

import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import ClosePopupIcon2 from "../../mui/icons/ClosePopupIcon2";
import Dialog from "@mui/material/Dialog";
import Sheet from "@mui/joy/Sheet";
import Draggable from "react-draggable";

//** Import components
import { BoardService } from "../../services";

const canvas = BoardService.getInstance().getBoard();
function PaperComponent() {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Sheet />
    </Draggable>
  );
}

export function MenuAIAssist() {
  const { t } = useTranslation("widget-ai");
  const [currentWidgetType, setCurrentWidgetType] = React.useState<any>([]);
  const [
    isOpenAIContentAndImageCreateion,
    setIsOpenAIContentAndImageCreateion,
  ] = useState(false);

  const handleCloseAIContentAndImageCreateion = () => {
    setIsOpenAIContentAndImageCreateion(false);
  };

  const handleClickOpenAIContentAndImageCreateion = () => {
    const currentWidget: any = canvas.getActiveObject();
    try {
      setIsOpenAIContentAndImageCreateion(!isOpenAIContentAndImageCreateion);
      if (currentWidget._objects && currentWidget._objects.length > 1) {
        let newCurrentWidgetType: any = [];
        currentWidget._objects.map((item: any) => {
          newCurrentWidgetType.push(item.objType);
        });
        setCurrentWidgetType(newCurrentWidgetType);
      } else {
        const currentWidgetType = [currentWidget.objType];
        setCurrentWidgetType(currentWidgetType);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Tooltip
        title={`${t("content")} & ${t("imageCreation")}`}
        placement="top"
        arrow
      >
        <IconButton
          id="menuAiAssist"
          value="resource"
          onClick={handleClickOpenAIContentAndImageCreateion}
          style={{ borderRadius: "0 8px 0 0" }}
        >
          <img
            src="/images/aiChat/AIMenuIcon.png"
            style={{ width: "20px", height: "20px" }}
          />
        </IconButton>
      </Tooltip>

      <Dialog
        open={isOpenAIContentAndImageCreateion}
        PaperComponent={PaperComponent}
        classes={{ paper: "dialogPaper2" }}
        aria-labelledby="draggable-dialog-title"
        BackdropProps={{ invisible: true }}
        disableEnforceFocus={true}
        sx={{
          ".dialogPaper2": {
            margin: "0px",
            width: "450px",
            overflow: "hidden",
            pointerEvents: "all",
          },
          ".titleBox2": {
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            background: "#0A2774",
          },
        }}
      >
        <Box className={"titleBox2"} style={{ pointerEvents: "all" }}>
          <Box
            id="draggable-dialog-title"
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              cursor: "move",
            }}
          >
            <img
              src="/images/aiChat/AIMenuIcon2.png"
              style={{ width: "20px", height: "20px" }}
            />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "16px",

                marginLeft: "6px",
              }}
              component="div"
            >
              {`${t("content")} & ${t("imageCreation")}`}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={handleCloseAIContentAndImageCreateion}
              style={{ padding: 0, width: "14px", height: "14px" }}
            >
              <ClosePopupIcon2
                style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
              />
            </IconButton>
          </Box>
        </Box>
        {/* <AIAssistCommandDialogPage
          open={isOpenAIContentAndImageCreateion}
          type="MenuChatAI"
          currentWidgetType={currentWidgetType}
        /> */}
      </Dialog>
    </Box>
  );
}

const MenuAIAssistMemo = React.memo(MenuAIAssist);

export default MenuAIAssistMemo;
