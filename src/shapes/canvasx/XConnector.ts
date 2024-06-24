import { Path } from '../Path';
import { Control } from '../../controls/Control';
import { invertTransform, multiplyTransformMatrices } from '../../util';
import { Point, XY } from '../../Point';
import { TMat2D } from '../../typedefs';
import { InteractiveFabricObject } from '../Object/InteractiveObject';
import { createObjectDefaultControls } from '../../controls/commonControls';
import { FabricObject } from '../Object/Object';
import { Transform } from '../../EventTypeDefs';
import { classRegistry } from '../../ClassRegistry';

const getPath = (
  fromPoint: XY,
  toPoint: XY,
  control1: XY,
  control2: XY,
  offset: XY,
  style: any,
  isMoving = false,
  pathType: 'curvePath' | 'straightPath' = 'curvePath',
  pathArrowTip: 'none' | 'start' | 'end' | 'both' = 'both'
) => {
  let path: string = '';
  let offsetX = 0;
  let offsetY = 0;

  if (!isMoving) {
    offsetX = -1;
    offsetY = -1;
  } else {
    offsetX = offset.x;
    offsetY = offset.y;
  }

  if (pathType === 'curvePath') {
    path = `M ${fromPoint.x + offsetX} ${fromPoint.y + offsetY} C ${
      control1.x + offsetX
    }, ${control1.y + offsetY}, ${control2.x + offsetX} ${
      control2.y + offsetY
    }, ${toPoint.x + offsetX} ${toPoint.y + offsetY}`;
  } else {
    path = `M ${fromPoint.x + offsetX} ${fromPoint.y + offsetY} L ${
      toPoint.x + offsetX
    } ${toPoint.y + offsetY}`;
  }

  let startPath = '';
  let endPath = '';

  if (pathArrowTip === 'start' || pathArrowTip === 'both') {
    const startArrowSize = 10; // Adjust the size of the start arrow tip
    let startAngle;

    if (pathType === 'straightPath')
      startAngle =
        Math.atan2(fromPoint.y - toPoint.y, fromPoint.x - toPoint.x) + Math.PI;
    else
      startAngle = Math.atan2(
        control1.y - fromPoint.y,
        control1.x - fromPoint.x
      );

    const startArrow1X =
      fromPoint.x +
      offsetX +
      startArrowSize * Math.cos(startAngle + Math.PI / 6);
    const startArrow1Y =
      fromPoint.y +
      offsetY +
      startArrowSize * Math.sin(startAngle + Math.PI / 6);
    const startArrow2X =
      fromPoint.x +
      offsetX +
      startArrowSize * Math.cos(startAngle - Math.PI / 6);
    const startArrow2Y =
      fromPoint.y +
      offsetY +
      startArrowSize * Math.sin(startAngle - Math.PI / 6);

    startPath = `M ${startArrow1X} ${startArrow1Y} L ${fromPoint.x + offsetX} ${
      fromPoint.y + offsetY
    } L ${startArrow2X} ${startArrow2Y}`;
  }

  if (pathArrowTip === 'end' || pathArrowTip === 'both') {
    const endArrowSize = 10; // Adjust the size of the end arrow tip
    let endAngle;
    if (pathType === 'straightPath') {
      endAngle = Math.atan2(toPoint.y - fromPoint.y, toPoint.x - fromPoint.x);
    } else {
      endAngle = Math.atan2(toPoint.y - control2.y, toPoint.x - control2.x);
    }

    const endArrow1X =
      toPoint.x + offsetX - endArrowSize * Math.cos(endAngle - Math.PI / 6);
    const endArrow1Y =
      toPoint.y + offsetY - endArrowSize * Math.sin(endAngle - Math.PI / 6);
    const endArrow2X =
      toPoint.x + offsetX - endArrowSize * Math.cos(endAngle + Math.PI / 6);
    const endArrow2Y =
      toPoint.y + offsetY - endArrowSize * Math.sin(endAngle + Math.PI / 6);

    endPath = `M ${endArrow1X} ${endArrow1Y} L ${toPoint.x + offsetX} ${
      toPoint.y + offsetY
    } L ${endArrow2X} ${endArrow2Y}`;
  }

  // Combine all parts of the path
  path = `${startPath} ${path} ${endPath}`;

  return path;
};

class XConnector extends Path {
  static type = 'XConnector';
  objType = 'Xconnector';

