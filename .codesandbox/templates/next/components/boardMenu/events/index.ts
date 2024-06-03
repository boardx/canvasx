//** Import Fabric */

//** Services */
import { BoardService, SystemService, UtilityService } from '../../../services';

//** RXJS */
import { fromEvent, switchMap, takeUntil, tap } from 'rxjs';

//** Import Redux toolkit */
import store from '../../../redux/store';
import {
  handleSetZoomFactor,
  handleWidgetMenuDisplay,
} from '../../../redux/features/board.slice';

//** Import component */
import showMenu from '../../widgetMenu/ShowMenu';
import { XShapeNotes } from '@boardxus/canvasx';
export const calcDimension = (source: any, target: any) => {
  return {
    width: target.x < source.x ? source.x - target.x : target.x - source.x,
    height: target.y < source.y ? source.y - target.y : target.y - source.y,
  };
};

//functions for connector
export function calcDistanceToTarget(current: any, target: any) {
  const { left, top, width, height, scaleX, scaleY } = target;
  const canvas: any = BoardService.getInstance().getBoard();
  if (canvas.getActiveObject().isEditing) {
    canvas.getActiveObject().exitEditing();
  }

  //如果箭头在当前object内部，不用计算直接返回
  if (
    current.x > left &&
    current.x < left + width &&
    current.y > top &&
    current.y < top + height
  ) {
    return {
      x: current.x,
      y: current.y,
      dot: 0,
    };
  }

  const range = 30;

  const ml = { x: left - (width * scaleX) / 2, y: top };
  const mr = { x: left + (width * scaleX) / 2, y: top };
  const mt = { x: left, y: top - (height * scaleY) / 2 };
  const mb = { x: left, y: top + (height * scaleY) / 2 };

  if (current.y > mt.y && current.y < mb.y) {
    if (current.x > ml.x && current.x < ml.x + range) {
      return {
        x: ml.x,
        y: ml.y,
        dot: 'mla',
      };
    }

    if (current.x > mr.x - range && current.x < mr.x) {
      return {
        x: mr.x,
        y: mr.y,
        dot: 'mra',
      };
    }
  }

  if (current.x > ml.x && current.x < mr.x) {
    if (current.y > mt.y && current.y < mt.y + range) {
      return {
        x: mt.x,
        y: mt.y,
        dot: 'mta',
      };
    }

    if (current.y > mb.y - range && current.y < mb.y) {
      return {
        x: mb.x,
        y: mb.y,
        dot: 'mba',
      };
    }
  }

  return {
    x: current.x - 5,
    y: current.y - 5,
    dot: 0,
  };
}

export const calcDirection = (source: any, target: any) => {
  return {
    x: target.x < source.x ? 'right' : 'left',
    y: target.y < source.y ? 'bottom' : 'top',
  };
};

export const calcDistance = (source: any, target: any) => {
  return Math.sqrt(
    Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)
  );
};

// export function createLineFunc2(pointer: any, target: any) {
//   const arrowStroke = store.getState().widgets.arrowStroke;

//   const arrowStrokeWidth = store.getState().widgets.arrowSize;

//   const curShp = store.getState().widgets.connectorShape;

//   const connectorArrow = new fabric.Arrow(
//     [pointer.x, pointer.y, pointer.x, pointer.y],
//     {
//       angle: 0,
//       fill: null,
//       scaleX: 1,
//       scaleY: 1,
//       tips: "end",
//       locked: false,
//       lockMovementX: false,
//       lockMovementY: false,
//       stroke: arrowStroke,
//       connectorShape: curShp,
//       strokeWidth: arrowStrokeWidth,
//       hasBorders: false,
//       hasControls: true,
//       originX: "center",
//       originY: "center",
//       objType: "XConnector",
//       userId: store.getState().user.userInfo.userId,
//       whiteboardId: store.getState().board.board.id,
//       timestamp: Date.now(),
//       zIndex: Date.now() * 100,
//       visible: false,
//     }
//   );
//   connectorArrow.id = UtilityService.getInstance().generateWidgetID();

//   connectorArrow.setConnectorObj(target, pointer, false, true);

//   const otherObjs = canvas.getObjects().filter((obj: any) => {
//     return obj.objType !== "XConnector" && obj.id !== target.id;
//   });

