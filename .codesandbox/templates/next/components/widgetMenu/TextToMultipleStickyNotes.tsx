
//** Import i18n
import { useTranslation } from "../../services/i18n/client";

//** Import Redux kit
import { useDispatch } from "react-redux";
import Button from "@mui/joy/Button";
import { IconFiles } from "@tabler/icons-react";
//@ts-ignore


export default function ({ canvas }: { canvas: any }) {
  const dispatch = useDispatch();

  const { t } = useTranslation("menu");
  const handleClickTextToMultipleStickyNotes = async () => {
    let textContent = canvas.getActiveObject()?.text;
    textContent = textContent?.split("\n");
    textContent = textContent?.filter((item: any) => item.trim() !== "");
    if (textContent) {
      textContent = textContent.filter((item: any) => item.trim() !== "");
      canvas.createMutipleStickyNotesByLocation(
        textContent,
        canvas.getActiveObject()
      );
      // Util.Msg.success(t("widgetAi.textToMultipleStickyNotesSuccessfully"));
    } else {
      // Util.Msg.warning(t("widgetAi.pleaseSelectTheTextBoxWithContent"));
    }
  };

  return (
    <div>
      <Button
        component="label"
        tabIndex={-1}
        color="neutral"
        variant="plain"
        id="textToMultipleStickyNotesIcon"
        aria-label="bold"
        sx={{ p: "4px", m: 0 }}
        size="sm"
        onClick={handleClickTextToMultipleStickyNotes}
      >
        <IconFiles style={{ strokeWidth: "var(--joy-lineHeight-sm" }} />
      </Button>
    </div>
  );
}
