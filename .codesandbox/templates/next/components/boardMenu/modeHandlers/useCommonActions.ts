//**React */
import { useCallback, useRef, useEffect } from 'react';

//**Redux Store */
import store, { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { handleSetClassForCursor } from '../../../redux/features/board.slice';

//**Utils */
import { getBrushCursorWithColor } from '../modeHandlers/utils';
import { getEraserCursor } from './utils';

import { noteSvg } from '../../svg/noteSvg';
import { cursorInner } from '../../svg/cursorInner';
import { BoardService } from '../../../services';

const useCommonActions = () => {
  const canvas: any = BoardService.getInstance().getBoard();
  const oldSelection: any = useRef(false);

  const oldCursor: any = useRef('default');

  const modeType = useSelector((state: RootState) => state.mode.type);

  const brushColor = useSelector(
    (state: RootState) => state.widget.draw.brushColor
  );

  const cursorColorOfPen = useSelector(
    (state: RootState) => state.board.cursorColorOfPen
  );

  const cursorNote = noteSvg;

  const handleCommonBefore = useCallback(() => {
    if (!canvas) return;

    oldCursor.current = canvas.defaultCursor;

    oldSelection.current = canvas.selection;

    canvas.requestRenderAll();
  }, [canvas]);

  const handleCommonAfter = useCallback(() => {
    if (!canvas) return;

    canvas.defaultCursor = oldCursor.current;

    canvas.hoverCursor = oldCursor.current;

    canvas.selection = oldSelection.current;

    canvas.requestRenderAll();
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;
    //default mode
    if (modeType === 'default') {
      canvas.setCursor('default');

      canvas.defaultCursor = 'default';

      canvas.hoverCursor = 'move';

      canvas.selection = true;

      //cancel drawing

      canvas.freeDrawingBrush = null;

      canvas.isDrawingMode = false;

      //unlock objects
      canvas.unlockObjectsInCanvas();

      canvas.requestRenderAll();
    }
    //pan mode
    if (modeType === 'pan') {
      canvas.setCursor('grab');

      canvas.defaultCursor = 'grab';

      canvas.hoverCursor = 'move';

      canvas.selection = true;

      //cancel drawing
      canvas.freeDrawingBrush = null;

      canvas.isDrawingMode = false;

      canvas.requestRenderAll();
    }

    //draw mode
    if (modeType === 'draw') {
      //change mouse
      canvas.defaultCursor = getBrushCursorWithColor(brushColor);

      canvas.hoverCursor = getBrushCursorWithColor(brushColor);

      //change mode of fabricjs
      canvas.isDrawingMode = true;

      //lock objects
      canvas.lockObjectsInCanvas();

      canvas.selection = false;

      canvas.requestRenderAll();
    }

    //eraser mode
    if (modeType === 'eraser') {
      //change mouse
      canvas.hoverCursor = getEraserCursor();

      canvas.defaultCursor = getEraserCursor();

      canvas.selection = false;

      // close drawing mode
      canvas.isDrawingMode = false;

      // lock widget
      canvas.lockObjectsInCanvas();

      canvas.requestRenderAll();
    }

    if (modeType === 'stickNote') {
      canvas.setCursor(`url("${cursorNote}") 0 0, auto`);

      canvas.hoverCursor = `url("${cursorNote}") 0 0, auto`;

      canvas.defaultCursor = `url("${cursorNote}") 0 0, auto`;

      canvas.selection = true;

      //cancel drawing
      canvas.freeDrawingBrush = null;

      canvas.isDrawingMode = false;

      //unlock objects
      canvas.unlockObjectsInCanvas();

      canvas.requestRenderAll();
    }

    if (modeType === 'text') {
      canvas.setCursor('text');

      canvas.defaultCursor = 'text';

      canvas.hoverCursor = 'text';

      canvas.selection = true;

      //cancel drawing
      canvas.freeDrawingBrush = null;

      canvas.isDrawingMode = false;

      //unlock objects
      canvas.unlockObjectsInCanvas();

      canvas.requestRenderAll();
    }

    if (modeType === 'line') {
      //change mouse
      canvas.setCursor('crosshair');

      canvas.hoverCursor = 'crosshair';

      canvas.defaultCursor = 'crosshair';

      canvas.selection = false;

      //cancel drawing
      canvas.freeDrawingBrush = null;

      canvas.isDrawingMode = false;

      // lock widget
      canvas.lockObjectsInCanvas();

      canvas.requestRenderAll();
    }

    if (modeType === 'shapeNote') {
      //change mouse
      canvas.setCursor('crosshair');

      canvas.hoverCursor = 'crosshair';

      canvas.defaultCursor = 'crosshair';

      canvas.selection = false;

      //cancel drawing
      canvas.freeDrawingBrush = null;

      canvas.isDrawingMode = false;

      // lock widget
      canvas.lockObjectsInCanvas();

      canvas.requestRenderAll();
    }

    return () => {};
  }, [modeType]);

  useEffect(() => {
    let classForCursorInner;

    if (cursorColorOfPen !== '') {
      classForCursorInner = {
        cursor: cursorInner(cursorColorOfPen),
      };
    }

    store.dispatch(handleSetClassForCursor(classForCursorInner));
  }, [cursorColorOfPen]);

  return {
    handleCommonBefore,
    handleCommonAfter,
  };
};

export default useCommonActions;
