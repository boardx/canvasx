import { classRegistry } from '../../ClassRegistry';
import { FabricImage } from '../Image';

export class XImage extends FabricImage {
  declare objType: string;
  declare zIndex: number;
  declare locked: boolean;

  getObject() {
    const object = {};
    const keys = [
      'id',
      'angle',
      'backgroundColor',
      'fill',
      'width',
      'height',
      'left',
      'locked',
      'lockScalingX',
      'lockScalingY',
      'lockMovementX',
      'lockMovementY',
      'lockScalingFlip',
      'obj_type',
      'originX',
      'originY',
      'scaleX',
      'scaleY',
      'selectable',
      'top',
      'userNo',
      'userId',
      'whiteboardId',
      'zIndex',
      'version',
      'isPanel',
      'panelObj',
      'relationship',
      'flipX',
      'flipY',
      'stroke',
      'strokeWidth',
      'lines',
      'src',
      'name',
      'progressBar',
      'isUploading',
      'initedProgressBar',
      'hoverCursor',
      'lockUniScaling',
      'cornerStyle',
      'lightbox',
      'cropSelectionRect',
      'url',
    ];
    keys.forEach((key) => {
      //@ts-ignore
      object[key] = this[key];
    });
    return object;
  }

  /*boardx custom function */
  getWidgetMenuList() {
    if (this.locked) {
      return ['objectLock'];
    }
    return ['more', 'objectLock', 'crop', 'delete', 'aiassist'];
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
