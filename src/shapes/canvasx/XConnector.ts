import { Path } from '../Path';
import {
  multiplyTransformMatrices,
  sendPointToPlane,
  TSimpleParsedCommand,
} from '../../util';
import { Point, XY } from '../../Point';
import { TMat2D } from '../../typedefs';
import { createObjectDefaultControls } from '../../controls/commonControls';
import { FabricObject } from '../Object/Object';
import { Transform } from '../../EventTypeDefs';
import { classRegistry } from '../../ClassRegistry';
import { iMatrix } from '../../constants';
import { createPathControls } from '../../controls/pathControl';
import { makePathSimpler, parsePath } from '../../util/path';
const getPath = (
  fromPoint: XY,
  toPoint: XY,
  control1: XY,
  control2: XY,
  pathType: 'curvePath' | 'straightPath' = 'curvePath'
) => {
  if (pathType === 'curvePath') {
    return `M ${fromPoint.x} ${fromPoint.y} C ${control1.x}, ${control1.y}, ${control2.x} ${control2.y}, ${toPoint.x} ${toPoint.y}`;
  } else {
    return `M ${fromPoint.x} ${fromPoint.y} L ${toPoint.x} ${toPoint.y}`;
  }
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
  declare pathType: 'curvePath' | 'straightPath';
  declare pathArrowTip: 'none' | 'start' | 'end' | 'both';

  /**
   * Contains the path to draw the arrow tip start
   */
  declare pathStart: TSimpleParsedCommand[];

  /**
   * Contains the path to draw the arrow tip end
   */
  declare pathEnd: TSimpleParsedCommand[];

  constructor(
    fromPoint: XY,
    toPoint: XY,
    control1: XY,
    control2: XY,
    style: any = {},
    options: any = {}
  ) {
    const path = getPath(fromPoint, toPoint, control1, control2);
    super(path, options);
    this.type = 'XConnector';
    this.objectCaching = false;
    this.pathType = options.pathType || 'curvePath';
    this.pathArrowTip = options.pathArrowTip || 'both';
    this.fromId = options.fromId;
    this.toId = options.toId;
    this.style = style;
    this.calcStartEndPath();
    this.controls = {
      ...createObjectDefaultControls,
      ...createPathControls(this, {
        mouseDownHandler: this._mouseDownControl.bind(this),
        mouseUpHandler: this._mouseUpControl.bind(this),
        cursorStyle: 'crosshair',
      }),
      //   actionHandler: this.dragActionHandler.bind(this, 'control2'),
      //   render: this._renderControl.bind(this, 'control2'),
    };
    this.on('modifyPath', function (this: XConnector, evtOpt) {
      this.calcStartEndPath();
      this.dragActionEventHandler(evtOpt.commandIndex, evtOpt.pointIndex);
    });
  }

  /**
   * calculate the drawing commands for the connector tips
   */
  calcStartEndPath() {
    this.pathStart = [];
    this.pathEnd = [];

    const { pathType, pathArrowTip } = this;
    const firstCommand = this.path[0];
    const lastCommand = this.path[this.path.length - 1];

    const fromPoint = new Point(firstCommand[1]!, firstCommand[2]!);
    const toPoint =
      lastCommand[0] === 'L'
        ? new Point(lastCommand[1]!, lastCommand[2]!)
        : new Point(lastCommand[5]!, lastCommand[6]!);

    /* Calculate Path START */
    if (pathArrowTip === 'start' || pathArrowTip === 'both') {
      const startArrowSize = 10; // Adjust the size of the start arrow tip

      const startAngle =
        pathType === 'straightPath'
          ? Math.atan2(fromPoint.y - toPoint.y, fromPoint.x - toPoint.x) +
            Math.PI
          : Math.atan2(
              lastCommand[2]! - fromPoint.y,
              lastCommand[1]! - fromPoint.x
            );

      const startArrow1X =
        fromPoint.x + startArrowSize * Math.cos(startAngle + Math.PI / 6);
      const startArrow1Y =
        fromPoint.y + startArrowSize * Math.sin(startAngle + Math.PI / 6);
      const startArrow2X =
        fromPoint.x + startArrowSize * Math.cos(startAngle - Math.PI / 6);
      const startArrow2Y =
        fromPoint.y + startArrowSize * Math.sin(startAngle - Math.PI / 6);

      this.pathStart = [
        ['M', startArrow1X, startArrow1Y],
        ['L', fromPoint.x, fromPoint.y],
        ['L', startArrow2X, startArrow2Y],
      ];
    }
    /* Calculate Path End */
    if (pathArrowTip === 'end' || pathArrowTip === 'both') {
      const endArrowSize = 10; // Adjust the size of the end arrow tip
      const endAngle =
        pathType === 'straightPath'
          ? Math.atan2(toPoint.y - fromPoint.y, toPoint.x - fromPoint.x)
          : Math.atan2(
              toPoint.y - lastCommand[4]!,
              toPoint.x - lastCommand[3]!
            );

      const endArrow1X =
        toPoint.x - endArrowSize * Math.cos(endAngle - Math.PI / 6);
      const endArrow1Y =
        toPoint.y - endArrowSize * Math.sin(endAngle - Math.PI / 6);
      const endArrow2X =
        toPoint.x - endArrowSize * Math.cos(endAngle + Math.PI / 6);
      const endArrow2Y =
        toPoint.y - endArrowSize * Math.sin(endAngle + Math.PI / 6);

      this.pathEnd = [
        ['M', endArrow1X, endArrow1Y],
        ['L', toPoint.x, toPoint.y],
        ['L', endArrow2X, endArrow2Y],
      ];
    }
  }

  /**
   * Given the points in scene coordinates, updates the path
   * This function is called by other objects that are moving or changing properties
   */
  update({ fromPoint, toPoint, control1, control2, style }: any = {}) {
    if (!fromPoint) {
      fromPoint = TransformPointFromObjectToCanvas(
        this,
        new Point(this.path[0][1]!, this.path[0][2]!)
      );
    }

    const finalCommand = this.path[this.path.length - 1];

    if (!toPoint) {
      toPoint = TransformPointFromObjectToCanvas(
        this,
        finalCommand[0] === 'L'
          ? new Point(finalCommand[1]!, finalCommand[2]!)
          : new Point(finalCommand[5]!, finalCommand[6]!)
      );
    }

    if (!control1) {
      control1 = TransformPointFromObjectToCanvas(
        this,
        new Point(finalCommand[3]!, finalCommand[4]!)
      );
    }

    if (!control2) {
      control2 = TransformPointFromObjectToCanvas(
        this,
        new Point(finalCommand[5]!, finalCommand[6]!)
      );
    }

    if (style) {
      this.style = style;
    }

    const path = getPath(fromPoint, toPoint, control1, control2, this.pathType);
    this.path = makePathSimpler(parsePath(path));
    this.calcStartEndPath();
    this.dirty = true;

    this.canvas?.requestRenderAll();
  }

  _mouseDownControl(
    eventData: any,
    transform: Transform,
    x: number,
    y: number
  ) {
    const target = transform.target;
    target.objectCaching = false;
    transform.target.canvas?.initializeConnectorMode();
  }

  /**
   * Compared to Path, it will render the official Path + the arrow tips.
   * @param ctx
   */
  _renderPathCommands(ctx: CanvasRenderingContext2D) {
    const path = this.path;
    this.path = [...this.pathStart, ...this.path, ...this.pathEnd];
    super._renderPathCommands(ctx);
    this.path = path;
  }

  _mouseUpControl(eventData: any, transform: Transform, x: number, y: number) {
    const { target } = transform;
    if (!target.canvas) {
      return;
    }
    target.canvas?.exitConnectorMode();
    target.canvas.dockingWidget = null;
    target.dirty = true;
    target.setCoords();
    transform.target.canvas?.requestRenderAll();
  }

  getControlPointOnCanvas(obj: any, controlName: string) {
    const controlInfo = obj.controls[controlName];
    const x = controlInfo.x * obj.width;
    const y = controlInfo.y * obj.height;
    const point = new Point(x, y);

    const transformedPoint = obj.transformPointToCanvas(point);

    return transformedPoint;
  }

  /**
   * Responds to the path points being moved calculating the docking.
   * @param commandIndex The command index in the path we are dragging
   * @param pointIndex  the index of the X coordinate of the point we are moving in .path[commandIndex]
   * @returns
   */
  dragActionEventHandler(commandIndex: number, pointIndex: number) {
    const target = this;
    // const relevantPoint = getLocalPoint(transform, 'center', 'top', x, y);
    //@ts-ignore
    const currentDockingObject = target.canvas?.dockingWidget;

    // Andrea, followup: currentDockingObject.hoveringControl relies on a mousemove event that gets added
    // and removed when we start the connector drag.
    // this logic should be resolved inside the connector.

    if (
      currentDockingObject &&
      currentDockingObject.controls[currentDockingObject.hoveringControl] &&
      currentDockingObject.calculateControlPoint
    ) {
      const hoverPoint = this.getControlPointOnCanvas(
        currentDockingObject,
        currentDockingObject.hoveringControl
      );

      const targetX = hoverPoint.x;
      const targetY = hoverPoint.y;
      const controlPoint = currentDockingObject.calculateControlPoint(
        currentDockingObject.getBoundingRect(),
        new Point(targetX, targetY)
      );
      const relevantControlPoint = target
        .transformPointFromCanvas(controlPoint)
        .add(this.pathOffset);

      switch (commandIndex) {
        // command 0 means start of the path
        case 0:
          target.set({ control1: relevantControlPoint });

          if (target.fromId) {
            const fromObject = target.canvas?.findById(target.fromId);
            if (fromObject) {
              fromObject.connectors = fromObject.connectors?.filter(
                (connector: any) => connector.connectorId !== target.id
              );
            }
          }
          // register docking of this object
          target.fromId = currentDockingObject.id;

          break;
        case this.path.length - 1:
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
          // register docking of this object
          target.toId = currentDockingObject.id;

          break;
      }

      if (!currentDockingObject.connectors) {
        currentDockingObject.connectors = [];
      }

      currentDockingObject.connectors.push({
        connectorId: target.id,
        point: {
          x: targetX - currentDockingObject.left,
          y: targetY - currentDockingObject.top,
        },
      });
    }
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
}

export { XConnector };

// todo: why TransformPointFromObjectToCanvas and TransformPointFromObjectToCanvas2 is different? why it works for one doesn't work for another?
export const TransformPointFromObjectToCanvas = (
  object: XConnector,
  point: Point
) =>
  sendPointToPlane(
    point.subtract(object.pathOffset),
    object.calcOwnMatrix(),
    iMatrix
  );

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
