import { Path } from '../Path';
import { Control } from '../../controls/Control';
import {
  invertTransform,
  multiplyTransformMatrices,
  sendPointToPlane,
} from '../../util';
import { Point, XY } from '../../Point';
import { transformPoint } from '../../util';
import { TMat2D } from '../../typedefs';
import { InteractiveFabricObject } from '../Object/InteractiveObject';

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
  style: any
) => {
  let path;
  //   offset = { x: -offset.x, y: -offset.y };
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
  console.log('!!path', path);
  return new Path(path).path;
};

class X_Connector extends Path {
  constructor(
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
        render: this._renderControl,
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
        render: this._renderControl,
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
        render: this._renderControl,
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
        render: this._renderControl,
      }),
    };

    // this.on('moving', this._onMoving.bind(this));

    // this.updatePath();
  }

  //   _onMoving(event) {
  //     const target = event.transform.target;
  //     const deltaX = target.left - target.prevLeft;
  //     const deltaY = target.top - target.prevTop;
  //     this.set({
  //       x1: this.x1 + deltaX,
  //       y1: this.y1 + deltaY,
  //       x2: this.x2 + deltaX,
  //       y2: this.y2 + deltaY,
  //     });
  //   }
  /**
   * @private
   * @param {Object} [options] Options
   */
  //   _setWidthHeight() {
  //     const { x1, y1, x2, y2 } = this;
  //     this.width = Math.abs(x2 - x1);
  //     this.height = Math.abs(y2 - y1);
  //     const { left, top, width, height } = makeBoundingBoxFromPoints([
  //       { x: x1 + this.left, y: y1 + this.top },
  //       { x: x2 + this.left, y: y2 + this.top },
  //     ]);
  //     const position = new Point(left + width / 2, top + height / 2);
  //     this.setPositionByOrigin(position, CENTER, CENTER);
  //   }

  _mouseDownControl(eventData, transform, x, y) {
    console.log('###mouseDownControl###');
    transform.target.prevLeft = transform.target.left;
    transform.target.prevTop = transform.target.top;
    transform.target.preCenter = transform.target.getCenterPoint();
    transform.target.preTransform = transform.target.calcTransformMatrix();
    console.log('###preTransform:', transform.target.preCenter);
  }

  _mouseUpControl(eventData, transform, x, y) {
    transform.target.setDimensions();
    transform.target.setCoords();
    console.log('###mouseUpControl###', transform.target.getCenterPoint());

    const offset = {
      x: transform.target.getCenterPoint().x - transform.target.preCenter.x,
      y: transform.target.getCenterPoint().y - transform.target.preCenter.y,
    };
    console.log('###offset:', offset);
    // loop all the controls and update the offset
    this.updateControlOffsets(transform.target, new Point(offset));
    delete transform.target.prevLeft;
    delete transform.target.prevTop;
    delete transform.target.preCenter;
    delete transform.target.preTransform;
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

  //responding to control movement
  //control is the control being moved
  //eventData is the mouse event
  dragActionHandler(controlType, eventData, transform, x, y) {
    const target = transform.target;
    // const relevantPoint = getLocalPoint(transform, 'center', 'top', x, y);

    const relevantPoint = TransformPointFromCanvasToObject(
      target,
      new Point(x, y)
    );

    relevantPoint.x = parseInt(relevantPoint.x.toString());
    relevantPoint.y = parseInt(relevantPoint.y.toString());

    // console.log(
    //   '###!! canvas point:',
    //   x,
    //   y,
    //   '### object point:',
    //   relevantPoint.x,
    //   relevantPoint.y
    // );

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

    target.updatePath();

    //reset the left/top of the target to the current left/top
    // target.setBoundingBox(true);

    // this._setWidthHeight();
    // target.setDimensions();

    target.dirty = true;
    target.canvas.requestRenderAll();

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

  _renderControl(ctx, left, top, styleOverride, fabricObject) {
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.arc(left, top, 5, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  updatePath() {
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
      this.style
    );
    this.set({ path });
    this.dirty = true;
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

window.sendPointToPlane = sendPointToPlane;
window.Point = Point;

const TransformPointFromCanvasToObject = (object, point) => {
  //   const result = sendPointToPlane(
  //     point,
  //     object.canvas.viewportTransform,
  //     object.calcTransformMatrix()
  //   );
  //   return result;
  //   return new Point(point).transform(
  //     invertTransform(
  //       multiplyTransformMatrices(
  //         object.getViewportTransform(),
  //         object.calcTransformMatrix()
  //       )
  //     )
  //   );
  const mObject = object.calcTransformMatrix();
  //   const mCanvas = object.getViewportTransform();
  //   const matrix = multiplyTransformMatrices(mCanvas, mObject);
  const invertedMatrix = invertTransform(mObject);
  const transformedPoint = point.transform(invertedMatrix);
  return transformedPoint;
};
window.TransformPointFromCanvasToObject = TransformPointFromCanvasToObject;