//   otherObjs.forEach((obj: any) => {
//     if (
//       obj.editable &&
//       (obj.objType === "XText" ||
//         obj.objType === "XCircleNotes" ||
//         obj.objType === "XShapeNotes" ||
//         obj.objType === "XRectNotes")
//     ) {
//       obj.editable = false;
//     }

//     if (obj.controls && obj.controls.mbaStart) {
//       obj.controls.mbaStart.offsetY = 0;
//       obj.controls.mbaStart.offsetX = 0;
//     }

//     if (obj.controls && obj.controls.mtaStart) {
//       obj.controls.mtaStart.offsetY = 0;
//       obj.controls.mtaStart.offsetX = 0;
//     }

//     if (obj.controls && obj.controls.mlaStart) {
//       obj.controls.mlaStart.offsetY = 0;
//       obj.controls.mlaStart.offsetX = 0;
//     }

//     if (obj.controls && obj.controls.mraStart) {
//       obj.controls.mraStart.offsetY = 0;
//       obj.controls.mraStart.offsetX = 0;
//     }
//   });

//   canvas.requestRenderAll();

//   canvas.add(connectorArrow);

//   const mouseUp$ = fromEvent(canvas, "mouse:up");

//   const mouseMove$ = fromEvent(canvas, "mouse:move")
//     .pipe(takeUntil(mouseUp$))
//     .subscribe((move: any) => {
//       const currentTarget = canvas.findTarget(move.e);

//       const movePointer = canvas.getPointer(move.e);

//       if (currentTarget && currentTarget.objType === "XConnector") return;

//       if (currentTarget) {
//         if (
//           connectorArrow.connectorStart &&
//           currentTarget.id === connectorArrow.connectorStart.id
//         ) {
//           return;
//         }

//         canvas.setActiveObject(currentTarget);

//         const calcPointer = calcDistanceToTarget(movePointer, currentTarget);

//         connectorArrow.setConnectorObj(
//           currentTarget,
//           calcPointer,
//           false,
//           false
//         );

//         currentTarget.__corner = calcPointer.dot;
//       } else {
//         canvas.discardActiveObject();

//         connectorArrow.set({
//           x2: movePointer.x,
//           y2: movePointer.y,
//         });

//         connectorArrow.connectorEnd = null;
//       }

//       connectorArrow.visible = true;

//       canvas.requestRenderAll();
//     });

//   const drawEnd$ = mouseUp$.subscribe((_) => {
//     const distance = calcDistance(
//       new fabric.Point(connectorArrow.x1, connectorArrow.y1),
//       new fabric.Point(connectorArrow.x2, connectorArrow.y2)
//     );

//     if (distance < 5) {
//       canvas.remove(connectorArrow);

//       mouseMove$ && mouseMove$.unsubscribe();

//       drawEnd$ && drawEnd$.unsubscribe();

//       return;
//     }

//     store.dispatch(handleSetConnectorModifyMode(false));

//     store.dispatch(handleSetConnectorMode(false));

//     if (!connectorArrow.visible) {
//       if (connectorArrow.connectorStart) {
//         canvas.removeWidget(connectorArrow);
//       }

//       canvas.remove(connectorArrow);

//       return;
//     }

//     const startTarget = canvas.findById(connectorArrow.connectorStart.id);

//     //修正当前连接线的起始位置
//     const startFixPosition = calcControlPointOfObject(
//       connectorArrow,
//       startTarget
//     );

//     connectorArrow.set({
//       x1: startFixPosition?.x,
//       y1: startFixPosition?.y,
//     });

//     const connectArrowObj: any = connectorArrow.getObject();

//     // WidgetService.getInstance().insertWidget(connectArrowObj);

//     const newLineState = {
//       newState: connectArrowObj,
//       targetId: connectArrowObj.id,
//       action: "ADDED",
//     };

//     canvas.pushNewState([newLineState]);

//     if (mouseMove$) {
//       mouseMove$.unsubscribe();

//       drawEnd$.unsubscribe();
//     }

//     const objs = canvas.getObjects().filter((obj: any) => {
//       return obj.objType !== "XConnector";
//     });

//     objs.forEach((obj: any) => {
//       if (
//         obj.editable == false &&
//         (obj.objType === "XText" ||
//           obj.objType === "XCircleNotes" ||
//           obj.objType === "XShapeNotes" ||
//           obj.objType === "XRectNotes")
//       ) {
//         obj.editable = true;
//       }

//       if (obj.controls && obj.controls.mbaStart) {
//         obj.controls.mbaStart.offsetY = 20;
//         obj.controls.mbaStart.offsetX = 0;
//       }

