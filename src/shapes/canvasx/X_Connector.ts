import { Path } from '../Path';
import { Control } from '../../controls/Control';
import { invertTransform, multiplyTransformMatrices } from '../../util';
import { Point, XY } from '../../Point';
import { transformPoint } from '../../util';
import { TMat2D } from '../../typedefs';
import { InteractiveFabricObject } from '../Object/InteractiveObject';
import { createObjectDefaultControls } from '../../controls/commonControls';
import { Transform } from '../../EventTypeDefs';
import { FabricObject } from '../Object/Object';

const getPath = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  controlPoint1X: number,
  controlPoint1Y: number,
  controlPoint2X: number,
  controlPoint2Y: number,
  offset: XY,
  style: any,
  isMoving = false
) => {
  let path: string = '';
  if (!isMoving) {
    offset = { x: -1, y: -1 };
  }
  if (style === 'straight') {
    path = `M ${x1} ${y1} L ${x2} ${y2}`;
  } else if (style === 'curved') {
    path = `M ${x1 + offset.x} ${y1 + offset.y} C ${
      controlPoint1X + offset.x
    } ${controlPoint1Y + offset.y}, ${controlPoint2X + offset.x} ${
      controlPoint2Y + offset.y
    }, ${x2 + offset.x} ${y2 + offset.y}`;
  } else if (style === 'angled') {
    const midX = (x1 + x2) / 2;
    path = `M ${x1} ${y1} L ${midX} ${controlPoint1Y} L ${x2} ${y2}`;
  }
  return new Path(path).path;
};

