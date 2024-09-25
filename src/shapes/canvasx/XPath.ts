import { config } from '../../config';
import { SHARED_ATTRIBUTES } from '../../parser/attributes';
import { Point, XY } from '../../Point';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints';
import { toFixed } from '../../util/misc/toFixed';
import {
  getBoundsOfCurve,
  joinPath,
  makePathSimpler,
  parsePath,
} from '../../util/path';
import { classRegistry } from '../../ClassRegistry';
import { FabricObject, cacheProperties } from '../Object/FabricObject';
import {
  TComplexPathData,
  TPathSegmentInfo,
  TSimplePathData,
} from '../../util/path/typedefs';
import type { FabricObjectProps, SerializedObjectProps } from '../Object/types';
import type { TOptions } from '../../typedefs';
import type { ObjectEvents } from '../../EventTypeDefs';
import { TBBox, TClassProperties, TSVGReviver } from '../../typedefs';
import { cloneDeep } from '../../util/internals/cloneDeep';
import { createPathDefaultControls } from '../../controls/commonControls';
import { WidgetPathInterface, EntityKeys } from './type/widget.entity.path';
import { WidgetType } from './type/widget.type';

interface UniquePathProps {
  sourcePath?: string;
  path?: TSimplePathData;
  objType: 'XPath';
}

export interface SerializedPathProps
  extends SerializedObjectProps,
  UniquePathProps { }

export interface PathProps extends FabricObjectProps {
  objType: 'XPath';
}

export interface IPathBBox extends TBBox {
  left: number;
  top: number;
  pathOffset: Point;
}

export class XPath<
  Props extends TOptions<PathProps> = Partial<PathProps>,
  SProps extends SerializedPathProps = SerializedPathProps,
  EventSpec extends ObjectEvents = ObjectEvents
