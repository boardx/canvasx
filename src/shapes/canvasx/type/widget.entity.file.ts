import   { WidgetBaseInterface,TOriginX, TOriginY } from './widget.entity.base';
import {  WidgetType } from './widget.type';
import {FileObject} from './file';
 
export enum FileDocument {
  DOC = 'Word Document',
  DOCX = 'Word Document',
  XLS = 'Excel Document',
  XLSX = 'Excel Document',
  PPT = 'PPT Document',
  PPTX = 'PPT Document',
  PDF = 'PDF Document',
  ZIP = 'ZIP File',
  MP4 = 'Video Document',
  WEBM = 'Video Document',
  MP3 = 'Audio Document',
  M4A = 'Audio Document',
  WAV = 'Audio Document',
  AAC = 'Audio Document',
  FLAC = 'Audio Document',
  OGG = 'Audio Document',
  AIFF = 'Audio Document',
  WMA = 'Audio Document',
  APE = 'Audio Document',
}

export type FileObjectType = keyof typeof FileEnum;

export enum FileEnum {
  DOC = 'doc',
  DOCX = 'docx',
  XLS = 'xls',
  XLSX = 'xlsx',
  PPT = 'ppt',
  PPTX = 'pptx',
  PDF = 'pdf',
  ZIP = 'zip',
  MP4 = 'mp4',
  WEBM = 'webm',

  MP3 = 'mp3',
  M4A = 'm4a',
  WAV = 'wav',
  AAC = 'aac',
  FLAC = 'flac',
  OGG = 'ogg',
  AIFF = 'aiff',
  WMA = 'wma',
  APE = 'ape',
  UNKNOWN = 'unknown',
}


export   interface WidgetFileInterface extends WidgetBaseInterface {
  fileName: string;
  fileSrc: FileObject;
  vectorSrc: FileObject;
  transcription: string;
  fileObjectType: FileObjectType;
  previewImage: FileObject;
}


export class WidgetFileClass implements WidgetFileInterface {
  lastEditedByName: string="";
  createdByName: string="";
  fileName: string = '';
  fileSrc: FileObject = { path: '', id: '', tmpPath: '' };
  vectorSrc: FileObject = { path: '', id: '', tmpPath: '' };;
  transcription: string = '';
  fileObjectType: FileObjectType  = 'UNKNOWN';
  previewImage: FileObject ={ path: '', id: '', tmpPath: '' };;
  id: string = '';
  boardId: string = '';
  backgroundColor: string = '';
  width: number = 0;
  height: number = 0;
  left: number = 0;
  locked: boolean = false;
  objType: WidgetType = "XFile";
  originX: TOriginX = 'center';
  originY: TOriginY = 'center';
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

export const EntityKeys = Object.keys(new WidgetFileClass()) as (keyof WidgetFileInterface)[];