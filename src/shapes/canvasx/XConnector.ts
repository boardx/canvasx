import { Path } from '../Path';
import { sendPointToPlane, TSimpleParsedCommand } from '../../util';
import { Point, XY } from '../../Point';
import { classRegistry } from '../../ClassRegistry';
import { iMatrix } from '../../constants';
import { createPathControls } from '../../controls/pathControl';
import { XCanvas } from '../../canvas/canvasx/bx-canvas';
import { Transform } from '../../EventTypeDefs';

import { EntityKeys, WidgetConnectorInterface } from './type/widget.entity.connector';
import { WidgetType } from './type/widget.type';

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

class XConnector extends Path implements WidgetConnectorInterface {
  static type: WidgetType = 'XConnector';
  static objType: WidgetType = 'XConnector';
  style: any;
  declare fromObjectId: string;
  declare toObjectId: string;
  declare pathType: 'curvePath' | 'straightPath';
  declare pathArrowTip: 'none' | 'start' | 'end' | 'both';
  declare fromPoint: XY;
  declare toPoint: XY;
  declare control1: XY;
  declare control2: XY;

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
    options: any = {}
  ) {
    const path = getPath(fromPoint, toPoint, control1, control2, options.pathType);




    super(path, options);
    // Object.assign(this, options);

    //default values
    this.perPixelTargetFind = true;
    this.cornerColor = 'white';
    this.cornerStyle = 'circle';
    this.type = 'XConnector';
    this.objType = 'XConnector';
    this.transparentCorners = false;
    this.cornerStrokeColor = 'gray';
    this.hasBorders = false;
    this.objectCaching = false;


    this.pathType = options.pathType || 'curvePath';
    this.pathArrowTip = options.pathArrowTip || 'both';
    this.fromObjectId = options.fromObjectId;
    this.toObjectId = options.toObjectId;
    this.fromPoint = fromPoint;
    this.toPoint = toPoint;
    this.control1 = control1;
    this.control2 = control2;
    this.createdByName = options.createdByName;
    this.createdBy = options.createdBy;
    this.createdAt = options.createdAt;
    this.boardId = options.boardId;
    this.style = options.style;
    this.fill = options.fill || 'transparent';
    this.stroke = options.stroke || '#000000';
    this.createdAt = options.createdAt;
    this.updatedBy = options.updatedBy;
    this.updatedByName = options.updatedByName;
    this.version = options.version;
    this.zIndex = options.zIndex;

    // Object.assign(this, options);
    this._setMovementLock();
    this.calcStartEndPath();
    this.controls = {
      ...createPathControls(this, {
        mouseDownHandler: this._mouseDownControl.bind(this),
        mouseUpHandler: this._mouseUpControl.bind(this),
        cursorStyle: 'crosshair',
        pointStyle: {
          controlFill: 'white',
          controlStroke: 'gray',
        },
        controlPointStyle: {
          controlFill: 'white',
          connectionDashArray: [5, 5],
          controlStroke: 'gray',
        },
      }),
    };
    this.on('modifyPath', function (this: XConnector, evtOpt) {
      this.calcStartEndPath();
      const { commandIndex, pointIndex } = evtOpt;
      // commandIndex === 0 is always start,
      // all the commandIndex === 1 are control points apart the 5
      if (commandIndex === 1 && pointIndex !== 5) {
        return;
      }
      this.dragActionEventHandler(evtOpt.commandIndex, evtOpt.pointIndex);
    });
  }
  updatedBy: string;
  updatedByName: string;

  createdByName: string;
  boardId: string;
  objType: WidgetType;
  userId: string;
  zIndex: number;
  version: string;
  updatedAt: number;

  createdAt: number;
  createdBy: string;

  getFromPoint() {
    const command = this.path[0];
    return new Point(command[1]!, command[2]!);
  }
  getObject() {
    const entityKeys: string[] = EntityKeys;
    const result: Record<string, any> = {};

    entityKeys.forEach((key) => {
      if (key in this) {
        result[key] = (this as any)[key];
      }
    });

    return result;
  }


  getToPoint() {
    const lastCommand = this.path[this.path.length - 1];
    return lastCommand[0] === 'L'
      ? new Point(lastCommand[1]!, lastCommand[2]!)
      : new Point(lastCommand[5]!, lastCommand[6]!);
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
      const startArrowSize = 20 + this.strokeWidth; // Adjust the size of the start arrow tip

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
      const endArrowSize = 20 + this.strokeWidth; // Adjust the size of the end arrow tip
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

  calculateControlPoint(controlPointType: 'from' | 'to', point: any) {
    let controlPoint;
    if (controlPointType === 'from') {
      //@ts-ignore
      const fromObject = this.canvas?.findById(this.fromObjectId);
      if (fromObject && fromObject.calculateControlPoint) {
        controlPoint = fromObject.calculateControlPoint(point);
      }
    }

    if (controlPointType === 'to') {
      //@ts-ignore
      const toObject = this.canvas?.findById(this.toObjectId);
      if (toObject && toObject.calculateControlPoint) {
        controlPoint = toObject.calculateControlPoint(point);
      }
    }

    if (controlPoint) {
      return controlPoint;
    } else {
      return point;
    }
  }

  /**
   * Given the points in scene coordinates, updates the path
   * This function is called by other objects that are moving or changing properties
   */
  update({ fromPoint, toPoint, control1, control2, style }: any = {}) {
    const finalCommand = this.path[this.path.length - 1];

    if (!fromPoint) {
      fromPoint = TransformPointFromPathToCanvas(
        this,
        new Point(this.path[0][1]!, this.path[0][2]!)
      );
      this.fromPoint = fromPoint;
    }

    if (!toPoint) {
      toPoint = TransformPointFromPathToCanvas(
        this,
        finalCommand[0] === 'L'
          ? new Point(finalCommand[1]!, finalCommand[2]!)
          : new Point(finalCommand[5]!, finalCommand[6]!)
      );
      finalCommand[0] === 'L' ? 1 : 5;
      this.toPoint = toPoint;
    }
    let controlPoint1: Point, controlPoint2: Point;
    if (finalCommand[0] === 'L') {
      controlPoint1 = this.calculateControlPoint('from', fromPoint);
      controlPoint2 = this.calculateControlPoint('to', toPoint);
    }
    if (!control1) {
      control1 = TransformPointFromPathToCanvas(
        this,
        finalCommand[0] === 'L'
          ? controlPoint1!
          : new Point(finalCommand[1]!, finalCommand[2]!)
      );
      this.control1 = control1;
    }

    if (!control2) {
      control2 = TransformPointFromPathToCanvas(
        this,
        finalCommand[0] === 'L'
          ? controlPoint2!
          : new Point(finalCommand[3]!, finalCommand[4]!)
      );
      this.control2 = control2;
    }

    if (style) {
      this.style = style;
    }

    const path = getPath(fromPoint, toPoint, control1, control2, this.pathType);

    const { path: newPath } = new Path(path);
    this.path = newPath;
    this.setBoundingBox(true);

    this.calcStartEndPath();
    this.dirty = true;
  }

  _mouseDownControl(
    eventData: any,
    transform: Transform,
    x: number,
    y: number
  ) {
    const target = transform.target;
    target.objectCaching = false;

    this.mouseDownHandler(eventData, transform, x, y);
  }

  mouseDownHandler(eventData: any, transform: Transform, x: number, y: number) {
    //reserve for subclass
  }

  mouseUpHandler(eventData: any, transform: Transform, x: number, y: number) {
    //reserve for subclass
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
    (target.canvas as XCanvas).dockingWidget = null;
    target.dirty = true;
    target.setCoords();
    transform.target.canvas?.requestRenderAll();
    this.mouseUpHandler(eventData, transform, x, y);
    this._setMovementLock();
  }

  _setMovementLock() {
    if (this.fromObjectId || this.toObjectId) {
      this.lockMovementX = true;
      this.lockMovementY = true;
    } else {
      this.lockMovementX = false;
      this.lockMovementY = false;
    }
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

    const property = commandIndex === 0 ? 'fromObjectId' : 'toObjectId';
    const existingConnectionId = target[property];
    let connectedObject: any = null;
    if (existingConnectionId) {
      connectedObject = (target.canvas as XCanvas).findById(
        existingConnectionId
      ) as any;
    }

    // Andrea, followup: currentDockingObject.hoveringControl relies on a mousemove event that gets added
    // and removed when we start the connector drag.
    // this logic should be resolved inside the connector.
    const connectorType = commandIndex === 0 ? 'from' : 'to';
    if (
      currentDockingObject &&
      currentDockingObject.controls[
      currentDockingObject.canvas.hoveringControl
      ] &&
      currentDockingObject.calculateControlPoint
    ) {
      const hoverPoint = this.getControlPointOnCanvas(
        currentDockingObject,
        currentDockingObject.canvas.hoveringControl
      );

      const targetX = hoverPoint.x;
      const targetY = hoverPoint.y;

      if (existingConnectionId) {
        if (connectedObject) {
          connectedObject.connectors = connectedObject.connectors?.filter(
            (connector: any) =>
              !(
                connector.connectorId === target.id &&
                connector.connectorType === connectorType
              )
          );
          if (connectedObject.calculateControlPoint) {
            const controlPoint =
              connectedObject.calculateControlPoint(hoverPoint);
            if (commandIndex === 0) {
              this.update({
                fromPoint: { x: targetX, y: targetY },
                control1: controlPoint,
              });
            } else {
              this.update({
                toPoint: { x: targetX, y: targetY },
                control2: controlPoint,
              });
            }
          }
        }
      }

      target[commandIndex === 0 ? 'fromObjectId' : 'toObjectId'] =
        currentDockingObject.id;

      if (!currentDockingObject.connectors) {
        currentDockingObject.connectors = [];
      }

      currentDockingObject.connectors.push({
        connectorId: target.id,
        connectorType: connectorType,
        point: currentDockingObject.transformPointFromCanvas({
          x: targetX,
          y: targetY,
        }),
      });
    }

    if (!currentDockingObject && connectedObject) {
      //if it is not attached to object, remove the connector from the existing connected object and clear the from/to object id
      target[property] = '';
      connectedObject.connectors = connectedObject.connectors?.filter(
        (connector: any) =>
          !(
            connector.connectorId === target.id &&
            connector.connectorType === connectorType
          )
      );
    }
  }
}

export { XConnector };

export const TransformPointFromPathToCanvas = (
  object: XConnector,
  point: Point
) =>
  sendPointToPlane(
    point.subtract(object.pathOffset),
    object.calcOwnMatrix(),
    iMatrix
  );

classRegistry.setClass(XConnector);
