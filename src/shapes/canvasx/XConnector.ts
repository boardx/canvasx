import { Path, PathProps, SerializedPathProps } from '../Path';
import { sendPointToPlane, TSimpleParsedCommand } from '../../util';
import { Point, XY } from '../../Point';
import { ObjectEvents, Transform } from '../../EventTypeDefs';
import { classRegistry } from '../../ClassRegistry';
import { iMatrix } from '../../constants';
import { createPathControls } from '../../controls/pathControl';
import { XCanvas } from '../../canvas/canvasx/bx-canvas';
import { TClassProperties } from '../../typedefs';

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

interface UniqueXConnectorProps {
  fromObjectId?: string;
  toObjectId?: string;
  pathType: 'curvePath' | 'straightPath';
  pathArrowTip: 'none' | 'start' | 'end' | 'both';
}

interface UniqueXConnectorSerializedProps {
  fromPoint: XY;
  toPoint: XY;
  control1: XY;
  control2: XY;
  style: any;
}

export interface XConnectorProps extends PathProps, UniqueXConnectorProps {}

export interface XConnectorSerializedProps
  extends SerializedPathProps,
    UniqueXConnectorSerializedProps {}

class XConnector<
  Props extends Partial<XConnectorProps> = Partial<XConnectorProps>,
  SProps extends XConnectorSerializedProps = XConnectorSerializedProps,
  EventSpec extends ObjectEvents = ObjectEvents
> extends Path<Props, SProps, EventSpec> {
  static type = 'XConnector';
  declare objType: string;
  declare style: any;

  /**
   * References the ID of the object where the connector starts
   */
  declare fromObjectId: string;

  /**
   * References the ID of the object where the connector ends
   */
  declare toObjectId: string;

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

  public extendedProperties = [
    'objType',
    'boardId',
    'userId',
    'timestamp',
    'zIndex',
    'locked',
    'id',
    'zIndex',
    'fromObjectId',
    'toObjectId',
    'style',
    'pathType',
    'pathArrowTip',
    'left',
    'top',
    'width',
    'height',
  ] as const as (keyof SProps)[];

  constructor(
    fromPoint: XY,
    toPoint: XY,
    control1: XY,
    control2: XY,
    style: any = {},
    options: Omit<Props, keyof UniqueXConnectorSerializedProps>
  ) {
    const path = getPath(fromPoint, toPoint, control1, control2);
    super(path);
    this.cornerColor = 'white';
    this.cornerStyle = 'circle';
    this.transparentCorners = false;
    this.cornerStrokeColor = 'gray';
    this.setOptions(options);
    // this shouldn't work
    this.type = 'XConnector';
    this.objType = 'XConnector';
    this.objectCaching = false;
    this.pathType = options.pathType || 'curvePath';
    this.pathArrowTip = options.pathArrowTip || 'both';
    this.style = style;
    this.calcStartEndPath();
    this.controls = {
      ...createPathControls(this as Path, {
        mouseDownHandler: this._mouseDownControl.bind(this),
        mouseUpHandler: this._mouseUpControl.bind(this),
        cursorStyle: 'crosshair',
        controlPointStyle: {
          controlFill: 'blue',
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
    const finalCommand = this.path[this.path.length - 1];

    if (!control1) {
      control1 = TransformPointFromPathToCanvas(
        this,
        new Point(finalCommand[1]!, finalCommand[2]!)
      );
    }

    if (!control2) {
      control2 = TransformPointFromPathToCanvas(
        this,
        new Point(finalCommand[3]!, finalCommand[4]!)
      );
    }

    if (!fromPoint) {
      fromPoint = TransformPointFromPathToCanvas(
        this,
        new Point(this.path[0][1]!, this.path[0][2]!)
      );
    }

    if (!toPoint) {
      toPoint = TransformPointFromPathToCanvas(
        this,
        finalCommand[0] === 'L'
          ? new Point(finalCommand[1]!, finalCommand[2]!)
          : new Point(finalCommand[5]!, finalCommand[6]!)
      );
      finalCommand[0] === 'L' ? 1 : 5;
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
    (transform.target.canvas as XCanvas).initializeConnectorMode();
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
    (target.canvas as XCanvas).exitConnectorMode();
    (target.canvas as XCanvas).dockingWidget = null;
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

      const property = commandIndex === 0 ? 'fromObjectId' : 'toObjectId';
      const existingConnectionId = target[property];

      if (existingConnectionId) {
        const connectedObject = (target.canvas as XCanvas).findById(
          existingConnectionId
        ) as any;
        if (connectedObject) {
          connectedObject.connectors = connectedObject.connectors?.filter(
            (connector: any) => connector.connectorId !== target.id
          );
        }
      }

      target[commandIndex === 0 ? 'fromObjectId' : 'toObjectId'] =
        currentDockingObject.id;

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

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject<
    T extends Omit<Props & TClassProperties<this>, keyof SProps>,
    K extends keyof T = never
  >(this: XConnector, propertiesToInclude: K[] = []): Pick<T, K> & SProps {
    return {
      ...super.toObject<T, K>([
        ...propertiesToInclude,
        ...(this.extendedProperties as K[]),
      ]),
      fromPoint: TransformPointFromPathToCanvas(
        this,
        new Point(this.path[0][1]!, this.path[0][2]!)
      ),
      control1: TransformPointFromPathToCanvas(
        this,
        new Point(this.path[1][1]!, this.path[1][2]!)
      ),
      control2: TransformPointFromPathToCanvas(
        this,
        new Point(this.path[1][3]!, this.path[1][4]!)
      ),
      toPoint: TransformPointFromPathToCanvas(
        this,
        new Point(this.path[1][5]!, this.path[1][6]!)
      ),
    };
  }
}

export { XConnector };

export const TransformPointFromPathToCanvas = (
  object: XConnector<any, any>,
  point: Point
) =>
  sendPointToPlane(
    point.subtract(object.pathOffset),
    object.calcOwnMatrix(),
    iMatrix
  );

classRegistry.setClass(XConnector);

const b = new XConnector(
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  {},
  {
    toObjectId: 'x',
    toPoint: new Point(),
  }
);
