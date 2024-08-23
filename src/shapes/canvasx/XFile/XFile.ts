import { classRegistry } from '../../../ClassRegistry';
import { Shadow } from '../../../Shadow';
import { getFabricWindow } from '../../../env';
import { loadImage } from '../../../util/misc/objectEnlive';

import { ImageProps } from '../../Image';
import { FabricObject } from '../../Object/FabricObject';
import { Rect } from '../../Rect';

import { WidgetMenuList } from '../MenuType';
import { FileEmum } from './fileType';
import { FileType } from './fileType';
import { XObjectInterface } from '../XObjectInterface';

export type XFileProps = ImageProps & {
  id: string;
  text: string;
  transcription: string;
  vectorSrc: string;
  fileSrc: string;
  fileName: string;
  previewImage: string;
  fileType: FileType;

  originX: string;
  originY: string;
  top: number;
  left: number;

  width: number;
  height: number;
  backgroundColor: string;
};

export const XFileDefaultValues: Partial<XFileProps> = {
  originX: 'center',
  originY: 'center',
  cornerColor: 'white',
  cornerStrokeColor: 'gray',
  cornerSize: 10,
  cornerStyle: 'circle',
  transparentCorners: false,
};

export class XFile extends FabricObject implements XObjectInterface {
  static objType = 'XFile';
  static type = 'XFile';
  transcription: string;
  vectorSrc: string;
  fileSrc: string;
  fileName: string;
  previewImage: string;
  fileType: FileType;
  _previewImage: HTMLImageElement | null = null;

  public extendedProperties = [
    'id',
    'objType',
    'fileName',
    'transcription',
    'vectorSrc',
    'fileSrc',
    'userId',
    'clientId',
    'zIndex',
    'locked',
    'boardId',
    'fileType',
    'previewImage',
  ];
  constructor(options: Partial<XFileProps>) {
    super(options);

    const previewImage = this.getFileIconURL(options.fileName!);

    this.set('id', options.id || '');
    this.set('fileName', options.fileName || '');
    this.set('transcription', options.transcription || '');
    this.set('vectorSrc', options.vectorSrc || '');
    this.set('fileSrc', options.fileSrc || '');
    this.set('previewImage', options.previewImage || '');
    this.set('fileType', this.getFileType(options.fileName));
    this.objType = 'XFile';
    (this.cornerColor = 'white'),
      (this.cornerStrokeColor = 'gray'),
      (this.cornerSize = 15),
      (this.cornerStyle = 'circle'),
      (this.transparentCorners = false),
      (this.shadow = new Shadow({
        color: 'rgba(217, 161, 177, 0.54)',
        offsetX: 1,
        offsetY: 2,
        blur: 4,
        id: 310,
      }));
    const fileSuffixName = options.fileType;
    this.clipPath = new Rect({
      left: 0,
      top: 0,
      rx: 8,
      ry: 8,
      width: 230,
      height: 248,
      fill: '#000000',
    });
    this.width = 230;
    this.height = 248;
    this.loadPreviewImage(previewImage, options.fileName!);
  }

  getContextMenuList() {
    let menuList;
    if (this.locked) {
      menuList = [
        'Bring forward',
        'Bring to front',
        'Send backward',
        'Send to back',
      ];
    } else {
      menuList = [
        'Bring forward',
        'Bring to front',
        'Send backward',
        'Send to back',
        'Duplicate',
        'Copy',
        'Paste',
        'Cut',
        'Delete',
      ];
    }
    if (this.locked) {
      menuList.push('Unlock');
    } else {
      menuList.push('Lock');
    }

    return menuList;
  }
  // static getDefaults() {
  //   return {
  //     ...super.getDefaults(),
  //     ...XFile.ownDefaults,
  //     ...XFileDefaultValues,
  //   };
  // }
  toObject(propertiesToInclude: Array<any>): any {
    return super.toObject([...this.extendedProperties, ...propertiesToInclude]);
  }
  onDoubleClick() {
    getFabricWindow().open(this.fileSrc, '_blank');
  }
  getWidgetMenuList(): WidgetMenuList {
    const menuList: WidgetMenuList = [];
    if (this.locked) {
      menuList.push('objectLock');
    } else {
      menuList.push('more');
      menuList.push('objectLock');
      menuList.push('delete');
      menuList.push('fileName');
      menuList.push('borderLineIcon');
      menuList.push('fileDownload');
      const fileType = this.fileName.split('.').pop()?.toLowerCase() || '';
      const audioFileTypes = [
        'mp3',
        'm4a',
        'wav',
        'aac',
        'flac',
        'ogg',
        'aiff',
        'wma',
        'ape',
      ];
      if (audioFileTypes.includes(fileType)) {
        menuList.push('audioToText');
      }
    }
    return menuList;
  }
  getWidgetMenuLength() {
    if (this.locked) return 50;
    return 60;
  }

  drawObject(ctx: CanvasRenderingContext2D) {
    let elementToDraw = null;
    // draw border
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0)';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.lineWidth = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.moveTo(-this.width / 2, -this.height / 2);
    ctx.stroke();

    // if (this.isMoving === false && this.resizeFilter && this._needsResize()) {
    //   // this._lastScaleX = this.scaleX;
    //   // this._lastScaleY = this.scaleY;
    //   // elementToDraw = this.applyFilters(
    //   //   null,
    //   //   this.resizeFilter,
    //   //   this._filteredEl || this._originalElement,
    //   //   true
    //   // );
    // } else {
    //   elementToDraw = this._element;
    // }

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

