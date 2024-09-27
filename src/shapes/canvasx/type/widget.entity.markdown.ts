import   { WidgetBaseInterface, TOriginX, TOriginY } from './widget.entity.base';
import { WidgetType } from './widget.type';

export   interface WidgetMarkdownInterface extends WidgetBaseInterface {
  markdownText: string;
}

export class WidgetMarkdownClass implements WidgetBaseInterface {
  updatedBy: string = "";
  updatedByName: string = "";
   createdByName: string="";
  id: string = '';
  boardId: string = '';
  backgroundColor: string = '#FFFFFF';
  width: number = 100;
  height: number = 100;
  left: number = 0;
  locked: boolean = false;
  objType: WidgetType = "XMarkdown";
  originX: TOriginX = 'center';
  originY: TOriginY = 'center';
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


export const EntityKeys = Object.keys(new WidgetMarkdownClass()) as (keyof WidgetMarkdownInterface)[];