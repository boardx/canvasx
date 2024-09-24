import { TOriginX, TOriginY } from './widget.entity.base';
import { WidgetTextboxInterface, Connector } from './widget.entity.textbox';
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
  shapeName: shapeType = 'rect';
  fontFamily: string = 'Arial';
  fontSize: number = 14;
  fontWeight: string = 'normal';
  lineHeight: number = 1.5;
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
  height: number = 100;
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
  zIndex: number = 0;
  version: string = '1.0';
  updatedAt: number = Date.now();
  lastEditedBy: string = '';
  createdAt: number = Date.now();
  createdBy: string = '';
  visible: boolean = true;
}

export const EntityKeys = Object.keys(new WidgetShapeNotesClass()) as string[]; 
