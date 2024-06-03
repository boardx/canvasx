//** Import react


//** Import i18n
import { useTranslation } from "../../services/i18n/client";

import Button from "@mui/joy/Button";
import { IconDownload } from "@tabler/icons-react";



export default function FileDownload({
  fileDownloadSrc,
  fileName,
  canvas
}: {
  fileDownloadSrc: string;
  fileName: string;
  canvas: any;
}) {
  const { t } = useTranslation("menu");

  const handleClickFileDownload = () => {
    if (fileDownloadSrc) {
      let data = {
        url: fileDownloadSrc,
        type: fileName.substring(fileName.lastIndexOf(".") + 1),
        name: fileName,
      };
      // Util.Msg.warning(t("board.filedrop.downloadStart"));
      fetch(fileDownloadSrc)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          // 创建下载链接并自动下载
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.setAttribute("download", data.name);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          // Util.Msg.success(t("board.filedrop.downloadSuccess"));
        })
        .catch((error) => {
          // Util.Msg.warning(t("board.filedrop.fileDownloadError"));
          console.error("Error fetching file:", error);
        });
      return;
    }
    // Util.Msg.warning(t("board.filedrop.fileDownloadError"));
  };

  return (
    <Button
      component="label"
      tabIndex={-1}
      color="neutral"
      id="fileDownload"
      variant="plain"
      sx={{ p: "4px", m: 0 }}
      size="sm"
      onClick={handleClickFileDownload}
    >
      <IconDownload />
    </Button>
  );
}
