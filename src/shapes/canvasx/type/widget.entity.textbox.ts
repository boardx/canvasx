import { WidgetBaseInterface, TOriginX, TOriginY } from './widget.entity.base';
import type { TFiller } from '../../../typedefs';
import { xy } from './widget.entity.connector';
import { WidgetType } from './widget.type';

export type Connector = {
  connectorId: string;
  connectorType: string;
  point: xy;
}



export interface WidgetTextboxInterface extends WidgetBaseInterface {
  fontFamily: string;
  fill: string | TFiller | null;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  text: string;
  textAlign: string;
  editable: boolean;
  fixedScaleChange: boolean;
  connectors: Connector[]; // You can replace 'any' with the appropriate type for connectors
}

export class WidgetTextboxClass implements WidgetTextboxInterface {
  updatedBy: string = "";
  updatedByName: string = "";
  fill: string = '#eeeeee';
  createdByName: string = "";
  fontFamily: string = 'Inter';
  fontSize: number = 16;
  fontWeight: string = '400';
  lineHeight: number = 1.2;
  text: string = '';
  textAlign: string = 'left';
  editable: boolean = true;
  maxHeight: number = 100;
  fixedScaleChange: boolean = false;
  connectors: Connector[] = [];
  id: string = '';
  boardId: string = '';
  backgroundColor: string = '#FFFFFF';
  width: number = 100;
  height: number = 50;
  left: number = 0;
  locked: boolean = false;
  objType: WidgetType = "XTextbox";
  originX: TOriginX = 'center';
  originY: TOriginY = 'center';
  scaleX: number = 1;
  scaleY: number = 1;
  selectable: boolean = true;
  top: number = 0;
  zIndex: number = 0;
  version: string = '1.0';
  updatedAt: number = Date.now();

  createdAt: number = Date.now();
  createdBy: string = '';
  visible: boolean = true;
}

export const EntityKeys = Object.keys(new WidgetTextboxClass()) as (keyof WidgetTextboxInterface)[];