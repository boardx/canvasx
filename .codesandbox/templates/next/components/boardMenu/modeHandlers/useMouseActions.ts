//**Redux store */
import store, { RootState } from '../../../redux/store';
import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAbsolutePoint } from '../../../redux/features/mode.slice';
import {
  setCurrentContextMenu,
  updateContextMenuPosition,
  updateContextMenuStatus,
} from '../../../redux/features/contextMenu.slice';

//**utils */
import { fromEvent, switchMap, takeUntil, tap } from 'rxjs';
import useEraserActions from './useEraserActions';
import usePanActions from './usePanActions';
import useLineActions from './useLineActions';
import useTextActions from './useTextActions';
import useShapeActions from './useShapeActions';
import useCommonActions from './useCommonActions';
import useStickNoteActions from './useStickNoteActions';
import showMenu from '../../widgetMenu/ShowMenu';
import { getEraserCursor, inActiveSelection } from './utils';
import { BoardService } from '../../../services';

const useMouseActions = () => {
  const canvas: any = BoardService.getInstance().getBoard();
  const mouseMove: any = useRef(null);
  const mouseDown: any = useRef(null);
  const mouseUp: any = useRef(null);
  const mouseLeave: any = useRef(null);
  const mouseDownBefore: any = useRef(null);

  const beforePan: any = useRef(null);
  const afterPan: any = useRef(null);
  const leavePan: any = useRef(null);

  const isMoved: any = useRef(false);

  let mousePosition: any = null;

  let mouseCurrentCursor = 'default';

  let startPointer: any = null;

  const modeType = useSelector((state: RootState) => state.mode.type);

  const { handlePaning, handlePanMouseDown, handlePanMouseUp } =
    usePanActions();

  const { handleClearPath } = useEraserActions();

  const { handleLineMouseDown, handleLineMouseMove, handleLineMouseUp } =
    useLineActions();

  const { handleTextMouseUp } = useTextActions();

  const { handleShapeMouseDown, handleShapeMouseMove, handleShapeMouseUp } =
    useShapeActions();

  const { handleCommonAfter } = useCommonActions();

  const { handleStickNoteMouseUp } = useStickNoteActions();

  const dispatch = useDispatch();

  const startMouseListener = useCallback(() => {
    if (!canvas) return;

    mouseMove.current = fromEvent(canvas, 'mouse:move');

    mouseDown.current = fromEvent(canvas, 'mouse:down');

    mouseUp.current = fromEvent(canvas, 'mouse:up');

    mouseLeave.current = fromEvent(canvas, 'mouse:leave');

    mouseDownBefore.current = fromEvent(canvas, 'mouse:down:before');

    mousePosition = mouseMove.current.subscribe((e: any) => {
      if (!canvas.mouse) return;
      canvas.mouse.e = e;

      canvas.mouse.mouseMoveUpdate = true;
    });

    beforePan.current = mouseDownBefore.current
      .pipe(
        tap((e: any) => {
          console.log(
            '!@beforePan.current = mouseDownBefore.current -- tap',
            modeType
          );
          mouseCurrentCursor = canvas.hoverCursor;

          const mouseEvent = e.e as MouseEvent;

          startPointer = e.scenePoint;

          if (mouseEvent.which === 2 || mouseEvent.which === 3) {
            handlePanMouseDown(false);
          } else if (modeType === 'pan') {
            handlePanMouseDown();
          } else if (modeType === 'line') {
            handleLineMouseDown(e);
          } else if (modeType === 'shapeNote') {
            handleShapeMouseDown(e);
          }
          if (modeType === 'eraser') {
            canvas.hoverCursor = getEraserCursor();

            canvas.defaultCursor = getEraserCursor();

            canvas.requestRenderAll();
          }
          const objs = canvas.getObjects();
          if (objs && objs.length > 0) {
            objs.forEach((item: any) => {
              if (item.borderColor === 'rgba(179, 205, 253, 0.8)')
                item.set({ borderColor: '#31A4F5' });
            });
          }
        }),
        switchMap((_) =>
          mouseMove.current.pipe(
            takeUntil(mouseUp.current),
            takeUntil(mouseLeave.current)
          )
        )
      )
      .subscribe((e: any) => {
        const mouseEvent = e.e as MouseEvent;
        console.log(
          '!@beforePan.current = mouseDownBefore.current --subscribe',
          modeType
        );
        if (
          mouseEvent.buttons === 2 ||
          mouseEvent.buttons === 3 ||
          mouseEvent.which === 2 ||
          mouseEvent.which === 3 ||
          modeType === 'pan'
        ) {
          handlePaning(mouseEvent);
        } else if (modeType === 'eraser') {
          handleClearPath(e);
        } else if (modeType === 'line') {
          handleLineMouseMove(e);
        } else if (
          modeType === 'shapeNote' ||
          (canvas.getActiveObject() &&
            canvas.getActiveObject().objType === 'WBShapeNote')
        ) {
          handleShapeMouseMove(e);
        }

        if (e.target && e.target.name && e.target.name.indexOf('.pdf') > -1) {
          if (e.target.width > 500) {
            e.target.set({ width: 320, height: 453, dirty: true });

            canvas.requestRenderAll();
          }
        }
        isMoved.current = true;

        //判断objects是否在activeselection中
        const selection = {
          x1: startPointer.x,
          y1: startPointer.y,
          x2: e.pointer.x,
          y2: e.pointer.y,
        };

        const objects = canvas.getObjects();

        if (
          canvas.isActiveSelectionAction &&
          !canvas.isDrawingMode &&
          store.getState().mode.type !== 'eraser' &&
          !store.getState().slides.isStartScreenShot
        ) {
          objects.forEach((item: any) => {
            if (inActiveSelection(selection, item)) {
              if (
                item.aCoords &&
                item.objType !== 'XConnector' &&
                item.objType !== 'XShapeNotes'
              ) {
                item.set({
                  hasControls: false,
                  borderColor: 'rgba(179, 205, 253, 0.8)',
                });

                item._renderControls(canvas.contextTop);
              }
            } else {
              item.set({ hasControls: true });
            }
          });
        }
      });

    afterPan.current = mouseUp.current.subscribe((e: any) => {
      const mouseEvent = e.e as MouseEvent;

      const objs = canvas.getActiveObject();

      if (objs && objs.isEditing) {
        if (objs.isTpClick) {
          setTimeout(() => {
            objs.set({
              isTpClick: false,
              selectionStart: 0,
              selectionEnd: objs.text.length,
            });
            objs.selectAllText();
          }, 100);
        }
      }

      if (objs && objs.objType !== 'WBGroup' && objs.objType !== 'XConnector') {
        if (!canvas.getActiveObject().hasBorders) {
          canvas.getActiveObject().set({ hasBorders: true });
        }
      }
      //If after activeSelection update statue
      if (objs && objs._objects && objs._objects.length > 0) {
        objs._objects.forEach((item: any) => {
          item.set({
            hasControls: true,
            borderColor: 'rgba(179, 205, 253, 0.8)',
          });
        });
      }

      if (objs && objs.objType !== 'WBGroup') {
        objs.set({ borderColor: '#31A4F5' });
      }

      if (objs && objs.objType === 'WBGroup') {
        let hasLockedObject = false;
        objs._objects.forEach((item: any) => {
          if (item.locked) {
            hasLockedObject = true;
          }
        });
        if (hasLockedObject) {
          canvas.lockObject(objs);
        }
      }
      if (mouseEvent.which === 2 || mouseEvent.which === 3) {
        canvas.hoverCursor = mouseCurrentCursor;

        canvas.defaultCursor = mouseCurrentCursor;

        canvas.setCursor(mouseCurrentCursor);

        handlePanMouseUp(false);
      }

      if (modeType === 'pan' && isMoved.current) {
        handlePanMouseUp(true);
      }

      if (
        (mouseEvent.which === 2 || mouseEvent.which === 3) &&
        !isMoved.current
      ) {
        dispatch(setCurrentContextMenu(e.target));

        dispatch(updateAbsolutePoint(e.absolutePointer));

        dispatch(updateContextMenuPosition(e.pointer));

        //todo: temp fix for context menu for windows, need to find a better solution
        // right click on windows, on EventService, the contextmenu event capture the menu as the target not canvas
        // so we need to delay the context menu to show
        setTimeout(() => {
          dispatch(updateContextMenuStatus(true));
        }, 100);
      }

      if (modeType === 'line') {
        handleLineMouseUp(e);
      }

      if (modeType === 'eraser') {
        const target: any = e.target;
        if (target && target.objType !== 'XPath') {
          setTimeout(() => {
            canvas.discardActiveObject();
            canvas.requestRenderAll();
          }, 10);
        }
        handleClearPath(e);
      }

      if (
        e.target &&
        !e.target.selectable &&
        !isMoved.current &&
        modeType !== 'eraser'
      ) {
        canvas.setActiveObject(e.target);

        showMenu(canvas);
      }

      if (modeType === 'text') {
        handleTextMouseUp(e);
      }

      if (modeType === 'shapeNote') {
        handleShapeMouseUp(e);
      }

      if (modeType === 'stickNote') {
        handleStickNoteMouseUp(e);
      }
      if (modeType === 'eraser') {
        canvas.hoverCursor = getEraserCursor();

        canvas.defaultCursor = getEraserCursor();

        canvas.requestRenderAll();
      }

      isMoved.current = false;
    });

    leavePan.current = mouseLeave.current.subscribe((e: any) => {
      const mouseEvent = e.e as MouseEvent;

      if (mouseEvent.buttons === 0) return;

      handleCommonAfter();
    });
  }, [canvas, modeType]);

  const endMouseListener = useCallback(() => {
    if (!canvas) return;

    beforePan.current && beforePan.current.unsubscribe();

    afterPan.current && afterPan.current.unsubscribe();

    leavePan.current && leavePan.current.unsubscribe();

    mousePosition && mousePosition.unsubscribe();
  }, [canvas, modeType]);

  return {
    startMouseListener,
    endMouseListener,
  };
};

export default useMouseActions;