//       if (obj.controls && obj.controls.mtaStart) {
//         obj.controls.mtaStart.offsetY = -20;
//         obj.controls.mtaStart.offsetX = 0;
//       }

//       if (obj.controls && obj.controls.mlaStart) {
//         obj.controls.mlaStart.offsetY = 0;
//         obj.controls.mlaStart.offsetX = -20;
//       }

//       if (obj.controls && obj.controls.mraStart) {
//         obj.controls.mraStart.offsetY = 0;
//         obj.controls.mraStart.offsetX = 20;
//       }
//     });

//     canvas.discardActiveObject();

//     canvas.requestRenderAll();
//   });
// }

export function calcControlEndPointOfObject(arrow: any, obj: any) {
  const canvas: any = BoardService.getInstance().getBoard();
  const object = canvas.findById(obj.id);

  //如果在object内部，直接返回
  if (
    arrow.x2 > object.aCoords.bl.x &&
    arrow.x2 < object.aCoords.br.x &&
    arrow.y2 > object.aCoords.tl.y &&
    arrow.y2 < object.aCoords.bl.y
  ) {
    return {
      x: arrow.x2,
      y: arrow.y2,
      dot: 0,
    };
  }

  const mla = {
    x: object.left - (object.width * object.scaleX) / 2 + 0.5,
    y: object.top,
  };

  const mra = {
    x: object.left + (object.width * object.scaleX) / 2 - 0.5,
    y: object.top,
  };

  const mta = {
    x: object.left,
    y: object.top - (object.height * object.scaleY) / 2 + 0.5,
  };

  const mba = {
    x: object.left,
    y: object.top + (object.height * object.scaleY) / 2 - 0.5,
  };

  const lineX = arrow.x2,
    lineY = arrow.y2;

  //计算line的点离哪个控制点最近
  const distance = [];

  distance.push(
    Math.sqrt(Math.pow(lineX - mla.x, 2) + Math.pow(lineY - mla.y, 2))
  );

  distance.push(
    Math.sqrt(Math.pow(lineX - mra.x, 2) + Math.pow(lineY - mra.y, 2))
  );

  distance.push(
    Math.sqrt(Math.pow(lineX - mta.x, 2) + Math.pow(lineY - mta.y, 2))
  );

  distance.push(
    Math.sqrt(Math.pow(lineX - mba.x, 2) + Math.pow(lineY - mba.y, 2))
  );

  const minDistance = Math.min(...distance);

  const index = distance.indexOf(minDistance);

  switch (index) {
    case 0:
      return {
        x: mla.x,
        y: mla.y,
        dot: 'mla',
      };
    case 1:
      return {
        x: mra.x,
        y: mra.y,
        dot: 'mra',
      };
    case 2:
      return {
        x: mta.x,
        y: mta.y,
        dot: 'mta',
      };
    case 3:
      return {
        x: mba.x,
        y: mba.y,
        dot: 'mba',
      };
    default:
      break;
  }
}

export function resetPositionForArrows() {
  const canvas: any = BoardService.getInstance().getBoard();
  if (!canvas) return;

  const objects = canvas.getObjects();

  objects.forEach((object: any) => {
    if (object.objType === 'XConnector') {
      if (object.connectorStart) {
        //获取控制点start
        const targetObjectControlPointStart: any = calcControlPointOfObject(
          { x: object.x1, y: object.y1 },
          object.connectorStart
        );

        object.set({
          x1: targetObjectControlPointStart?.x,
          y1: targetObjectControlPointStart?.y,
        });
      }

      if (object.connectorEnd) {
        //获取控制点end
        const targetObjectControlPointEnd = calcControlPointOfObject(
          { x: object.x2, y: object.y2 },
          object.connectorEnd
        );

        //重新设置控制点
        object.set({
          x2: targetObjectControlPointEnd?.x,
          y2: targetObjectControlPointEnd?.y,
        });
      }
    }
  });

  canvas.requestRenderAll();
}

