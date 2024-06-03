import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";
import ToggleButton from "@mui/material/ToggleButton";


export default function TextNote({ canvas }: { canvas: any }) {
  const onClickTextNote = (e: any) => {
    e.preventDefault();
    // const el = $(e.currentTarget);
    // const menu = $("#notesMenu");
    // const widget = canvas.getActiveObject();
    // // const canvas: any = BoardService.getInstance().getBoard();
    // if (widget.objType !== "XRectNotes" && widget.objType !== "XCircleNotes") {
    //   menu.hide();
    //   return;
    // }

    // const { defaultNote } = canvas;
    // defaultNote.isDraw = false;
    // canvas.changeDefaulNote(defaultNote);

    // el.parent().hide();

    // widget.set("isDraw", false);
    // widget.dirty = true;

    // widget.saveData("MODIFIED", ["isDraw"]);
    // canvas.unlockObjectsInCanvas();
    // $("#notesDrawCanvas").hide();
    // $("#notesDrawCanvas").next().hide();
    // canvas.requestRenderAll();
    // showMenu(canvas);
  };

  return (
    <div>
      <ToggleButton
        aria-label="bold"
        sx={{
          borderRightWidth: 1,
          width: 40,
          borderWidth: "0px",
        }}
        onClick={onClickTextNote}
        selected={false}
        value="textNote"
      >
        <TextFieldsOutlinedIcon />
      </ToggleButton>
    </div>
  );
}