class X_Connector extends Path {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  controlPoint1X: number;
  controlPoint1Y: number;
  controlPoint2X: number;
  controlPoint2Y: number;
  offset: XY;
  style: any;
  prevLeft: number;
  prevTop: number;
  preCenter: Point;
  preTransform: TMat2D | null;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    controlPoint1X: number,
    controlPoint1Y: number,
    controlPoint2X: number,
    controlPoint2Y: number,
    left: number,
    top: number,
    style: any,
    options = {}
  ) {
    const path = getPath(
      x1,
      y1,
      x2,
      y2,
      controlPoint1X,
      controlPoint1Y,
      controlPoint2X,
      controlPoint2Y,
      { x: 0, y: 0 },
      style
    );
    super(path, options);

    this.type = 'X_Connector';
    this.objectCaching = false;

    this.set({
      x1,
      y1,
      x2,
      y2,
      controlPoint1X,
      controlPoint1Y,
      controlPoint2X,
      controlPoint2Y,
      left,
      top,
      style,
    });

    this.controls = {
      ...createObjectDefaultControls,
      start: new Control({
        x: 0,
        y: 0,
        offsetX: x1,
        offsetY: y1,
        mouseDownHandler: this._mouseDownControl.bind(this),
        mouseUpHandler: this._mouseUpControl.bind(this),
        positionHandler: this._positionControl.bind(this),
        // positionHandler: this._positionStartControl.bind(this),
        actionHandler: this.dragActionHandler.bind(this, 'start'),
        cursorStyle: 'crosshair',
        render: this._renderControl.bind(this, 'start'),
      }),
      end: new Control({
        x: 0,
        y: 0,
        offsetX: x2,
        offsetY: y2,
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
        offsetX: controlPoint1X,
        offsetY: controlPoint1Y,
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
        offsetX: controlPoint2X,
        offsetY: controlPoint2Y,
        mouseDownHandler: this._mouseDownControl.bind(this),
        mouseUpHandler: this._mouseUpControl.bind(this),
        positionHandler: this._positionControl.bind(this),
        actionHandler: this.dragActionHandler.bind(this, 'control2'),
        cursorStyle: 'crosshair',
        render: this._renderControl.bind(this, 'control2'),
      }),
    };
  }

  _mouseDownControl(
    eventData: any,
    transform: Transform,
    x: number,
    y: number
  ) {
    this.prevLeft = transform.target.left;
    this.prevTop = transform.target.top;
    this.preCenter = transform.target.getCenterPoint();
    this.preTransform = transform.target.calcTransformMatrix();
  }

  _mouseUpControl(eventData: any, transform: Transform, x: number, y: number) {
    this.updatePath(false);
    this.setBoundingBox(false);
    transform.target.setCoords();
    const offset = {
      x: transform.target.getCenterPoint().x - this.preCenter.x,
      y: transform.target.getCenterPoint().y - this.preCenter.y,
    };
    // loop all the controls and update the offset
    this.updateControlOffsets(transform.target, new Point(offset));
    this.prevLeft = 0;
    this.prevTop = 0;
    this.preCenter = new Point(0, 0);
    this.preTransform = null;
  }

  _positionControl(
    dim: Point,
    finalMatrix: TMat2D,
    fabricObject: InteractiveFabricObject,
    currentControl: Control
  ) {
    const result = TransformPointFromObjectToCanvas(fabricObject, {
      x: currentControl.offsetX,
      y: currentControl.offsetY,
    });

    return result;
  }

  onStartPointMoving(
    eventData: any,
    transform: Transform,
    x: number,
    y: number
  ) {}

  onEndPointMoving(
    eventData: any,
    transform: Transform,
    x: number,
    y: number
  ) {}

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

    const relevantPoint = TransformPointFromCanvasToObject(
      target,
      new Point(x, y)
    );

    relevantPoint.x = parseInt(relevantPoint.x.toString());
    relevantPoint.y = parseInt(relevantPoint.y.toString());

    switch (controlType) {
      case 'start':
        target.set({ x1: relevantPoint.x, y1: relevantPoint.y });
        target.controls['start'].offsetX = relevantPoint.x;
        target.controls['start'].offsetY = relevantPoint.y;
        break;
      case 'end':
        target.set({ x2: relevantPoint.x, y2: relevantPoint.y });
        target.controls['end'].offsetX = relevantPoint.x;
        target.controls['end'].offsetY = relevantPoint.y;

        break;
      case 'control1':
        target.set({
          controlPoint1X: relevantPoint.x,
          controlPoint1Y: relevantPoint.y,
        });
        target.controls['control1'].offsetX = relevantPoint.x;
        target.controls['control1'].offsetY = relevantPoint.y;
        break;
      case 'control2':
        target.set({
          controlPoint2X: relevantPoint.x,
          controlPoint2Y: relevantPoint.y,
        });
        target.controls['control2'].offsetX = relevantPoint.x;
        target.controls['control2'].offsetY = relevantPoint.y;

        break;
    }

    const isMoving = true;
    this.updatePath(isMoving);

    target.dirty = true;
    target.canvas?.requestRenderAll();

    return true;
  }

  private updateControlOffsets(target: any, offset: Point = new Point(0, 0)) {
    const offsetX = offset.x;
    const offsetY = offset.y;

    target.controls['start'].offsetX = target.x1 - offsetX;
    target.controls['start'].offsetY = target.y1 - offsetY;

    target.x1 = target.x1 - offsetX;
    target.y1 = target.y1 - offsetY;

    target.controls['end'].offsetX = target.x2 - offsetX;
    target.controls['end'].offsetY = target.y2 - offsetY;
    target.x2 = target.x2 - offsetX;
    target.y2 = target.y2 - offsetY;

    target.controls['control1'].offsetX = target.controlPoint1X - offsetX;
    target.controls['control1'].offsetY = target.controlPoint1Y - offsetY;
    target.controlPoint1X = target.controlPoint1X - offsetX;
    target.controlPoint1Y = target.controlPoint1Y - offsetY;

    target.controls['control2'].offsetX = target.controlPoint2X - offsetX;
    target.controls['control2'].offsetY = target.controlPoint2Y - offsetY;
    target.controlPoint2X = target.controlPoint2X - offsetX;
    target.controlPoint2Y = target.controlPoint2Y - offsetY;
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
    if (controlType === 'start' || controlType === 'end') {
      color = 'white';
    }
    if (controlType === 'control1' || controlType === 'control2') {
      color = 'blue';
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

  updatePath(isMoving = false) {
    const path = getPath(
      this.x1,
      this.y1,
      this.x2,
      this.y2,
      this.controlPoint1X,
      this.controlPoint1Y,
      this.controlPoint2X,
      this.controlPoint2Y,
      this.pathOffset,
      this.style,
      isMoving
    );
    this.set({ path });
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

export { X_Connector };

const TransformPointFromObjectToCanvas = (object, point) => {
  const mObject = object.calcTransformMatrix();
  const mCanvas = object.canvas.viewportTransform;
  const matrix = multiplyTransformMatrices(mCanvas, mObject);
  const transformedPoint = transformPoint(point, matrix);
  return transformedPoint;
};

export const TransformPointFromCanvasToObject = (object, point) => {
  const mObject = object.calcTransformMatrix();
  const invertedMatrix = invertTransform(mObject);
  const transformedPoint = point.transform(invertedMatrix);
  return transformedPoint;
};
