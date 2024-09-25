import   {WidgetBaseInterface, TOriginX, TOriginY } from './widget.entity.base';
import { WidgetType } from './widget.type';

export   interface WidgetFrameInterface extends WidgetBaseInterface {
  titleText: string;
}

export class WidgetFrameClass implements WidgetFrameInterface {
  updatedBy: string = "";
  updatedByName: string = "";
   createdByName: string="";
  titleText: string = '';
  id: string = '';
  boardId: string = '';
  backgroundColor: string = 'white';
  width: number = 500;
  height: number = 500;
  left: number = 0;
  locked: boolean = false;
  objType: WidgetType = "XFrame"; // Assuming WidgetType.Default is a valid enum value
  originX: TOriginX = 'center'; // Assuming 'left' is a valid TOriginX value
  originY: TOriginY = 'center'; // Assuming 'top' is a valid TOriginY value
  scaleX: number = 1;
  scaleY: number = 1;
  selectable: boolean = true;
  top: number = 0;
  zIndex: number = Date.now() *100;
  version: string = '1.0';
  updatedAt: number = Date.now();
   createdAt: number = Date.now();
  createdBy: string = '';
  visible: boolean = true;
}

export const EntityKeys = Object.keys(new WidgetFrameClass()) as (keyof WidgetFrameInterface)[];