  fromPoint: XY | null;
  toPoint: XY | null;
  control1: XY | null;
  control2: XY | null;
  offset: XY;
  style: any;
  prevLeft: number;
  prevTop: number;
  preCenter: Point;
  preTransform: TMat2D | null;
  fromObjectId: string;
  toObjectId: string;
  pathType: 'curvePath' | 'straightPath' = 'curvePath';
  pathArrowTip: 'none' | 'start' | 'end' | 'both' = 'both';

  constructor(
    fromPoint: XY,
    toPoint: XY,
    control1: XY,
    control2: XY,
    style: any = {},
    options: any = {}
  ) {
    const path = getPath(
      fromPoint,
      toPoint,
      control1,
      control2,
      { x: 0, y: 0 },
      style
    );
    super(path, options);
    this.initialize();
    this.type = 'XConnector';
    this.objectCaching = false;
    this.pathType = options.pathType || 'curvePath';
    this.pathArrowTip = options.pathArrowTip || 'both';
    this.fromId = options.fromId;
    this.toId = options.toId;

    const localFromPoint = TransformPointFromCanvasToObject(
      this,
      new Point(fromPoint)
    );
    const localToPoint = TransformPointFromCanvasToObject(
      this,
      new Point(toPoint)
    );
    const localControl1 = TransformPointFromCanvasToObject(
      this,
      new Point(control1)
    );
    const localControl2 = TransformPointFromCanvasToObject(
      this,
      new Point(control2)
    );
    // if (!this.canvas) return;
    // let from = new Point(fromPoint).transform(this.canvas!.viewportTransform);
    // let to = new Point(toPoint).transform(this.canvas!.viewportTransform);
    // let control11 = new Point(control1).transform(
    //   this.canvas!.viewportTransform
    // );
    // let control21 = new Point(control2).transform(
    //   this.canvas!.viewportTransform
    // );

    this.set({
      fromPoint: localFromPoint,
      toPoint: localToPoint,
      control1: localControl1,
      control2: localControl2,
      style,
    });

    this.controls = {
      ...createObjectDefaultControls,
      start: new Control({
        x: 0,
        y: 0,
        offsetX: localFromPoint.x,
        offsetY: localFromPoint.y,
        mouseDownHandler: this._mouseDownControl.bind(this),
        mouseUpHandler: this._mouseUpControl.bind(this),
        positionHandler: this._positionControl.bind(this),
        actionHandler: this.dragActionHandler.bind(this, 'start'),
        cursorStyle: 'crosshair',
        render: this._renderControl.bind(this, 'start'),
      }),
      end: new Control({
        x: 0,
        y: 0,
        offsetX: localToPoint.x,
        offsetY: localToPoint.y,
        mouseDownHandler: this._mouseDownControl.bind(this),
        mouseUpHandler: this._mouseUpControl.bind(this),
        positionHandler: this._positionControl.bind(this),
        actionHandler: this.dragActionHandler.bind(this, 'end'),
        cursorStyle: 'crosshair',
        render: this._renderControl.bind(this, 'end'),
      }),
      control1: new Control({
        x: 0,
        y: 0,
        offsetX: localControl1.x,
        offsetY: localControl1.y,
        mouseDownHandler: this._mouseDownControl.bind(this),
        mouseUpHandler: this._mouseUpControl.bind(this),
        positionHandler: this._positionControl.bind(this),
        actionHandler: this.dragActionHandler.bind(this, 'control1'),
        cursorStyle: 'crosshair',
        render: this._renderControl.bind(this, 'control1'),
      }),
      control2: new Control({
        x: 0,
        y: 0,
        offsetX: localControl2.x,
        offsetY: localControl2.y,
        mouseDownHandler: this._mouseDownControl.bind(this),
        mouseUpHandler: this._mouseUpControl.bind(this),
        positionHandler: this._positionControl.bind(this),
        actionHandler: this.dragActionHandler.bind(this, 'control2'),
        cursorStyle: 'crosshair',
        render: this._renderControl.bind(this, 'control2'),
      }),
    };
  }

  initialize() {
    // this.setDimensions();

    const { left, top, width, height, pathOffset } = this._calcDimensions();
    console.log(' path initialize ', left, top, width, height, pathOffset);
    this.set({
      left,
      top,
      width,
      height,
      pathOffset,
    });
    this.canvas?.renderAll();
  }

