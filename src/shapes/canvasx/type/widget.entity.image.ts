import { FileObject } from './file';
import   {WidgetBaseInterface, TOriginX, TOriginY } from './widget.entity.base';
import { WidgetType } from './widget.type';

export   interface WidgetImageInterface extends WidgetBaseInterface {
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  previewImage: FileObject|null;
  imageSrc: FileObject|null;
}

export class WidgetImageClass implements WidgetImageInterface {
  updatedBy: string = "";
  updatedByName: string = "";
   createdByName: string="";
  markdownText: string = '';
  cropX: number = 0;
  cropY: number = 0;
  cropWidth: number = 0;
  cropHeight: number = 0;
  previewImage: FileObject |null =null;
  imageSrc: FileObject  |null =null;
  id: string = '';
  boardId: string = '';
  backgroundColor: string = 'transparent';
  width: number = 0;
  height: number = 0;
  left: number = 0;
  locked: boolean = false;
  objType: WidgetType = "XImage"; // Assuming WidgetType.Default is a valid enum value
  originX: TOriginX = 'center'; // Assuming 'left' is a valid TOriginX value
  originY: TOriginY = 'center'; // Assuming 'top' is a valid TOriginY value
  scaleX: number = 1;
  scaleY: number = 1;
  selectable: boolean = true;
  top: number = 0;
  userId: string = '';
  zIndex: number = Date.now() *100;
  version: string = '';
  updatedAt: number = Date.now();
   createdAt: number = Date.now();
  createdBy: string = '';
  visible: boolean = true;
}

export const EntityKeys = Object.keys(new WidgetImageClass()) as (keyof WidgetImageInterface)[];