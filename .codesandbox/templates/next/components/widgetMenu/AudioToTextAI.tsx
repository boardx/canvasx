import { useEffect, useState } from "react";


//** Import i18n
import { useTranslation } from "../../services/i18n/client";

import RotateRightIcon from "@mui/icons-material/RotateRight";
// import server from "../../startup/serverConnect";
import store from "../../redux/store";
import IconButton from "@mui/joy/IconButton";
import { IconFileTextAi } from "@tabler/icons-react";


// import Util from "@/utils/util";

export default function AudioToTextAI({ canvas }: { canvas: any }) {
  const { t } = useTranslation("menu");
  const [isShowLoadingIcon, setIsShowLoadingIcon] = useState(false);
  // const canvas: any = BoardService.getInstance().getBoard();
  useEffect(() => {
    const object = canvas.getActiveObject();
    if (!object.status || object.status === "succeeded") {
      setIsShowLoadingIcon(false);
      return;
    }
    setIsShowLoadingIcon(true);
  }, [canvas.getActiveObject()]);

  useEffect(() => {
    if (!isShowLoadingIcon) return;
    // let timer = setInterval(() => {
    //   server
    //     .call("ai.getAudioToTextStatus")
    //     .then((res: any) => {
    //       if (res === null) {
    //         clearInterval(timer);
    //         return;
    //       }

    //       res.forEach((item: any) => {
    //         canvas.updateAudioWidgetStatusAndAddTextWidget(
    //           item.audioWidget,
    //           item.textWidget
    //         );
    //       });
    //     })
    //     .catch((err:any) => {
    //       clearInterval(timer);
    //       setIsShowLoadingIcon(false);
    //       console.log("getAudioToTextStatus: err", err);
    //       return;
    //     });
    // }, 10000);
  }, [isShowLoadingIcon]);

  const handleClick = async (e: any) => {
    e.preventDefault();
    if (isShowLoadingIcon) {
      // Util.Msg.info("s" + t("audioToTextAi.workTips"));
      return;
    }
    const object = canvas.getActiveObject();

    if (object.src === "") {
      // Util.Msg.info(t("audioToTextAi.fileCorruptionTips"));
      return;
    }

    // const { scaleX, scaleY, backgroundColor, fill, fontFamily, fontSize } =
    //   canvas.defaultNote;

    // let group = null;
    if (canvas.getActiveObjects().length > 1) {
      // Util.Msg.info(t("audioToTextAi.selectOneFileForTranscribe"));
      return;
    }

    // if (!object) {
    //   return $("#notesMenu").hide();
    // }
    setIsShowLoadingIcon(true);

    const currentFile = canvas.getActiveObject();
    let textWidget = {
      type: "transcription",
      audioUrl: currentFile.fileSrc,
      audioWidgetId: currentFile.id,
      status: "",
      left: currentFile.left + currentFile.width + 210,
      top: currentFile.top,
      userId: store.getState().user.userInfo.userId,
      boardId: currentFile.whiteboardId,
      timestamp: Date.now(),
      text: "",
    };
    // server
    //   .call("ai.audioToText", currentFile.src, textWidget)
    //   .then((res: any) => {
    //     Util.Msg.info(t("widgetAi.pleaseCheckTheResultsLater"));
    //     currentFile.set("status", "transcribing");
    //     currentFile.saveData("MODIFIED", ["status"]);
    //   })
    //   .catch((err: any) => {
    //     Util.Msg.warning(err);
    //     setIsShowLoadingIcon(false);
    //     return;
    //   });
  };

  return (
    <IconButton
      aria-label="bold"
      sx={{ p: "4px", m: 0, minWidth: "32px", minHeight: "32px" }}
      onClick={handleClick}
      variant="plain"
      value="transcription"
    >
      {isShowLoadingIcon ? (
        <RotateRightIcon
          className="audioToText-loading-icon"
          style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
        />
      ) : (
        <IconFileTextAi style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
      )}
    </IconButton>
  );
}
