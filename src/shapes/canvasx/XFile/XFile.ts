import { TOriginX, TOriginY } from 'fabric';
import { classRegistry } from '../../../ClassRegistry';
import { Shadow } from '../../../Shadow';
import { getFabricWindow } from '../../../env';
import { loadImage } from '../../../util/misc/objectEnlive';

import { ImageProps } from '../../Image';
import { FabricObject } from '../../Object/FabricObject';
import { Rect } from '../../Rect';

import {
  WidgetFileInterface,
  WidgetFileClass,
  FileObjectType,
  FileEnum
} from '../type/widget.entity.file';
import { WidgetType, WidgetFileType } from '../type/widget.type';
import { EntityKeys, } from "../type/widget.entity.file";
import { FileObject } from "../type/file";



export type XFileProps = ImageProps & WidgetFileClass;

const FILE_ICON_PATHS: Record<WidgetFileType, string> = {
  XFileWord: '/boardxstatic/fileIcons/word.png',
  XFileExcel: '/boardxstatic/fileIcons/excel.png',
  XFilePPT: '/boardxstatic/fileIcons/ppt.png',
  XFilePDF: '/boardxstatic/fileIcons/pdf.svg',
  XFileZip: '/boardxstatic/fileIcons/zip.png',
  XFileVideo: '/boardxstatic/fileIcons/mp4.png',
  XFileAudio: '/boardxstatic/fileIcons/audio.png',
  XFile: '/boardxstatic/fileIcons/file.png',
};

const FILE_TYPE_NAMES: Record<FileObjectType, string> = {
  DOC: 'Word Document',
  DOCX: 'Word Document',
  XLS: 'Excel Document',
  XLSX: 'Excel Document',
  PPT: 'PPT Document',
  PPTX: 'PPT Document',
  PDF: 'PDF Document',
  ZIP: 'ZIP File',
  MP4: 'Video Document',
  WEBM: 'Video Document',
  MP3: 'Audio Document',
  M4A: 'Audio Document',
  WAV: 'Audio Document',
  AAC: 'Audio Document',
  FLAC: 'Audio Document',
  OGG: 'Audio Document',
  AIFF: 'Audio Document',
  WMA: 'Audio Document',
  APE: 'Audio Document',
  UNKNOWN: 'Other Document',
};

const VIDEO_FILE_EXTENSIONS = new Set([FileEnum.MP4, FileEnum.WEBM]);

export class XFile extends FabricObject implements WidgetFileInterface {
  static objType: WidgetFileType = 'XFile';
  static type: WidgetFileType = 'XFile';

  // WidgetFile properties
  id: string = '';
  boardId: string = '';
  backgroundColor: string = 'rgba(0,0,0,0)';
  fill: string = 'rgba(0,0,0,0)';
  width: number = 230;
  height: number = 248;
  left: number = 0;
  locked: boolean = false;
  objType: WidgetType = 'XFile';
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

  // WidgetFile specific properties
  fileName: string = '';
  fileSrc: FileObject = { tmpPath: '', id: '', path: '' };
  vectorSrc: FileObject = { tmpPath: '', id: '', path: '' };
  transcription: string = '';

  previewImage: FileObject = { tmpPath: '', id: '', path: '' };

  private _previewImage: HTMLImageElement | null = null;



  constructor(options: Partial<XFileProps & { type: string }> = {}) {


    super(options);
    this.objType = 'XFile';
    this.initializeProperties(options);
    this.initializeVisuals();
    this.loadPreviewImage(
      this.getFileIconURL(XFile.objType),
      options.fileName!
    );
  }
  updatedBy: string;
  updatedByName: string;

  createdByName: string;
  fileObjectType: FileObjectType;

  private initializeProperties(options: Partial<XFileProps>) {
    this.set('id', options.id || this.id);
    this.set('fileName', options.fileName || this.fileName);
    this.set('transcription', options.transcription || this.transcription);
    this.set('vectorSrc', options.vectorSrc || this.vectorSrc);
    this.set('fileSrc', options.fileSrc || this.fileSrc);
    this.set('previewImage', options.previewImage || this.previewImage);
    this.fileObjectType = XFile.getFileType(options.fileName || '');
    this.fill = options.backgroundColor || this.backgroundColor;
  }

  private initializeVisuals() {
    this.cornerColor = 'white';
    this.cornerStrokeColor = 'gray';
    this.cornerSize = 10;
    this.cornerStyle = 'circle';
    this.transparentCorners = false;
    this.shadow = new Shadow({
      color: 'rgba(217, 161, 177, 0.54)',
      offsetX: 1,
      offsetY: 2,
      blur: 4,
      id: 310,
    });

    this.clipPath = new Rect({
      left: 0,
      top: 0,
      rx: 8,
      ry: 8,
      width: this.width,
      height: this.height,
      fill: '#000000',
    });
  }