export function calcControlPointOfObject(arrow: any, obj: any) {
  const canvas: any = BoardService.getInstance().getBoard();
  const object = canvas.findById(obj.id);

  //如果在object内部，直接返回
  if (
    arrow.x1 > object.aCoords.bl.x &&
    arrow.x1 < object.aCoords.br.x &&
    arrow.y1 > object.aCoords.tl.y &&
    arrow.y1 < object.aCoords.bl.y
  ) {
    return {
      x: arrow.x1,
      y: arrow.y1,
      dot: 0,
    };
  }

  const mla = {
    x: object.left - (object.width * object.scaleX) / 2,
    y: object.top,
  };

  const mra = {
    x: object.left + (object.width * object.scaleX) / 2,
    y: object.top,
  };

  const mta = {
    x: object.left,
    y: object.top - (object.height * object.scaleY) / 2,
  };

  const mba = {
    x: object.left,
    y: object.top + (object.height * object.scaleY) / 2,
  };

  const lineX = arrow.x1,
    lineY = arrow.y1;

  //计算line的点离哪个控制点最近
  const distance = [];

  distance.push(
    Math.sqrt(Math.pow(lineX - mla.x, 2) + Math.pow(lineY - mla.y, 2))
  );

  distance.push(
    Math.sqrt(Math.pow(lineX - mra.x, 2) + Math.pow(lineY - mra.y, 2))
  );

  distance.push(
    Math.sqrt(Math.pow(lineX - mta.x, 2) + Math.pow(lineY - mta.y, 2))
  );

  distance.push(
    Math.sqrt(Math.pow(lineX - mba.x, 2) + Math.pow(lineY - mba.y, 2))
  );

  const minDistance = Math.min(...distance);

  const index = distance.indexOf(minDistance);

  switch (index) {
    case 0:
      return {
        x: mla.x,
        y: mla.y,
        dot: 'mla',
      };
    case 1:
      return {
        x: mra.x,
        y: mra.y,
        dot: 'mra',
      };
    case 2:
      return {
        x: mta.x,
        y: mta.y,
        dot: 'mta',
      };
    case 3:
      return {
        x: mba.x,
        y: mba.y,
        dot: 'mba',
      };
    default:
      break;
  }
}

export function calcControlPointOfObjectInActiveSelection(
  arrow: any,
  obj: any
) {
  const canvas: any = BoardService.getInstance().getBoard();
  const object = canvas.findById(obj.id);

  const activeSelection = canvas.getActiveSelection();

  //如果在object内部，直接返回
  if (
    arrow.x1 > object.aCoords.bl.x + activeSelection.left &&
    arrow.x1 < object.aCoords.br.x + activeSelection.left &&
    arrow.y1 > object.aCoords.tl.y + activeSelection.top &&
    arrow.y1 < object.aCoords.bl.y + activeSelection.top
  ) {
    return {
      x: arrow.x1,
      y: arrow.y1,
      dot: 0,
    };
  }

  const mla = {
    x: object.left + activeSelection.left - (object.width * object.scaleX) / 2,
    y: object.top + activeSelection.top,
  };

  const mra = {
    x: object.left + activeSelection.left + (object.width * object.scaleX) / 2,
    y: object.top + activeSelection.top,
  };

  const mta = {
    x: object.left + activeSelection.left,
    y: object.top + activeSelection.top - (object.height * object.scaleY) / 2,
  };

  const mba = {
    x: object.left + activeSelection.left,
    y: object.top + activeSelection.top + (object.height * object.scaleY) / 2,
  };

  const lineX = arrow.x1,
    lineY = arrow.y1;

  //计算line的点离哪个控制点最近
  const distance = [];

  distance.push(
    Math.sqrt(Math.pow(lineX - mla.x, 2) + Math.pow(lineY - mla.y, 2))
  );

  distance.push(
    Math.sqrt(Math.pow(lineX - mra.x, 2) + Math.pow(lineY - mra.y, 2))
  );

  distance.push(
    Math.sqrt(Math.pow(lineX - mta.x, 2) + Math.pow(lineY - mta.y, 2))
  );

  distance.push(
    Math.sqrt(Math.pow(lineX - mba.x, 2) + Math.pow(lineY - mba.y, 2))
  );

  const minDistance = Math.min(...distance);

  const index = distance.indexOf(minDistance);

  switch (index) {
    case 0:
      return {
        x: mla.x,
        y: mla.y,
        dot: 'mla',
      };
    case 1:
      return {
        x: mra.x,
        y: mra.y,
        dot: 'mra',
      };
    case 2:
      return {
        x: mta.x,
        y: mta.y,
        dot: 'mta',
      };
    case 3:
      return {
        x: mba.x,
        y: mba.y,
        dot: 'mba',
      };
    default:
      break;
  }
}

