import { classRegistry } from '../../ClassRegistry';
import { FabricImage } from '../Image';

export class XImage extends FabricImage {
  objType: string = 'XImage';
  declare zIndex: number;
  declare locked: boolean;

  static type = 'XImage';
  constructor(elementId: string, options: Record<string, any>) {
    super(elementId, options);
    this.objType = 'XImage';
    this.zIndex = 0;
    this.locked = false;
    this.cornerColor = 'white';
    this.cornerSize = 15;
    this.cornerStrokeColor = 'gray';
    this.cornerStyle = 'circle';
    this.transparentCorners = false;
  }

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      objType: 'XImage',
    };
  }
  /*boardx custom function */
  getWidgetMenuList() {
    if (this.locked) {
      return ['objectLock', 'download'];
    }
    return ['more', 'objectLock', 'crop', 'delete', 'aiassist', , 'download'];
  }
  getWidgetMenuLength() {
    if (this.locked) {
      return 30;
    }
    return 80;
  }
  getContextMenuList() {
    let menuList;
    if (this.locked) {
      menuList = [
        'Open image',
        'Export board',
        'Exporting selected area',
        'Create Share Back',
        'Bring forward',
        'Bring to front',
        'Send backward',
        'Send to back',
        'Copy as image',
      ];
    } else {
      menuList = [
        'Open image',
        'Export board',
        'Exporting selected area',
        'Create Share Back',
        'Bring forward',
        'Bring to front',
        'Send backward',
        'Send to back',
        'Duplicate',
        'Copy',
        'Copy as image',
        'Paste',
        'Cut',
        'Delete',
      ];
    }
    menuList.push('Select All');
    if (this.locked) {
      menuList.push('Unlock');
    } else {
      menuList.push('Lock');
    }

    // if (this.isPanel && !this.locked) {
    //   menuList.push('Switch to non-panel');
    // } else {
    //   menuList.push('Switch to panel');
    // }

    return menuList;
  }
}
classRegistry.setClass(XImage);
