import { TOriginX, TOriginY } from './widget.entity.base';
import   { WidgetTextboxInterface,Connector } from './widget.entity.textbox';
import { WidgetType } from './widget.type';

export   interface WidgetShapeNotesInterface extends WidgetTextboxInterface {
  shapeName: shapeType;
}

export type shapeType =
  | 'rect'
  | 'diamond'
  | 'roundedRect'
  | 'circle'
  | 'hexagon'
  | 'triangle'
  | 'parallelogramIcon'
  | 'star'
  | 'cross'
  | 'leftsideRightTriangle'
  | 'rightsideRightTriangle'
  | 'topsideSemicircleCircle'
  | 'topLeftQuarterCircle'
  | 'constellationRect'
  | 'constellationRound';

export class WidgetShapeNotesClass implements WidgetShapeNotesInterface {
  updatedBy: string = "";
  updatedByName: string = "";
  createdByName: string="";
  shapeName: shapeType = 'rect';
  fontFamily: string = 'Inter';
  fontSize: number = 16;
  fontWeight: string = '400';
  lineHeight: number = 1.2;
  text: string = '';
  textAlign: string = 'center';
  editable: boolean = true;
  maxHeight: number = 100;
  fixedScaleChange: boolean = false;
  connectors: Connector[] = [];
  id: string = '';
  boardId: string = '';
  backgroundColor: string = '#eeeeee';
  width: number = 200;
  height: number = 200;
  left: number = 0;
  locked: boolean = false;
  objType: WidgetType = 'XShapeNotes';
  originX: TOriginX = 'center';
  originY: TOriginY = 'center';
  scaleX: number = 1;
  scaleY: number = 1;
  selectable: boolean = true;
  top: number = 0;
  userId: string = '';
  zIndex: number = Date.now() * 100;
  version: string = '1.0';
  updatedAt: number = Date.now();
  createdAt: number = Date.now();
  createdBy: string = '';
  visible: boolean = true;
}

export const EntityKeys = Object.keys(new WidgetShapeNotesClass()) as (keyof WidgetShapeNotesInterface)[];
