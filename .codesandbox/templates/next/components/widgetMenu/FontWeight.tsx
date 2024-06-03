import { useDispatch } from "react-redux";
import { handleSetMenuFontWeight } from "../../redux/features/widgets.slice";
import { Button, Box } from "@mui/joy";
import { IconBold } from "@tabler/icons-react";

export default function FontWeight({
  fontWeight,
  paddingLeft,
  paddingRight,
  canvas
}: {
  fontWeight: number;
  paddingLeft: number;
  paddingRight: number;
  canvas: any;
}) {
  const dispatch = useDispatch();
  // const { mode } = useColorScheme();
  // const canvas: any = BoardService.getInstance().getBoard();
  const changeFontWeight = (object: any, group: any, fontWeight: any) => {
    const objects = group ? group._objects : [object];
    objects.forEach((obj: any) => {
      obj.set("fontWeight", fontWeight);
      obj.saveData("MODIFIED", ["fontWeight"]);
    });
    dispatch(handleSetMenuFontWeight(fontWeight));
  };

  const handleClick = (event: any) => {
    event.preventDefault();
    const object = canvas.getActiveObject();
    const group =
      canvas.getActiveObjects().length > 1 ? canvas.getActiveObject() : null;
    const curFtWeight = group
      ? canvas.getActiveObject()._objects[1].fontWeight
      : object.fontWeight;
    const newFtWeight = curFtWeight !== 700 ? 700 : 400;
    changeFontWeight(object, group, newFtWeight);
    canvas.requestRenderAll();
    if (canvas.getActiveObject().hiddenTextarea) {
      setTimeout(() => {
        canvas.getActiveObject().hiddenTextarea.focus();
      }, 100);
    }
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        variant="plain"
        color="neutral"
        aria-controls="font-weight"
        aria-haspopup="true"
        size="sm"
        sx={{ p: "4px", m: 0 }}
        value="fontWeight"
      >
        {fontWeight === 700 ? (
          <IconBold style={{ strokeWidth: 3 }} />
        ) : (
          <IconBold style={{ strokeWidth: 1.5 }} />
        )}
      </Button>
    </Box>
  );
}