  update({ fromPoint, toPoint, control1, control2, style }: any) {
    let localFromPoint, localToPoint, localControl1, localControl2;

    let newFrom, newTo, newControl1, newControl2;

    this.prevLeft = this.left;
    this.prevTop = this.top;
    this.preCenter = this.getCenterPoint();
    this.preTransform = this.calcTransformMatrix();

    if (fromPoint) {
      newFrom = fromPoint;
      localFromPoint = TransformPointFromCanvasToObject(
        this,
        new Point(fromPoint)
      );
    } else {
      localFromPoint = this.fromPoint;
      newFrom = TransformPointFromObjectToCanvas(
        this,
        new Point(this.fromPoint!)
      );
    }

    if (toPoint) {
      newTo = toPoint;
      localToPoint = TransformPointFromCanvasToObject(this, new Point(toPoint));
      //   this.toPoint = localToPoint;
    } else {
      localToPoint = this.toPoint;
      newTo = TransformPointFromObjectToCanvas(this, new Point(this.toPoint!));
    }
    if (control1) {
      newControl1 = control1;
      localControl1 = TransformPointFromCanvasToObject(
        this,
        new Point(control1)
      );
    } else {
      localControl1 = this.control1;
      newControl1 = TransformPointFromObjectToCanvas(
        this,
        new Point(this.control1!)
      );
    }

    if (control2) {
      newControl2 = control2;
      localControl2 = TransformPointFromCanvasToObject(
        this,
        new Point(control2)
      );
    } else {
      localControl2 = this.control2;
      newControl2 = TransformPointFromObjectToCanvas(
        this,
        new Point(this.control2!)
      );
    }
    if (style) {
      this.style = style;
    }

    Object.assign(this, {
      fromPoint: newFrom,
      toPoint: newTo,
      control1: newControl1,
      control2: newControl2,
      style,
    });
    // console.log(
    //   'update path fromPoint',
    //   newFrom,
    //   'toPoint',
    //   newTo,
    //   'control1',
    //   newControl1,
    //   'control2',
    //   newControl2,
    //   'style',
    //   style
    // );
    this.updatePath(false);
    // const path = getPath(
    //   newFrom,
    //   newTo,
    //   newControl1,
    //   newControl2,
    //   { x: 0, y: 0 },
    //   style,
    //   false
    // );
    // this.path = new Path(path).path;
    // console.log('path', JSON.stringify(this.path));

    this.set({
      fromPoint: localFromPoint,
      toPoint: localToPoint,
      control1: localControl1,
      control2: localControl2,
      style,
    });
    // this.initialize();
    // this.updateControlOffsets(new Point(0, 0));

    this.updatePath(false);
    this.setBoundingBox(false);
    this.setCoords();
    const offset = {
      x: this.getCenterPoint().x - this.preCenter.x,
      y: this.getCenterPoint().y - this.preCenter.y,
    };
    // loop all the controls and update the offset
    this.updateControlOffsets(new Point(offset));
    this.prevLeft = 0;
    this.prevTop = 0;
    this.preCenter = new Point(0, 0);
    this.preTransform = null;

    // this.setBoundingBox(false);
    // const path = getPath(
    //   fromPoint
    //     ? fromPoint
    //     : TransformPointFromObjectToCanvas(this, new Point(this.fromPoint)),
    //   toPoint
    //     ? toPoint
    //     : TransformPointFromObjectToCanvas(this, new Point(this.toPoint)),
    //   control1
    //     ? control1
    //     : TransformPointFromObjectToCanvas(this, new Point(this.control1)),
    //   control2
    //     ? control2
    //     : TransformPointFromObjectToCanvas(this, new Point(this.control2)),
    //   { x: 0, y: 0 },
    //   style
    // );
    // console.log('path', path);
    // this.set({ path });

    // this.initialize();
    this.canvas?.renderAll();
  }

  _mouseDownControl(
    eventData: any,
    transform: Transform,
    x: number,
    y: number
  ) {
    const pointerEvent = eventData.e;
    const target = transform.target;
    target.objectCaching = false;
    this.prevLeft = transform.target.left;
    this.prevTop = transform.target.top;
    this.preCenter = transform.target.getCenterPoint();
    this.preTransform = transform.target.calcTransformMatrix();
    transform.target.canvas?.initializeConnectorMode();

    // target.canvas?.fire('mouse:down:before', {
    //   ...eventData,
    //   isSecondEvent: true,
    // });
    // target.canvas!.instanceOfConnector = target;
  }

  _mouseUpControl(eventData: any, transform: Transform, x: number, y: number) {
    transform.target.canvas?.exitConnectorMode();
    transform.target.canvas.dockingWidget! = null;
    transform.target.dirty = true;
    this.updatePath(false);
    this.setBoundingBox(false);

    transform.target.setCoords();
    const offset = {
      x: transform.target.getCenterPoint().x - this.preCenter.x,
      y: transform.target.getCenterPoint().y - this.preCenter.y,
    };
    // loop all the controls and update the offset
    this.updateControlOffsets(new Point(offset));
    this.prevLeft = 0;
    this.prevTop = 0;
    this.preCenter = new Point(0, 0);
    this.preTransform = null;
    transform.target.canvas?.requestRenderAll();
  }

