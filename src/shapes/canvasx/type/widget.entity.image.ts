import { FileObject } from './file';
import   {WidgetBaseInterface, TOriginX, TOriginY } from './widget.entity.base';
import { WidgetType } from './widget.type';

export   interface WidgetImageInterface extends WidgetBaseInterface {
  markdownText: string;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  previewImage: FileObject;
  imageSrc: FileObject;
}

export class WidgetImageClass implements WidgetImageInterface {
  markdownText: string = '';
  cropX: number = 0;
  cropY: number = 0;
  cropWidth: number = 0;
  cropHeight: number = 0;
  previewImage: FileObject = { id: '',   path:'', tmpPath:'' };
  imageSrc: FileObject = { id: '',   path:'', tmpPath:'' };
  id: string = '';
  boardId: string = '';
  backgroundColor: string = '';
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
  zIndex: number = 0;
  version: string = '';
  updatedAt: number = Date.now();
  lastEditedBy: string = '';
  createdAt: number = Date.now();
  createdBy: string = '';
  visible: boolean = true;
}

export const EntityKeys = Object.keys(new WidgetImageClass()) as (keyof WidgetImageInterface)[];