> extends FabricObject<Props, SProps, EventSpec> implements WidgetPathInterface {
  /**
   * Array of path points
   * @type Array
   * @default
   */
  declare path: TSimplePathData;

  declare pathOffset: Point;

  declare sourcePath?: string;

  declare segmentsInfo?: TPathSegmentInfo[];

  static cacheProperties = [...cacheProperties, 'path', 'fillRule'];

  declare locked: boolean;

  declare boardId: string;

  declare userId: string;

  declare timestamp: Date;

  declare zIndex: number;

  declare lines: object[];

  declare relationship: object[];

  declare id: string;

  declare userNo: string;

  declare version: string;

  declare lineWidth: any;

  declare radius: any;

  static objType: WidgetType = 'XPath';
  static type: WidgetType = 'XPath';


  /**
   * Constructor
   * @param {TComplexPathData} path Path data (sequence of coordinates and corresponding "command" tokens)
   * @param {Partial<PathProps>} [options] Options object
   * @return {Path} thisArg
   */
  constructor(
    path: TComplexPathData | string,
    { path: _, left, top, ...options }: Partial<any> = {}
  ) {

    super(options as Props);
    this._setPath(path || [], true);
    typeof left === 'number' && this.set('left', left);
    typeof top === 'number' && this.set('top', top);

    Object.assign(this, options);
    this.objType = 'XPath';
  }
  updatedBy: string;
  updatedByName: string;
  lastEditedByName: string;
  createdByName: string;
  objType: WidgetType;
  updatedAt: number;
  lastEditedBy: string;
  createdAt: number;
  createdBy: string;

  static getDefaults() {
    return {
      ...super.getDefaults(),
      controls: createPathDefaultControls(),
    };
  }

  /**
   * @private
   * @param {TComplexPathData | string} path Path data (sequence of coordinates and corresponding "command" tokens)
   * @param {boolean} [adjustPosition] pass true to reposition the object according to the bounding box
   * @returns {Point} top left position of the bounding box, useful for complementary positioning
   */
  _setPath(path: TComplexPathData | string, adjustPosition?: boolean) {
    this.path = makePathSimpler(Array.isArray(path) ? path : parsePath(path));
    this.setBoundingBox(adjustPosition);
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates, by look at the polyline/polygon points.
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement(): Point {
    const bbox = this._calcBoundsFromPath();
    return new Point(bbox.left + bbox.width / 2, bbox.top + bbox.height / 2);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render path on
   */
  _renderPathCommands(ctx: CanvasRenderingContext2D) {
    let subpathStartX = 0,
      subpathStartY = 0,
      x = 0, // current x
      y = 0, // current y
      controlX = 0, // current control point x
      controlY = 0; // current control point y
    const l = -this.pathOffset.x,
      t = -this.pathOffset.y;

    ctx.beginPath();

    for (const command of this.path) {
      switch (
      command[0] // first letter
      ) {
        case 'L': // lineto, absolute
          x = command[1];
          y = command[2];
          ctx.lineTo(x + l, y + t);
          break;

        case 'M': // moveTo, absolute
          x = command[1];
          y = command[2];
          subpathStartX = x;
          subpathStartY = y;
          ctx.moveTo(x + l, y + t);
          break;

        case 'C': // bezierCurveTo, absolute
          x = command[5];
          y = command[6];
          controlX = command[3];
          controlY = command[4];
          ctx.bezierCurveTo(
            command[1] + l,
            command[2] + t,
            controlX + l,
            controlY + t,
            x + l,
            y + t
          );
          break;

        case 'Q': // quadraticCurveTo, absolute
          ctx.quadraticCurveTo(
            command[1] + l,
            command[2] + t,
            command[3] + l,
            command[4] + t
          );
          x = command[3];
          y = command[4];
          controlX = command[1];
          controlY = command[2];
          break;

        case 'Z':
          x = subpathStartX;
          y = subpathStartY;
          ctx.closePath();
          break;
      }
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render path on
   */
  _render(ctx: CanvasRenderingContext2D) {
    this._renderPathCommands(ctx);
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns string representation of an instance
   * @return {string} string representation of an instance
   */
  toString() {
    return `#<Path (${this.complexity()}): { "top": ${this.top}, "left": ${this.left
      } }>`;
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


  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject<
    T extends Omit<Props & TClassProperties<this>, keyof SProps>,
    K extends keyof T = never
  >(propertiesToInclude: K[] = []): Pick<T, K> & SProps {
    return {
      ...super.toObject([...propertiesToInclude]),
      path: cloneDeep(this.path),
    };
  }

  /**
   * Returns dataless object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toDatalessObject<
    T extends Omit<Props & TClassProperties<this>, keyof SProps>,
    K extends keyof T = never
  >(propertiesToInclude: K[] = []): Pick<T, K> & SProps {
    const o = this.toObject<T, K>(propertiesToInclude);
    if (this.sourcePath) {
      delete o.path;
      o.sourcePath = this.sourcePath;
    }
    return o;
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const path = joinPath(this.path, config.NUM_FRACTION_DIGITS);
    return [
      '<path ',
      'COMMON_PARTS',
      `d="${path}" stroke-linecap="round" />\n`,
    ];
  }

  /**
   * @private
   * @return the path command's translate transform attribute
   */
  _getOffsetTransform() {
    const digits = config.NUM_FRACTION_DIGITS;
    return ` translate(${toFixed(-this.pathOffset.x, digits)}, ${toFixed(
      -this.pathOffset.y,
      digits
    )})`;
  }

  /**
   * Returns svg clipPath representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {string} svg representation of an instance
   */
  toClipPathSVG(reviver: TSVGReviver): any {
    const additionalTransform = this._getOffsetTransform();
    return (
      '\t' +
      this._createBaseClipPathSVGMarkup(this._toSVG(), {
        reviver: reviver,
        additionalTransform: additionalTransform,
      })
    );
  }

  /**
   * Returns svg representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {string} svg representation of an instance
   */
  toSVG(reviver: TSVGReviver): any {
    const additionalTransform = this._getOffsetTransform();
    return this._createBaseSVGMarkup(this._toSVG(), {
      reviver: reviver,
      additionalTransform: additionalTransform,
    });
  }

  /**
   * Returns number representation of an instance complexity
   * @return {number} complexity of this instance
   */
  complexity() {
    return this.path.length;
  }

  setDimensions() {
    this.setBoundingBox();
  }

  setBoundingBox(adjustPosition?: boolean) {
    const { width, height, pathOffset } = this._calcDimensions();
    this.set({ width, height, pathOffset });
    // using pathOffset because it match the use case.
    // if pathOffset change here we need to use left + width/2 , top + height/2
    adjustPosition && this.setPositionByOrigin(pathOffset, 'center', 'center');
  }

  _calcBoundsFromPath(): TBBox {
    const bounds: XY[] = [];
    let subpathStartX = 0,
      subpathStartY = 0,
      x = 0, // current x
      y = 0; // current y

    for (const command of this.path) {
      // current instruction
      switch (
      command[0] // first letter
      ) {
        case 'L': // lineto, absolute
          x = command[1];
          y = command[2];
          bounds.push(new Point(subpathStartX, subpathStartY), new Point(x, y));
          break;

        case 'M': // moveTo, absolute
          x = command[1];
          y = command[2];
          subpathStartX = x;
          subpathStartY = y;
          break;

        case 'C': // bezierCurveTo, absolute
          bounds.push(
            ...getBoundsOfCurve(
              x,
              y,
              command[1],
              command[2],
              command[3],
              command[4],
              command[5],
              command[6]
            )
          );
          x = command[5];
          y = command[6];
          break;

        case 'Q': // quadraticCurveTo, absolute
          bounds.push(
            ...getBoundsOfCurve(
              x,
              y,
              command[1],
              command[2],
              command[1],
              command[2],
              command[3],
              command[4]
            )
          );
          x = command[3];
          y = command[4];
          break;

        case 'Z':
          x = subpathStartX;
          y = subpathStartY;
          break;
      }
    }
    return makeBoundingBoxFromPoints(bounds);
  }

  /**
   * @private
   */
  _calcDimensions(): IPathBBox {
    const bbox = this._calcBoundsFromPath();

    return {
      ...bbox,
      pathOffset: new Point(
        bbox.left + bbox.width / 2,
        bbox.top + bbox.height / 2
      ),
    };
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by `Path.fromElement`)
   * @static
   * @memberOf Path
   * @see http://www.w3.org/TR/SVG/paths.html#PathElement
   */
  static ATTRIBUTE_NAMES = [...SHARED_ATTRIBUTES, 'd'];

  /**
   * Creates an instance of Path from an object
   * @static
   * @memberOf Path
   * @param {Object} object
   * @returns {Promise<Path>}
   */
  static fromObject<T extends TOptions<SerializedPathProps>>(object: T) {
    return this._fromObject<XPath>(object, {
      extraParam: 'path',
    });
  }
}

classRegistry.setClass(XPath);
classRegistry.setSVGClass(XPath);

/* _FROM_SVG_START_ */