export const createShapeNote = (target: any, iconType: any) => {
  const canvas: any = BoardService.getInstance().getBoard();
  const widget: any = {
    angle: 0,
    width: 1,
    height: 1,
    scaleX: 1,
    scaleY: 1,
    left: target.x,
    top: target.y,
    fill: null,
    stroke: '#BDBDBD',
    strokeWidth: 4,
    objType: store.getState().board.drawToCreateWidget,
    userid: store.getState().user.userInfo.userId,
    whiteboardId: store.getState().board.board.id,
    timestamp: Date.now(),
    zIndex: Date.now() * 100,
    isPanel: false,
    shapeName: iconType,
    text: '',
    lockMovementX: false,
    lockMovementY: false,
    selectable: true,
    locked: false,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    verticalAlign: iconType === 5 ? 'bottom' : 'middle',
  };

  widget.id = UtilityService.getInstance().generateWidgetID();

  const obj = new XShapeNotes(widget.text, widget);

  obj.setControlsVisibility({
    tr: true,
    br: true,
    bl: true,
    ml: true,
    mr: true,
    mt: true,
    mb: true,
    tl: true,
    mtr: false,
    mtr2: true,
    mla: true,
    mra: true,
    mta: true,
    mba: true,
  });

  return obj;
};

export function createShapeByIconTypeFunc(type: any) {
  const canvas: any = BoardService.getInstance().getBoard();
  canvas.discardActiveObject();

  canvas.defaultCursor = 'crosshair';

  canvas.hoverCursor = 'crosshair';

  canvas.requestRenderAll();

  const mouseDown$ = fromEvent(canvas, 'mouse:down');

  const mouseMove$ = fromEvent(canvas, 'mouse:move');

  const mouseUp$ = fromEvent(canvas, 'mouse:up');

  let obj: any = null;

  let sourcePosition: any = null;

  let draw$: any = mouseDown$
    .pipe(
      tap((down: any) => {
        sourcePosition = canvas.getPointer(down.e);
      }),
      switchMap((_) => mouseMove$.pipe(takeUntil(mouseUp$)))
    )
    .subscribe((move: any) => {
      if (!obj) {
        obj = createShapeNote(sourcePosition, type);

        obj.fontFamily = 'Inter';
        obj.fontSize = 26;
        obj.strokeWidth = 0;
        obj.objType = 'XShapeNotes';
        obj.fill = '#555555';
        obj.stroke = '#BDBDBD';
        obj.backgroundColor = 'rgba(0, 0, 0, 0)';
        obj.fixedLineWidth = 2;
        obj.lineWidth = 2;
        obj.strokeWidth = 0.2;
        obj.lockMovementX = false;
        obj.lockMovementY = false;
        obj.selectable = true;
        obj.locked = false;
        obj.lockUniScaling = true;

        canvas.add(obj);
      } else {
        const targetPosition = canvas.getPointer(move.e);

        const { width, height } = calcDimension(sourcePosition, targetPosition);

        const { x, y } = calcDirection(sourcePosition, targetPosition);

        obj.width = Math.abs(width);

        obj.height = Math.abs(height);

        obj.maxHeight = Math.abs(height);

        obj.originX = x;

        obj.originY = y;

        obj.dirty = true;
      }

      canvas.requestRenderAll();
    });

  let drawEnd$: any = mouseUp$.subscribe((e: any) => {
    obj.left += obj.originX === 'left' ? obj.width / 2 : (-1 * obj.width) / 2;

    obj.top += obj.originY === 'top' ? obj.height / 2 : (-1 * obj.height) / 2;

    obj.originX = 'center';

    obj.originY = 'center';

    obj.dirty = true;

    obj.setCoords();

    // WidgetService.getInstance().insertWidget(obj.getObject());

    const newState = canvas.findById(obj.id).getUndoRedoState('ADDED');

    canvas.pushNewState(newState);

    canvas.setActiveObject(obj);

    canvas.requestRenderAll();

    if (draw$) {
      draw$.unsubscribe();
      draw$ = null;
      drawEnd$.unsubscribe();
      drawEnd$ = null;
    }
  });
}

function checkIsTrackpad(e: any) {
  const inputDevice = localStorage.getItem('inputDevice');
  if (inputDevice === 'trackpad') {
    return true;
  }

  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  let isTrackpad = false;

  const isFirefox = SystemService.getInstance().getIsFirefox();

  // console.log('isFirefox', isFirefox);

  if (isMac) {
    isTrackpad = checkMacTrackpad(e);
  } else {
    isTrackpad = checkNonMacTrackpad(e, isFirefox);
  }

  return isTrackpad;
}

