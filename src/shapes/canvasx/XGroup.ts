import { classRegistry } from '../../ClassRegistry';
import { Group } from '../Group';

export class XGroup extends Group {
  static type = 'XGroup';
  static objType = 'XGroup';
  declare id: string;
  declare boardId: string;
  declare userId: string;
  declare timestamp: number;
  declare zIndex: number;
  declare locked: boolean;
  declare verticalAlign: string;
  declare objectArr: any[];
  declare version: number;

  constructor(objects: any, options: any) {
    super(objects, options);
    this.id = options.id || '';
    this.objType = 'XGroup';
    this.boardId = options.boardId || '';
    this.userId = options.userId || '';
    this.timestamp = options.timestamp || Date.now();
    this.zIndex = options.zIndex || 0;
    this.locked = options.locked || false;
    this.verticalAlign = options.verticalAlign || 'middle';

    this.selectable = options.selectable || true;
    this.objectArr = options.objectArr || [];
  }

  extendedProperties = [
    'subTargetCheck',
    'objType',
    'boardId',
    'userId',
    'timestamp',
    'zIndex',
    'locked',
    'id',
    'selectable',
    'objectArr',
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
