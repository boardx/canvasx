import { classRegistry } from '../../ClassRegistry';
import { Group } from '../Group';
import { XObjectInterface } from './XObjectInterface';

export class XGroup extends Group implements XObjectInterface {
  static type = 'XGroup';
  static objType = 'XGroup';

  extendedProperties = [
    'subTargetCheck',
    'objType',
    'boardId',
    'userId',
    'timestamp',
    'zIndex',
    'locked',
    'verticalAlign',
    'lines',
    'icon',
    'id',
    'selectable',
    'objectArr',
    'subObjList',
    'userNo',
  ];

  getWidgetMenuList() {
    if (this.locked) {
      return ['objectLock'];
    }
    return ['objectLock', 'delete', 'aiassist'];
  }

  getWidgetMenuLength() {
    return 60;
  }

  //  override the default behavior of `getText` to return a concatenated string of all text objects\
  // canvasX custoom method
  getText(): any {
    if (this.getObjects().length > 1) {
      const textsArray = this.getObjects().map((item) => item.getText());
      return textsArray.join('/n').trim();
    } else {
      return '';
    }
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
        'Ungroup',
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
}
classRegistry.setClass(XGroup);
