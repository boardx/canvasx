import { WidgetBaseInterface, TOriginX, TOriginY } from './widget.entity.base';
import { FileObject } from './file';
import { WidgetType } from './widget.type';
export interface WidgetURLInterface extends WidgetBaseInterface {
  transcription: string;
  vectorSrc: FileObject;
  fileSrc: FileObject;
  fileName: string;
  previewImage: FileObject;
}


export class WidgetURLClass implements WidgetURLInterface {
  updatedBy: string = "";
  updatedByName: string = "";
  createdByName: string="";
  transcription: string = '';
  vectorSrc: FileObject = { id: '', path: '', tmpPath: '' };
  fileSrc: FileObject = { id: '', path: '', tmpPath: '' };
  fileName: string = '';
  previewImage: FileObject = { id: '', path: '', tmpPath: '' };
  id: string = '';
  boardId: string = '';
  backgroundColor: string = '#FFFFFF';
  width: number = 0;
  height: number = 0;
  left: number = 0;
  locked: boolean = false;
  objType: WidgetType = "XURL";
  originX: TOriginX = 'center';
  originY: TOriginY = 'center';
  scaleX: number = 1;
  scaleY: number = 1;
  selectable: boolean = true;
  top: number = 0;
  userId: string = '';
  zIndex: number = Date.now() *100;
  version: string = '1.0';
  updatedAt: number = Date.now();
  createdAt: number = Date.now();
  createdBy: string = '';
  visible: boolean = true;
}


export const EntityKeys = Object.keys(new WidgetURLClass()) as string[];