  _positionControl(
    dim: Point,
    finalMatrix: TMat2D,
    fabricObject: InteractiveFabricObject,
    currentControl: Control
  ) {
    const point = {
      x: currentControl.offsetX,
      y: currentControl.offsetY,
    };
    //@ts-ignore
    const result = fabricObject.transformPointToViewport(point);

    return result;
  }

  getControlPointOnCanvas(obj: any, controlName: string) {
    const controlInfo = obj.controls[controlName];
    const x = controlInfo.x * obj.width;
    const y = controlInfo.y * obj.height;
    const point = new Point(x, y);

    const transformedPoint = obj.transformPointToCanvas(point);

    return transformedPoint;
  }

  //responding to control movement
  //control is the control being moved
  //eventData is the mouse event
  dragActionHandler(
    controlType: string,
    eventData: any,
    transform: Transform,
    x: number,
    y: number
  ) {
    const target = transform.target;
    // const relevantPoint = getLocalPoint(transform, 'center', 'top', x, y);
    //@ts-ignore

    let targetX = x,
      targetY = y;
    const currentDockingObject = target.canvas?.dockingWidget;

    if (
      currentDockingObject &&
      currentDockingObject.controls[currentDockingObject.hoveringControl]
    ) {
      const hoverPoint = this.getControlPointOnCanvas(
        currentDockingObject,
        currentDockingObject.hoveringControl
      );

      targetX = hoverPoint.x;
      targetY = hoverPoint.y;
    }
    const relevantPoint = target.transformPointFromCanvas(
      new Point(targetX, targetY)
    );

    // console.log('dragActionHandler', controlType, x, y, relevantPoint);
    // relevantPoint.x = relevantPoint.x ;
    // relevantPoint.y = relevantPoint.y ;

    switch (controlType) {
      case 'start':
        target.set({ fromPoint: relevantPoint });
        target.controls['start'].offsetX = relevantPoint.x;
        target.controls['start'].offsetY = relevantPoint.y;
        if (
          currentDockingObject &&
          currentDockingObject.calculateControlPoint
        ) {
          const controlPoint = currentDockingObject.calculateControlPoint(
            currentDockingObject.getBoundingRect(),
            new Point(targetX, targetY)
          );
          const relevantControlPoint =
            target.transformPointFromCanvas(controlPoint);
          target.set({ control1: relevantControlPoint });

          if (target.fromId) {
            const fromObject = target.canvas?.findById(target.fromId);
            if (fromObject) {
              fromObject.connectors = fromObject.connectors?.filter(
                (connector: any) => connector.connectorId !== target.id
              );
            }
          }
          target.fromId = currentDockingObject.id;
          if (!currentDockingObject.connectors)
            currentDockingObject.connectors = [];
          currentDockingObject.connectors.push({
            connectorId: target.id,
            point: {
              x: targetX - currentDockingObject.left,
              y: targetY - currentDockingObject.top,
            },
          });
        }
        break;
      case 'end':
        target.set({ toPoint: relevantPoint });
        target.controls['end'].offsetX = relevantPoint.x;
        target.controls['end'].offsetY = relevantPoint.y;
        if (
          currentDockingObject &&
          currentDockingObject.calculateControlPoint
        ) {
          const controlPoint = currentDockingObject.calculateControlPoint(
            currentDockingObject.getBoundingRect(),
            new Point(targetX, targetY)
          );
          const relevantControlPoint =
            target.transformPointFromCanvas(controlPoint);
          target.set({ control2: relevantControlPoint });

          if (target.toId) {
            const toObject = target.canvas?.findById(target.toId);
            if (toObject) {
              const newConnectors = toObject.connectors?.filter(
                (connector: any) => connector.connectorId !== target.id
              );
              toObject.connectors = newConnectors;
            }
          }

          target.toId = currentDockingObject.id;
          if (!currentDockingObject.connectors)
            currentDockingObject.connectors = [];
          currentDockingObject.connectors.push({
            connectorId: target.id,
            point: {
              x: targetX - currentDockingObject.left,
              y: targetY - currentDockingObject.top,
            },
          });
        }
        break;
      case 'control1':
        target.set({ control1: relevantPoint });
        target.controls['control1'].offsetX = relevantPoint.x;
        target.controls['control1'].offsetY = relevantPoint.y;

        break;
      case 'control2':
        target.set({ control2: relevantPoint });
        target.controls['control2'].offsetX = relevantPoint.x;
        target.controls['control2'].offsetY = relevantPoint.y;

        break;
    }

    const isMoving = true;
    this.updatePath(isMoving);
    this.updateControlOffsets(new Point(0, 0));

    target.dirty = true;
    target.canvas?.requestRenderAll();

    return true;
  }

