//**Fabric */
import * as fabric from '../../../../../../fabric';

//**Redux store */
import { changeMode } from '../../../redux/features/mode.slice';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

//**utils */
import { getBrushCursorWithColor } from './utils';

import { BoardService } from '../../../services';

const useDrawActions = () => {
  const canvas: any = BoardService.getInstance().getBoard();
  const dispatch = useDispatch();

  const brushWidth = useSelector(
    (state: RootState) => state.widget.draw.brushWidth
  );

  const brushColor = useSelector(
    (state: RootState) => state.widget.draw.brushColor
  );

  const handleDrawBefore = () => {
    const cursor = getBrushCursorWithColor(brushColor);

    canvas.freeDrawingCursor = cursor;

    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    }

    canvas.discardActiveObject();
    canvas.skipTargetFind = true;

    canvas.freeDrawingBrush.color = brushColor;

    canvas.freeDrawingBrush.width = brushWidth;
  };

  const handleDrawAfter = useCallback(() => {
    if (!canvas) return;

    // 关闭画笔模式
    canvas.isDrawingMode = false;

    canvas.skipTargetFind = false;
  }, [canvas]);

  const handleDrawShortCut = () => {
    dispatch(changeMode('draw'));
  };

  return {
    handleDrawShortCut,
    handleDrawBefore,
    handleDrawAfter,
  };
};

export default useDrawActions;
