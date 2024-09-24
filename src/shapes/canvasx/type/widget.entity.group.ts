import  {WidgetBaseInterface, TOriginX, TOriginY } from './widget.entity.base';
import { WidgetType } from './widget.type';

export   interface WidgetGroupInterface extends WidgetBaseInterface {
  objectArr: any[];
}

export class WidgetGroupClass implements WidgetGroupInterface {
  lastEditedByName: string="";
  createdByName: string="";
  objectArr: any[] = [];
  id: string = '';
  boardId: string = '';
  backgroundColor: string = '';
  width: number = 0;
  height: number = 0;
  left: number = 0;
  locked: boolean = false;
  objType: WidgetType = "XGroup"; // Assuming WidgetType.Default is a valid enum value
  originX: TOriginX = 'center'; // Assuming 'left' is a valid TOriginX value
  originY: TOriginY = 'center'; // Assuming 'top' is a valid TOriginY value
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

export const EntityKeys = Object.keys(new WidgetGroupClass()) as (keyof WidgetGroupInterface)[];
