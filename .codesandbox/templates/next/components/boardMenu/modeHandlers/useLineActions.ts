//**React */
import { useCallback } from 'react';

//**Fabric */
import * as fabric from '@boardxus/canvasx';

//**Store */
import store, { RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { changeMode } from '../../../redux/features/mode.slice';

//**Services */
import { UtilityService, WidgetService } from '../../../services';
import { calcDistance, calcDistanceToTarget } from '../events';
import useCommonActions from './useCommonActions';
import showMenu from '../../widgetMenu/ShowMenu';
import { BoardService } from '../../../services';
import { XConnector } from '@boardxus/canvasx';

const useLineActions = () => {
  const canvas: any = BoardService.getInstance().getBoard();
  let instance: any = null;

  const dispatch = useDispatch();

  const line = useSelector((state: RootState) => state.widget.line);

  const { handleCommonAfter, handleCommonBefore } = useCommonActions();

  const handleLineBefore = useCallback(() => {
    if (!canvas) return;

    // 1.锁定所有widget
    handleCommonBefore();

    // 2.设置新鼠标样式
    canvas.defaultCursor = 'crosshair';

    canvas.hoverCursor = 'crosshair';

    // 3.选择框置为false
    canvas.selection = false;

    canvas.requestRenderAll();
  }, [canvas]);

  const handleLineAfter = () => {
    handleCommonAfter();
  };

  const handleLineMouseDown = useCallback(
    (e: any) => {
      if (!canvas) return;

      // 1.获取起点位置
      const startPoint = e.pointer;

      const curShp = store.getState().widgets.connectorShape;

      const curTips = store.getState().widgets.tips;

      const arrowStrokeWidth = store.getState().widgets.arrowSize;

      const arrowStroke = store.getState().widgets.arrowStroke;

      // 2.创建arrow实例
      instance = new XConnector(
        [startPoint.x, startPoint.y, startPoint.x, startPoint.y],
        {
          angle: 0,
          fill: null,
          scaleX: 1,
          scaleY: 1,
          tips: curTips,
          locked: false,
          lockMovementX: false,
          lockMovementY: false,
          stroke: arrowStroke,
          connectorShape: curShp,
          strokeWidth: arrowStrokeWidth,
          hasBorders: false,
          hasControls: true,
          originX: 'center',
          originY: 'center',
          objType: 'XConnector',
          userId: store.getState().user.userInfo.userId,
          selectable: true,
          whiteboardId: store.getState().board.board.id,
          timestamp: Date.now(),
          zIndex: Date.now() * 100,
        }
      );

      //3修改其他位置控制点
      const otherObjs = canvas.getObjects().filter((obj: any) => {
        return obj.objType !== 'XConnector' && obj.id !== instance.id;
      });

      otherObjs.forEach((obj: any) => {
        if (
          obj.editable &&
          (obj.objType === 'XText' ||
            obj.objType === 'XCircleNotes' ||
            obj.objType === 'XShapeNotes' ||
            obj.objType === 'XRectNotes')
        ) {
          obj.editable = false;
        }

        if (obj.controls && obj.controls.mbaStart) {
          obj.controls.mbaStart.offsetY = 0;
          obj.controls.mbaStart.offsetX = 0;
        }

        if (obj.controls && obj.controls.mtaStart) {
          obj.controls.mtaStart.offsetY = 0;
          obj.controls.mtaStart.offsetX = 0;
        }

        if (obj.controls && obj.controls.mlaStart) {
          obj.controls.mlaStart.offsetY = 0;
          obj.controls.mlaStart.offsetX = 0;
        }

        if (obj.controls && obj.controls.mraStart) {
          obj.controls.mraStart.offsetY = 0;
          obj.controls.mraStart.offsetX = 0;
        }
      });

      canvas.requestRenderAll();

      instance.id = UtilityService.getInstance().generateWidgetID();

      if (e.target && e.target.objType !== 'XConnector') {
        canvas.setActiveObject(e.target);

        const calcPointer = calcDistanceToTarget(startPoint, e.target);

        instance.setConnectorObj(e.target, calcPointer, false, true);
      } else {
        instance.connectorStart = null;
      }

      showMenu(canvas);

      canvas.add(instance);
    },
    [canvas, line]
  );

  const handleLineMouseMove = useCallback(
    (e: any) => {
      // 1.获取移动点位置
      const movePointer = e.pointer;

      // 2.更改arrow结束点位置
      const currentTarget = e.target;

      if (currentTarget && currentTarget.objType === 'XConnector') return;

      if (currentTarget) {
        if (
          instance.connectorStart &&
          currentTarget.id === instance.connectorStart.id
        ) {
          return;
        }

        canvas.setActiveObject(currentTarget);
      } else {
        canvas.discardActiveObject();

        instance.set({
          x2: movePointer.x,
          y2: movePointer.y,
        });
      }

      canvas.requestRenderAll();
    },
    [canvas, line]
  );

  const handleLineMouseUp = useCallback(
    (e: any) => {
      if (!canvas) return;

      const distance = calcDistance(
        new fabric.Point(instance.x1, instance.y1),
        new fabric.Point(instance.x2, instance.y2)
      );

      if (distance < 5) {
        canvas.remove(instance);

        return;
      }

      if (e.target) {
        const calcPointer = calcDistanceToTarget(e.pointer, e.target);

        instance.setConnectorObj(e.target, calcPointer, false, false);

        e.target.__corner = calcPointer.dot;
      } else {
        instance.connectorEnd = null;
      }

      const connectArrowObj = instance.getObject();

      WidgetService.getInstance().insertWidget(connectArrowObj);

      const newLineState = {
        newState: connectArrowObj,
        targetId: connectArrowObj.id,
        action: 'ADDED',
      };

      canvas.pushNewState([newLineState]);

      canvas.setActiveObject(instance);

      setTimeout(() => {
        showMenu(canvas);
      }, 50);

      instance = null;

      canvas.requestRenderAll();

      dispatch(changeMode('default'));

      const objs = canvas.getObjects().filter((obj: any) => {
        return obj.objType !== 'XConnector';
      });

      objs.forEach((obj: any) => {
        if (
          obj.editable == false &&
          (obj.objType === 'XText' ||
            obj.objType === 'XCircleNotes' ||
            obj.objType === 'XShapeNotes' ||
            obj.objType === 'XRectNotes')
        ) {
          obj.editable = true;
        }

        if (obj.controls && obj.controls.mbaStart) {
          obj.controls.mbaStart.offsetY = 20;
          obj.controls.mbaStart.offsetX = 0;
        }

        if (obj.controls && obj.controls.mtaStart) {
          obj.controls.mtaStart.offsetY = -20;
          obj.controls.mtaStart.offsetX = 0;
        }

        if (obj.controls && obj.controls.mlaStart) {
          obj.controls.mlaStart.offsetY = 0;
          obj.controls.mlaStart.offsetX = -20;
        }

        if (obj.controls && obj.controls.mraStart) {
          obj.controls.mraStart.offsetY = 0;
          obj.controls.mraStart.offsetX = 20;
        }
      });

      canvas.requestRenderAll();
    },
    [canvas, line]
  );

  const handleLineShortCut = () => {
    dispatch(changeMode('line'));
  };

  return {
    handleLineBefore,
    handleLineAfter,
    handleLineMouseDown,
    handleLineMouseMove,
    handleLineMouseUp,
    handleLineShortCut,
  };
};

export default useLineActions;
