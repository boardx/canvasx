import { WidgetBaseInterface, TOriginX, TOriginY } from './widget.entity.base';
import { WidgetType } from './widget.type';

export interface WidgetPathInterface extends WidgetBaseInterface {
  path: any[];
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

export class WidgetPathClass implements WidgetPathInterface {
  updatedBy: string = "";
  updatedByName: string = "";
  fill: string = 'transparent';
 
  createdByName: string = "";
  path: any[] = [''];
  stroke: string = '#000000';
  strokeWidth: number = 1;
  strokeLineCap: string = 'butt';
  strokeDashOffset: number = 0;
  strokeLineJoin: string = 'miter';
  strokeUniform: boolean = false;
  strokeMiterLimit: number = 10;
  fillRule: string = 'nonzero';
  id: string = '';
  boardId: string = '';
  backgroundColor: string = 'transparent';
  width: number = 0;
  height: number = 0;
  left: number = 0;
  locked: boolean = false;
  objType: WidgetType = "XPath";
  originX: TOriginX = 'center';
  originY: TOriginY = 'center';
  scaleX: number = 1;
  scaleY: number = 1;
  selectable: boolean = true;
  top: number = 0;
  zIndex: number = Date.now() * 100;
  version: string = '1.0';
  updatedAt: number = Date.now();
  createdAt: number = Date.now();
  createdBy: string = '';
  visible: boolean = true;
}

export const EntityKeys = Object.keys(new WidgetPathClass()) as string[];