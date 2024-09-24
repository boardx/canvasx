import   { WidgetBaseInterface,TOriginX, TOriginY } from './widget.entity.base';
import {  WidgetType } from './widget.type';
 
export type pathType = 'curvePath' | 'straightPath';
export type pathArrowTip = 'none' | 'start' | 'end' | 'both';
export type xy = { x: number; y: number };

export   interface WidgetConnectorInterface extends WidgetBaseInterface {
  
  fromObjectId: string;
  toObjectId: string;
  pathType: pathType;
  pathArrowTip: pathArrowTip;
  fromPoint: xy;
  toPoint: xy;
  control1: xy;
  control2: xy;
  style: any;
}

export class WidgetConnectorClass implements WidgetConnectorInterface {
  lastEditedByName: string="";
  createdByName: string="";
  fromObjectId: string = '';
  toObjectId: string = '';
  pathType: pathType = 'straightPath';
  pathArrowTip: pathArrowTip = 'none';
  fromPoint: xy = { x: 0, y: 0 };
  toPoint: xy = { x: 0, y: 0 };
  control1: xy = { x: 0, y: 0 };
  control2: xy = { x: 0, y: 0 };
  style: any = {};
  id: string = '';
  boardId: string = '';
  backgroundColor: string = '';
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
  zIndex: number = 0;
  version: string = '';
  updatedAt: number = Date.now();
  lastEditedBy: string = '';
  createdAt: number = Date.now();
  createdBy: string = '';
  visible: boolean = true;
}

export const EntityKeys = Object.keys(new WidgetConnectorClass()) as (keyof WidgetConnectorInterface)[];