    // if (this.fileName.substring(this.fileName.lastIndexOf('.') + 1) !== FileEmum.PDF) {
    this.renderTitle(ctx, this.fileName);
    // }
    this._renderStroke(ctx);
  }

  getFileType(fileName = '') {
    let fileType = '';
    switch (fileName.substring(fileName.lastIndexOf('.') + 1)) {
      case FileEmum.DOC:
      case FileEmum.DOCX:
        fileType = 'Word Document';
        break;
      case FileEmum.XLS:
      case FileEmum.XLSX:
        fileType = 'Excel Document';
        break;
      case FileEmum.PPT:
      case FileEmum.PPTX:
        fileType = 'PPT Document';
        break;
      case FileEmum.PDF:
        fileType = 'PDF Document';
        break;
      case FileEmum.ZIP:
        fileType = 'ZIP File';
        break;
      case FileEmum.MP4:
      case FileEmum.WEBM:
        fileType = 'Video Document';
        break;
      default:
        fileType = 'Other Document';
        break;
    }
    return fileType;
  }

  isFileVideo(fileName: string) {
    if (!fileName) return false;

    switch (fileName.substr(fileName.lastIndexOf('.') + 1)) {
      case FileEmum.MP4:
        return true;
      case FileEmum.WEBM:
        return true;
      default:
        return false;
    }
  }

  renderTitle(ctx: any, title: string) {
    const maxWidth = this.width;
    const x = -this.width / 2;
    const y = this.height / 2 - 60;

    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';

    // white board behind the title
    ctx.fillRect(x, y - 29, maxWidth, 90);
    ctx.fillStyle = '#190FA1';

    // helper function to convert string
    const GB2312UnicodeConverter = {
      ToUnicode(str: string) {
        return escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u');
      },
      ToGB2312(str: string) {
        return unescape(str.replace(/\\u/gi, '%u'));
      },
    };
    // Handle non-unicode or non-utf8 coding string
    const unicodeTitle = GB2312UnicodeConverter.ToUnicode(title);

    // handle the situation that the website's title is null
    if (title === null || unicodeTitle.indexOf('\\ufffd') !== -1 || !title) {
      const firstChar = this.fileSrc.indexOf('.');
      const lastChar = this.fileSrc.indexOf('.', firstChar + 1);
      this.fileName = this.fileSrc.substring(firstChar + 1, lastChar);
    }

    // title setting
    this.wrapText(ctx, title, x + 15, y - 5, maxWidth - 20, 23);

    // url setting
    const newurl = this.fileSrc
      ? `${this.fileSrc.split('/')[0]}/${this.fileSrc.split('/')[1]}/${
          this.fileSrc.split('/')[2]
        }`
      : '';
    ctx.font = '12px Inter';
    ctx.fillStyle = 'rgba(35, 41, 48, 0.65)';
    // gray square in front of website
    this.wrapText(ctx, newurl, x + 15, y + 45, maxWidth - 20, 25);
  }

  // changeFileImgUrl(targetSrc: string) {
  //   this.setSrc(targetSrc, { crossOrigin: 'anonymous' });
  // }

  wrapText(
    context: any,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    let words: any = [];
    if (text) words = text.split(' ');

    let line = '';
    let lineCount = 1;
    let tempLine = '';
    let _y = y;

    // handle non-English char
    if (escape(text).indexOf('%u') < 0) {
      // only the English char
      for (let n = 0; n < words.length; n++) {
        if (lineCount === 3) return;
        if (n !== 0) tempLine = `${line.slice(0, -3)}...`;
        const testLine = `${line + words[n]} `;
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          if (lineCount === 2) {
            line = tempLine;
          }
          context.fillText(line, x, _y);
          line = `${words[n]} `;
          _y += lineHeight;
          lineCount++;
        } else {
          line = testLine;
        }
      }
    } else {
      for (let n = 0; n < text.length; n++) {
        if (lineCount === 3) return;
        if (n !== 0) tempLine = `${line.slice(0, -2)}...`;
        const testLine = `${line + text[n]}`;
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          if (lineCount === 2) {
            line = tempLine;
          }
          context.fillText(line, x, _y);
          line = `${text[n]}`;
          _y += lineHeight;
          lineCount++;
        } else {
          line = testLine;
        }
      }
    }
    if (lineCount < 3) context.fillText(line, x, _y);
  }
  getFileIconURL(fileName: string) {
    let fileIconURL = '';
    switch (fileName.substring(fileName.lastIndexOf('.') + 1)) {
      case 'doc':
      case 'docx':
        fileIconURL = './fileIcons/word.png';
        break;
      case 'xls':
      case 'xlsx':
        fileIconURL = './fileIcons/excel.png';
        break;
      case 'ppt':
      case 'pptx':
        fileIconURL = './fileIcons/ppt.png';
        break;
      case 'pdf':
        fileIconURL = './fileIcons/pdf.svg';
        break;
      case 'zip':
        fileIconURL = './fileIcons/zip.png';
        break;
      case 'mp4':
        fileIconURL = './fileIcons/mp4.png';
        break;

      case 'webm':
        fileIconURL = './fileIcons/mp4.png';
        break;
      default:
        fileIconURL = './fileIcons/file.png';
        break;
    }
    return fileIconURL;
  }
  async loadPreviewImage(previewImage: string, fileName: string) {
    const url = previewImage ? previewImage : this.getFileIconURL(fileName!);

    const loadedImg = await loadImage(url, {
      crossOrigin: 'anonymous',
    });
    this._previewImage = loadedImg;
    this.dirty = true;
    this.canvas?.requestRenderAll();
  }
}

classRegistry.setClass(XFile);