  toObject(propertiesToInclude: string[] = []): any {
    return super.toObject([...EntityKeys, ...propertiesToInclude]);
  }

  getObject() {
    const entityKeys: string[] = EntityKeys;
    const result: Record<string, any> = {};

    entityKeys.forEach((key) => {
      if (key in this) {
        result[key] = (this as any)[key];
      }
    });

    return result;
  }

  onDoubleClick(): void {
    getFabricWindow().open(this.fileSrc.tmpPath, '_blank');
  }

  drawObject(ctx: CanvasRenderingContext2D): void {
    this.drawBorder(ctx);
    this.drawPreviewImage(ctx);
    this.renderTitle(ctx, this.fileName);
    this._renderStroke(ctx);
  }

  private drawBorder(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0)';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.lineWidth = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.moveTo(-this.width / 2, -this.height / 2);
    ctx.stroke();
  }

  private drawPreviewImage(ctx: CanvasRenderingContext2D): void {
    const imgWidth = 230;
    const imgHeight = 160;

    if (this._previewImage) {
      ctx.drawImage(
        this._previewImage,
        -this.width / 2,
        -this.height / 2,
        imgWidth,
        imgHeight
      );
    }
  }

  static getFileTypeName(fileName: string = ''): string {
    const extension = fileName
      .split('.')
      .pop()
      ?.toUpperCase() as FileObjectType;
    return FILE_TYPE_NAMES[extension] || 'Other Document';
  }

  static getFileType(fileName: string = ''): FileObjectType {
    const extension: FileObjectType = fileName
      .split('.')
      .pop()
      ?.toUpperCase() as FileObjectType;

    return extension;
  }

  isFileVideo(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toUpperCase();
    return VIDEO_FILE_EXTENSIONS.has(extension as FileEnum);
  }

  renderTitle(ctx: CanvasRenderingContext2D, title: string): void {
    const maxWidth = this.width;
    const x = -this.width / 2;
    const y = this.height / 2 - 60;

    ctx.font = '16px Inter';
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(x, y - 29, maxWidth, 90);
    ctx.fillStyle = '#190FA1';

    const sanitizedTitle = this.sanitizeTitle(title);
    this.wrapText(ctx, sanitizedTitle, x + 15, y - 5, maxWidth - 20, 23);

    const newUrl = this.getShortenedUrl();
    ctx.font = '12px Inter';
    ctx.fillStyle = 'rgba(35, 41, 48, 0.65)';
    this.wrapText(ctx, newUrl, x + 15, y + 45, maxWidth - 20, 25);
  }

  private sanitizeTitle(title: string): string {
    const unicodeTitle = this.toUnicode(title);
    if (!title || unicodeTitle.includes('\\ufffd')) {
      const parts = this.fileSrc.tmpPath.split('.');
      return parts.length > 2 ? parts[1] : 'Untitled';
    }
    return title;
  }

  private toUnicode(str: string): string {
    return escape(str).toLowerCase().replace(/%u/gi, '\\u');
  }

  private getShortenedUrl(): string {
    if (!this.fileSrc.tmpPath) return '';
    const parts = this.fileSrc.tmpPath.split('/');
    return parts.length >= 3
      ? `${parts[0]}/${parts[1]}/${parts[2]}`
      : this.fileSrc.tmpPath;
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): void {
    const words = text.includes(' ') ? text.split(' ') : text.split('');
    let line = '';
    let lineCount = 1;
    let tempLine = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      if (lineCount === 3) return;

      const testLine = line + (words[n] + (words.length > 1 ? ' ' : ''));
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        if (lineCount === 2) {
          line = `${line.slice(0, -3)}...`;
        }
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
        lineCount++;
      } else {
        line = testLine;
      }
    }

    if (lineCount < 3) {
      ctx.fillText(line, x, currentY);
    }
  }

  getFileIconURL(objType: WidgetFileType): string {
    return FILE_ICON_PATHS[objType] || FILE_ICON_PATHS['XFile'];
  }

  async loadPreviewImage(
    previewImage: string,
    fileName: string
  ): Promise<void> {
    const url = previewImage || this.getFileIconURL(XFile.objType);
    try {
      this._previewImage = await loadImage(url, { crossOrigin: 'anonymous' });
      this.dirty = true;
      this.canvas?.requestRenderAll();
    } catch (error) {
      console.error('Failed to load preview image:', error);
    }
  }
}

classRegistry.setClass(XFile);
