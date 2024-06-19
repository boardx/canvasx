//**React */
import { useCallback } from 'react';

//**Fabric */

//**Store */
import store, { RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { changeMode } from '../../../redux/features/mode.slice';

//**Services */
import { UtilityService } from '../../../services';
import { calcDistance } from '../events';
import useCommonActions from './useCommonActions';
import showMenu from '../../widgetMenu/ShowMenu';
import { BoardService } from '../../../services';
import { XConnector } from '../../../../../../fabric';
import * as fabric from '../../../../../../fabric';
import { Point } from '../../../../../../fabric';

const useLineActions = () => {
  const canvas: any = BoardService.getInstance().getBoard();
  let instance: XConnector | null = canvas?.instanceOfConnector;
  let startPoint: any = canvas?.startPointOfConnector;
  let endPoint: any = canvas?.endPointOfConnector;

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
  const getControlPointOnCanvas = (obj: any, controlName: string) => {
    const controlInfo = obj.controls[controlName];
    const x = controlInfo.x * obj.width;
    const y = controlInfo.y * obj.height;
    const point = new fabric.Point(x, y);

    const transformedPoint = obj.transformPointToCanvas(point);

    return transformedPoint;
  };
  const handleLineMouseDown = useCallback(
    (e: any) => {
      if (!canvas) return;
      console.log('!@handleLineMouseDown', instance, e);
      // 1.获取起点位置
      startPoint = e.scenePoint;
      const endPoint = startPoint;
      let control1 = new Point(startPoint.x + 50, startPoint.y);
      const control2 = new Point(startPoint.x + 50, startPoint.y);

      const curShp = store.getState().widgets.connectorShape;

      const curTips = store.getState().widgets.tips;

      const arrowStrokeWidth = store.getState().widgets.arrowSize;

      const arrowStroke = store.getState().widgets.arrowStroke;
      const style = 'curvePath';

      const otherObjs = canvas.getObjects().filter((obj: any) => {
        return obj.objType !== 'XConnector' && obj.id !== instance?.id;
      });

      // otherObjs.forEach((obj: any) => {
      //   if (
      //     obj.editable &&
      //     (obj.objType === 'XText' ||
      //       obj.objType === 'XCircleNotes' ||
      //       obj.objType === 'XShapeNotes' ||
      //       obj.objType === 'XRectNotes')
      //   ) {
      //     obj.editable = false;
      //   }

      //   if (obj.controls && obj.controls.mbaStart) {
      //     obj.controls.mbaStart.offsetY = 0;
      //     obj.controls.mbaStart.offsetX = 0;
      //   }

      //   if (obj.controls && obj.controls.mtaStart) {
      //     obj.controls.mtaStart.offsetY = 0;
      //     obj.controls.mtaStart.offsetX = 0;
      //   }

      //   if (obj.controls && obj.controls.mlaStart) {
      //     obj.controls.mlaStart.offsetY = 0;
      //     obj.controls.mlaStart.offsetX = 0;
      //   }

      //   if (obj.controls && obj.controls.mraStart) {
      //     obj.controls.mraStart.offsetY = 0;
      //     obj.controls.mraStart.offsetX = 0;
      //   }
      // });
      const currentDockingObject = canvas.dockingWidget;
      if (currentDockingObject && currentDockingObject.hoveringControl) {
        const hoverPoint = getControlPointOnCanvas(
          currentDockingObject,
          currentDockingObject.hoveringControl
        );

        startPoint = hoverPoint;

        control1 = currentDockingObject.calculateControlPoint(
          currentDockingObject.getBoundingRect(),
          new Point(hoverPoint.x, hoverPoint.y)
        );
      }
      if (!instance) {
        // 2.创建arrow实例
        instance = new XConnector(
          startPoint,
          endPoint,
          control1,
          control1,
          style,
          {
            stroke: 'black',
            strokeWidth: 2,
            pathType: style,
            pathArrowTip: 'both',
            fill: '',
            objectCaching: false,
            hasBorders: false,
            hasControls: true,
            selectable: true,
            fromId: currentDockingObject?.id,
            toId: null,
            perPixelTargetFind: true,
            id: Math.random().toString(36).substr(2, 9),
          }
        );
        canvas.instanceOfConnector = instance;
      }

      canvas.requestRenderAll();

      instance.id = UtilityService.getInstance().generateWidgetID();

      // if (e.target && e.target.objType !== 'XConnector') {
      //   canvas.setActiveObject(e.target);

      //   const calcPointer = calcDistanceToTarget(startPoint, e.target);

      //   instance.setConnectorObj(e.target, calcPointer, false, true);
      // } else {
      //   instance.connectorStart = null;
      // }

      showMenu(canvas);

      canvas.add(instance);
    },
    [canvas, line]
  );

  const handleLineMouseMove = useCallback(
    (e: any) => {
      console.log('!@handleLineMouseMove', instance);
      // 1.获取移动点位置
      const movePointer = e.scenePoint;

      // 2.更改arrow结束点位置
      const currentTarget = e.target;

      // if (currentTarget && currentTarget.objType === 'XConnector') return;

      // if (currentTarget) {
      //   // if (
      //   //   instance.connectorStart &&
      //   //   currentTarget.id === instance.connectorStart.id
      //   // ) {
      //   //   return;
      //   // }
      //   // canvas.setActiveObject(currentTarget);
      // } else {
      // canvas.discardActiveObject();
      instance && updateConnector(movePointer, instance, 'to');
      const currentDocingWidget = canvas.dockingWidget;

      if (currentDocingWidget && currentDocingWidget.hoveringControl) {
        console.log(
          'uselineactions',
          currentDocingWidget,
          currentDocingWidget.hoveringControl
        );
        const hoveringPoint = getControlPointOnCanvas(
          currentDocingWidget,
          currentDocingWidget.hoveringControl
        );
        endPoint = hoveringPoint;
        instance &&
          updateConnector(hoveringPoint, instance, 'to', currentDocingWidget);
      }

      // }

      canvas.requestRenderAll();
    },
    [canvas, line]
  );
  function updateConnector(
    point: any,
    connector: XConnector,
    type: string,
    targetObject?: any
  ) {
    console.log('$$updateConnector', connector, type, targetObject);
    //if the connector is from the object, then the startpoint should be updated
    //if the connector is to the object, then the endpoint should be updated
    let controlPoint1, controlPoint2, controlPoint;

    if (targetObject) {
      controlPoint = targetObject.calculateControlPoint(
        targetObject.getBoundingRect(),
        new Point(point.x, point.y)
      );

      // Recalculate the startpoint or endpoint of the connector, and also the ControlPoint
      if (type === 'from') {
        connector.update({
          fromPoint: point,
          control1: controlPoint,
        });
      }
      if (type === 'to') {
        connector.update({
          toPoint: point,
          control2: controlPoint,
        });
      }
    } else {
      const fromPoint =
        type === 'from'
          ? point
          : connector.transformPointToCanvas(new Point(connector.fromPoint!));

      const toPoint =
        type === 'to'
          ? point
          : connector.transformPointToCanvas(new Point(connector.toPoint!));

      // Calculate the midpoint between the points
      const midPoint = new Point(
        (fromPoint.x + toPoint.x) / 2,
        (fromPoint.y + toPoint.y) / 2
      );

      // Calculate a smoothness factor, you can adjust this value to get the desired smoothness
      const smoothness = 0.2;

      // Calculate the angle between the points
      const angle = Math.atan2(
        toPoint.y - fromPoint.y,
        toPoint.x - fromPoint.x
      );

      // Calculate the distance between the points
      const distance = Math.sqrt(
        Math.pow(toPoint.x - fromPoint.x, 2) +
          Math.pow(toPoint.y - fromPoint.y, 2)
      );

      // Calculate the offset for control points
      const offset = distance * smoothness;

      // Calculate control points for a smoother curve
      const controlPoint1 = new Point(
        midPoint.x - offset * Math.sin(angle),
        midPoint.y + offset * Math.cos(angle)
      );

      const controlPoint2 = new Point(
        midPoint.x + offset * Math.sin(angle),
        midPoint.y - offset * Math.cos(angle)
      );

      // Recalculate the startpoint or endpoint of the connector, and also the ControlPoint
      if (type === 'from') {
        connector.update({
          fromPoint: point,
          control1: controlPoint1,
          control2: controlPoint2,
        });
      }
      if (type === 'to' && !connector.fromId) {
        connector.update({
          toPoint: point,
          control1: controlPoint1,
          control2: controlPoint2,
        });
      } else {
        connector.update({
          toPoint: point,
          control2: controlPoint2,
        });
      }
    }
  }

  const handleLineMouseUp = useCallback(
    (e: any) => {
      if (!canvas) return;

      const distance = calcDistance(instance?.fromPoint, instance?.toPoint);
      let endPoint, control2;

      if (distance < 5) {
        canvas.remove(instance);

        return;
      }

      const currentDockingObject = canvas.dockingWidget;
      if (currentDockingObject && currentDockingObject.hoveringControl) {
        const hoverPoint = getControlPointOnCanvas(
          currentDockingObject,
          currentDockingObject.hoveringControl
        );

        endPoint = hoverPoint;

        control2 = currentDockingObject.calculateControlPoint(
          currentDockingObject.getBoundingRect(),
          new Point(hoverPoint.x, hoverPoint.y)
        );
      }

      instance && (instance.toId = currentDockingObject?.id);

      //update fromObject and toObject according to fromId and toId
      if (instance?.fromId) {
        const fromObject = canvas.findById(instance.fromId);

        // instance.fromObject = fromObject;
        if (!fromObject.connectors) {
          fromObject.connectors = [];
        }
        fromObject &&
          startPoint &&
          fromObject.connectors.push({
            connectorId: instance.id,
            point: {
              x: startPoint.x - fromObject.left,
              y: startPoint.y - fromObject.top,
            },
          });

        fromObject && (fromObject.hoveringControl = '');
      }
      if (instance?.toId) {
        const toObject = canvas.findById(instance.toId);

        if (toObject && !toObject.connectors) {
          toObject.connectors = [];
        }
        toObject &&
          endPoint &&
          toObject.connectors.push({
            connectorId: instance.id,
            point: {
              x: endPoint.x - toObject.left,
              y: endPoint.y - toObject.top,
            },
          });

        toObject && (toObject.hoveringControl = '');
      }

      // if (e.target) {
      //   const calcPointer = calcDistanceToTarget(e.pointer, e.target);

      //   instance.setConnectorObj(e.target, calcPointer, false, false);

      //   e.target.__corner = calcPointer.dot;
      // } else {
      //   instance.connectorEnd = null;
      // }

      // const connectArrowObj = instance.getObject();

      // WidgetService.getInstance().insertWidget(connectArrowObj);

      // const newLineState = {
      //   newState: connectArrowObj,
      //   targetId: connectArrowObj.id,
      //   action: 'ADDED',
      // };

      // canvas.pushNewState([newLineState]);

      canvas.setActiveObject(instance);

      // setTimeout(() => {
      showMenu(canvas);
      // }, 50);

      instance = null;
      const tempWidget = canvas.dockingWidget;
      canvas.dockingWidget = null;

      tempWidget.dirty = true;

      canvas.requestRenderAll();

      dispatch(changeMode('default'));

      const objs = canvas.getObjects().filter((obj: any) => {
        return obj.objType !== 'XConnector';
      });

      objs.forEach((obj: any) => {
        objs.hoveringControl = null;
        // if (
        //   obj.editable == false &&
        //   (obj.objType === 'XText' ||
        //     obj.objType === 'XCircleNotes' ||
        //     obj.objType === 'XShapeNotes' ||
        //     obj.objType === 'XRectNotes')
        // ) {
        //   obj.editable = true;
        // }

        // if (obj.controls && obj.controls.mbaStart) {
        //   obj.controls.mbaStart.offsetY = 20;
        //   obj.controls.mbaStart.offsetX = 0;
        // }

        // if (obj.controls && obj.controls.mtaStart) {
        //   obj.controls.mtaStart.offsetY = -20;
        //   obj.controls.mtaStart.offsetX = 0;
        // }

        // if (obj.controls && obj.controls.mlaStart) {
        //   obj.controls.mlaStart.offsetY = 0;
        //   obj.controls.mlaStart.offsetX = -20;
        // }

        // if (obj.controls && obj.controls.mraStart) {
        //   obj.controls.mraStart.offsetY = 0;
        //   obj.controls.mraStart.offsetX = 20;
        // }
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