  private updateControlOffsets(offset: Point = new Point(0, 0)) {
    const target = this;
    const offsetX = offset.x;
    const offsetY = offset.y;

    target.controls['start'].offsetX = target.fromPoint!.x - offsetX;
    target.controls['start'].offsetY = target.fromPoint!.y - offsetY;

    target.fromPoint!.x -= offsetX;
    target.fromPoint!.y -= offsetY;

    target.controls['end'].offsetX = target.toPoint!.x - offsetX;
    target.controls['end'].offsetY = target.toPoint!.y - offsetY;
    target.toPoint!.x -= offsetX;
    target.toPoint!.y -= offsetY;

    target.controls['control1'].offsetX = target.control1!.x - offsetX;
    target.controls['control1'].offsetY = target.control1!.y - offsetY;
    target.control1!.x -= offsetX;
    target.control1!.y -= offsetY;

    target.controls['control2'].offsetX = target.control2!.x - offsetX;
    target.controls['control2'].offsetY = target.control2!.y - offsetY;
    target.control2!.x -= offsetX;
    target.control2!.y -= offsetY;
  }

  _renderControl(
    controlType: string,
    ctx: any,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: FabricObject
  ) {
    let color = 'white';
    if (controlType === 'control1' || controlType === 'control2') {
      color = 'blue';
    }

    const drawDottedLine = (targetControl: string) => {
      const point = TransformPointFromObjectToCanvas2(
        fabricObject,
        new Point({
          x: this.controls[targetControl].offsetX,
          y: this.controls[targetControl].offsetY,
        })
      );

      ctx.save();
      ctx.strokeStyle = 'gray';
      ctx.setLineDash([5, 5]); // Set the line dash pattern
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(point.x, point.y);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    if (controlType === 'control1') {
      drawDottedLine('start');
    }

    if (controlType === 'control2') {
      drawDottedLine('end');
    }

    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    ctx.arc(left, top, 5, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  updatePath(isMoving = true) {
    const path = getPath(
      this.fromPoint!,
      this.toPoint!,
      this.control1!,
      this.control2!,
      this.pathOffset,
      this.style,
      isMoving
    );

    this.path = new Path(path).path;
    this.dirty = true;
  }
  setBoundingBox(adjustPosition?: boolean) {
    const preMatrix = this.calcTransformMatrix();
    const { left, top, width, height, pathOffset } = this._calcDimensions();

    //the new left/top after transformation
    const newLeftTop = new Point(left, top).transform(preMatrix);

    this.set({
      left: newLeftTop.x,
      top: newLeftTop.y,
      width,
      height,
      pathOffset,
    });
  }
}

export { XConnector };

// todo: why TransformPointFromObjectToCanvas and TransformPointFromObjectToCanvas2 is different? why it works for one doesn't work for another?
export const TransformPointFromObjectToCanvas = (
  object: FabricObject,
  point: Point
) => {
  const mObject = object.calcOwnMatrix();
  // const mCanvas = object.getViewportTransform();
  // const matrix = multiplyTransformMatrices(mCanvas, mObject);
  const transformedPoint = point.transform(mObject); // transformPoint(point, matrix);
  return transformedPoint;
};

export const TransformPointFromCanvasToObject = (
  object: FabricObject,
  point: Point
) => {
  const mObject = object.calcOwnMatrix();
  // const mCanvas = object.canvas!.viewportTransform;
  // const matrix = multiplyTransformMatrices(mCanvas, mObject);
  const invertedMatrix = invertTransform(mObject);
  const transformedPoint = point.transform(invertedMatrix);
  return transformedPoint;
};

export const TransformPointFromObjectToCanvas2 = (
  object: FabricObject,
  point: Point
) => {
  const mObject = object.calcTransformMatrix();
  const mCanvas = object.canvas!.viewportTransform;
  const matrix = multiplyTransformMatrices(mCanvas, mObject);
  const transformedPoint = point.transform(matrix); // transformPoint(point, matrix);
  return transformedPoint;
};

classRegistry.setClass(XConnector);