function checkMacTrackpad(e: any) {
  // console.log('checkMacTrackpad', e.deltaY );
  // Commonly, trackpads will have a non-integer `deltaY` value when scrolling, whereas a mouse will have an integer.
  // This is not universally true, but it holds up in many cases.
  const isLikelyTrackpad = e.deltaY !== Math.round(e.deltaY);

  return !isLikelyTrackpad;
}

function checkNonMacTrackpad(e: any, isFirefox: any) {
  if (isFirefox) {
    return (
      e.deltaMode === e.DOM_DELTA_PIXEL && e.deltaX === 0 && e.deltaY === 0
    );
  }

  return e.deltaY === e.wheelDeltaY * -1;
}

let timer: any = null;

export function mouseWheelListener(e: any) {
  const canvas: any = BoardService.getInstance().getBoard();
  // console.log('mouseWheelListener', e.ctrlKey)
  const isTrackpad = checkIsTrackpad(e) && !e.ctrlKey;

  if (!canvas) return;

  if (e.buttons !== 0) {
    // console.log('e.buttons !== 0', e)
    return;
  }

  if (timer && canvas.getActiveObject()) {
    clearTimeout(timer);
    timer = null;
  }

  timer = setTimeout(() => {
    showMenu(canvas);
  }, 200);

  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  // console.log('isMac', isMac, 'isTrackpad', isTrackpad);;

  store.dispatch(handleWidgetMenuDisplay(false));

  const users: any = store.getState().user.onlineUsers;

  const deltaY = Math.abs(e.deltaY);

  if (isTrackpad && canvas.mouse) {
    canvas.mouse.delta.x -= e.deltaX;

    canvas.mouse.delta.y -= e.deltaY;

    canvas.isEnablePanMoving = true;

    canvas.relativePan(canvas.mouse.delta);

    canvas.updateViewportToLocalStorage(canvas.viewportTransform);

    canvas.requestRenderAll();

    canvas.mouse.delta.x = 0;

    canvas.mouse.delta.y = 0;

    if (store.getState().board.followMe && users?.length - 1 > 0) {
      canvas.updateViewport();
    }

    return false;
  }

  const isPanAction =
    Math.abs(e.deltaX) !== 0 || parseInt(deltaY.toString()) === deltaY;

  if (isMac && isPanAction) {
    return false;
  }

  let zoom = canvas.getZoom();

  if (isMac) {
    zoom *= 0.999 ** (e.deltaY * 10);

    if (deltaY > 100) {
      zoom = canvas.getZoom() * 0.999 ** (e.deltaY / 6.6);
    }
  } else {
    if (isPanAction) {
      zoom = canvas.getZoom() * 0.999 ** e.deltaY;
    } else {
      zoom = canvas.getZoom() * 1.001 ** (e.wheelDelta / 2);
    }
  }

  if (zoom > 4 && !store.getState().slides.slidesMode) zoom = 4;

  if (zoom < 0.05) zoom = 0.05;

  store.dispatch(handleSetZoomFactor(zoom));

  canvas.zoomToPoint({ x: e.layerX, y: e.layerY }, zoom);

  canvas.updateViewportToLocalStorage(canvas.viewportTransform);

  canvas.requestRenderAll();

  if (store.getState().board.followMe && users?.length - 1 > 0) {
    canvas.updateViewport();
  }
  const objects = canvas.getObjects();

  if (objects && objects.length > 0) {
    const zoom = canvas.getZoom();
    objects.map((obj: any) => {
      let limitWidth = obj.width * obj.scaleX * zoom;
      if (limitWidth < 32) {
        obj.set({
          hasControls: false,
        });
      } else {
        obj.set({
          hasControls: true,
        });
      }
      //deal with pic
      if (obj.objType === 'WBImage' && zoom > 0.4) {
        if (obj.src) {
          let pic = obj.src.replace('smallPic/', 'bigPic/');
          obj.set({ src: pic });
        }
      }

      if (obj.objType === 'WBImage' && zoom < 0.4) {
        if (obj.src) {
          let pic = obj.src.replace('bigPic/', 'smallPic/');
          obj.set({ src: pic });
        }
      }
    });
  }
}

export function handlePreventDefaultEvent(e: any) {
  e.stopPropagation();
  e.preventDefault();
}
