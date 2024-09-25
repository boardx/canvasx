import { WidgetBaseInterface, TOriginX, TOriginY } from './widget.entity.base';
import { WidgetType } from './widget.type';

export type pathType = 'curvePath' | 'straightPath';
export type pathArrowTip = 'none' | 'start' | 'end' | 'both';
export type xy = { x: number; y: number };

export interface WidgetConnectorInterface extends WidgetBaseInterface {
  path: any[];
  fromObjectId: string;
  toObjectId: string;
  pathType: pathType;
  pathArrowTip: pathArrowTip;
  fromPoint: xy;
  toPoint: xy;
  control1: xy;
  control2: xy;
  style: any;

  fill: string | null | any;
  stroke: string | null | any;
  strokeWidth: number;
  strokeLineCap: string;
  strokeDashOffset: number;
  strokeLineJoin: string;
  strokeUniform: boolean;
  strokeMiterLimit: number;
  fillRule: string;
}

export class WidgetConnectorClass implements WidgetConnectorInterface {
  updatedBy: string = "";
  updatedByName: string = "";
  path: any[] = [''];
  fill: any = 'transparent';
  stroke: any = '#000000';
  strokeWidth: number = 1;
  strokeLineCap: string = 'butt';
  strokeDashOffset: number = 0;
  strokeLineJoin: string = 'miter';
  strokeUniform: boolean = false;
  strokeMiterLimit: number = 10;
  fillRule: string = 'nonzero';
   createdByName: string = "";
  fromObjectId: string = '';
  toObjectId: string = '';
  pathType: pathType = "curvePath";
  pathArrowTip: pathArrowTip = 'none';
  fromPoint: xy = { x: 0, y: 0 };
  toPoint: xy = { x: 0, y: 0 };
  control1: xy = { x: 0, y: 0 };
  control2: xy = { x: 0, y: 0 };
  style: any = {};
  id: string = '';
  boardId: string = '';
  backgroundColor: string = 'transparent';
  width: number = 0;
  height: number = 0;
  left: number = 0;
  locked: boolean = false;
  objType: WidgetType = "XConnector"; // Replace with an actual default value
  originX: TOriginX = 'center'; // Replace with an actual default value
  originY: TOriginY = 'center'; // Replace with an actual default value
  scaleX: number = 1;
  scaleY: number = 1;
  selectable: boolean = true;
  top: number = 0;
  userId: string = '';
  zIndex: number = Date.now() * 100;
  version: string = '';
  updatedAt: number = Date.now();
   createdAt: number = Date.now();
  createdBy: string = '';
  visible: boolean = true;
}

export const EntityKeys = Object.keys(new WidgetConnectorClass()) as (keyof WidgetConnectorInterface)[];
