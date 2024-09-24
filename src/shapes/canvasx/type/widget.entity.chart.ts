import {  WidgetBaseInterface,TOriginX, TOriginY } from './widget.entity.base';
import { WidgetType } from './widget.type';

export   interface WidgetChartInterface extends WidgetBaseInterface {
  chartOptions: any;
  
}

class WidgetChartClass implements WidgetChartInterface {
  lastEditedByName: string="";
  createdByName: string="";
  id: string = '';
  boardId: string = '';
  backgroundColor: string = '';
  width: number = 0;
  height: number = 0;
  left: number = 0;
  locked: boolean = false;
  objType: WidgetType = "XChart"; // Replace with an appropriate default value
  originX: TOriginX = 'center'; // Replace with an appropriate default value
  originY: TOriginY = 'center'; // Replace with an appropriate default value
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
  chartOptions: any = {};
}

export const EntityKeys = Object.keys(new WidgetChartClass()) as (keyof WidgetChartInterface)[];