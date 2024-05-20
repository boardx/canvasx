import { Path } from '../Path';
import { Control } from '../../controls/Control';
import { invertTransform, multiplyTransformMatrices } from '../../util';
import { Point, XY } from '../../Point';
import { TMat2D } from '../../typedefs';
import { InteractiveFabricObject } from '../Object/InteractiveObject';
import { createObjectDefaultControls } from '../../controls/commonControls';
import { Transform } from '../../EventTypeDefs';
import { FabricObject } from '../Object/Object';

const getPath = (
  fromPoint: XY,
  toPoint: XY,
  control1: XY,
  control2: XY,
  offset: XY,
  style: any,
  isMoving = false
) => {
  let path: string = '';
  if (!isMoving) {
    offset = { x: -1, y: -1 };
  }
  path = `M ${fromPoint.x + offset.x} ${fromPoint.y + offset.y} C ${
    control1.x + offset.x
  }, ${control1.y + offset.y}, ${control2.x + offset.x} ${
    control2.y + offset.y
  }, ${toPoint.x + offset.x} ${toPoint.y + offset.y}`;

  console.log('path', path);
  return new Path(path).path;
};

class X_Connector extends Path {
  fromPoint: XY;
  toPoint: XY;
  control1: XY;
  control2: XY;
  offset: XY;
  style: any;
  prevLeft: number;
  prevTop: number;
  preCenter: Point;
  preTransform: TMat2D | null;

  constructor(
    fromPoint: XY,
    toPoint: XY,
    control1: XY,
    control2: XY,
    style: any,
    options = {}
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
    this.type = 'X_Connector';
    this.objectCaching = false;

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
      width,
      height,
      pathOffset,
    });
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
    const result = TransformPointFromObjectToCanvas(
      fabricObject,
      new Point({
        x: currentControl.offsetX,
        y: currentControl.offsetY,
      })
    );

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
        target.set({ fromPoint: relevantPoint });
        target.controls['start'].offsetX = relevantPoint.x;
        target.controls['start'].offsetY = relevantPoint.y;
        break;
      case 'end':
        target.set({ toPoint: relevantPoint });
        target.controls['end'].offsetX = relevantPoint.x;
        target.controls['end'].offsetY = relevantPoint.y;

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

    target.dirty = true;
    target.canvas?.requestRenderAll();

    return true;
  }

  private updateControlOffsets(target: any, offset: Point = new Point(0, 0)) {
    const offsetX = offset.x;
    const offsetY = offset.y;

    target.controls['start'].offsetX = target.fromPoint.x - offsetX;
    target.controls['start'].offsetY = target.fromPoint.y - offsetY;

    target.fromPoint.x -= offsetX;
    target.fromPoint.y -= offsetY;

    target.controls['end'].offsetX = target.toPoint.x - offsetX;
    target.controls['end'].offsetY = target.toPoint.y - offsetY;
    target.toPoint.x -= offsetX;
    target.toPoint.y -= offsetY;

    target.controls['control1'].offsetX = target.control1.x - offsetX;
    target.controls['control1'].offsetY = target.control1.y - offsetY;
    target.control1.x -= offsetX;
    target.control1.y -= offsetY;

    target.controls['control2'].offsetX = target.control2.x - offsetX;
    target.controls['control2'].offsetY = target.control2.y - offsetY;
    target.control2.x -= offsetX;
    target.control2.y -= offsetY;
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
      const point = TransformPointFromObjectToCanvas(
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

  updatePath(isMoving = false) {
    const path = getPath(
      this.fromPoint,
      this.toPoint,
      this.control1,
      this.control2,
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

const TransformPointFromObjectToCanvas = (
  object: FabricObject,
  point: Point
) => {
  const mObject = object.calcTransformMatrix();
  const mCanvas = object.canvas!.viewportTransform;
  const matrix = multiplyTransformMatrices(mCanvas, mObject);
  const transformedPoint = point.transform(matrix); // transformPoint(point, matrix);
  return transformedPoint;
};

export const TransformPointFromCanvasToObject = (
  object: FabricObject,
  point: Point
) => {
  const mObject = object.calcTransformMatrix();
  const invertedMatrix = invertTransform(mObject);
  const transformedPoint = point.transform(invertedMatrix);
  return transformedPoint;
};