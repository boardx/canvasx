import { classRegistry } from '../../ClassRegistry';
import { Group } from '../Group';

import { WidgetType } from './type/widget.type';
import { EntityKeys } from './type/widget.entity.group';
import { WidgetGroupInterface } from './type/widget.entity.group';


export class XGroup extends Group implements WidgetGroupInterface {
  static type: WidgetType = 'XGroup';
  static objType: WidgetType = 'XGroup';


  constructor(objects: any, options: any) {


    super(objects, options);
    Object.assign(this, options);
    this.objType = 'XGroup';
    this.cornerColor = 'white';
    this.cornerSize = 10;
    this.cornerStyle = 'circle';
    this.transparentCorners = false;
    this.cornerStrokeColor = 'gray';
  }
  updatedBy: string;
  updatedByName: string;

  createdByName: string;
  objectArr: any[];
  boardId: string;
  objType: WidgetType;
  userId: string;
  zIndex: number;
  version: string;
  updatedAt: number;

  createdAt: number;
  createdBy: string;


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
