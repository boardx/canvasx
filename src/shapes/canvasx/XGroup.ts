import { classRegistry } from '../../ClassRegistry';
import { Group } from '../Group';

export class XGroup extends Group {
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
}
classRegistry.setClass(XGroup);
