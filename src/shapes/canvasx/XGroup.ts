import { classRegistry } from '../../ClassRegistry';
import { Group } from '../Group';

export class XGroup extends Group {
  declare objType: string;
  getObject() {
    // const object = {};
    // const keys = [
    //   'id',
    //   'angle',
    //   'backgroundColor',
    //   'fill',
    //   'fontFamily',
    //   'fontSize',
    //   'height',
    //   'width',
    //   'left',
    //   'lines', // the arrows array [{…}]
    //   'lockUniScaling',
    //   'locked',
    //   'fontWeight',
    //   'lineHeight',
    //   'obj_type',
    //   'originX',
    //   'originY',
    //   'panelObj', // the parent panel string
    //   'relationship', // relationship with panel for transform  [1.43, 0, 0, 1.43, 7.031931057304291, 16.531768328466796]
    //   'scaleX',
    //   'scaleY',
    //   'selectable',
    //   'text',
    //   'textAlign',
    //   'top',
    //   'userNo',
    //   'userId',
    //   'whiteboardId',
    //   'zIndex',
    //   'version',
    //   'isPanel',
    //   'editable',
    // ];
    // keys.forEach((key) => {
    //   //@ts-ignore
    //   object[key] = this[key];
    // });
    // const objArr: any[] = [];
    // this.getObjects().forEach((obj) => {
    //   objArr.push(obj.getObject());
    // });
    // object.objectArr = objArr;
    // return object;
  }

  getContextMenuList() {
    // let menuList;
    // if (this.locked) {
    //   menuList = [
    //     'Bring forward',
    //     'Bring to front',
    //     'Send backward',
    //     'Send to back',
    //   ];
    // } else {
    //   menuList = [
    //     'Ungroup',
    //     'Bring forward',
    //     'Bring to front',
    //     'Send backward',
    //     'Send to back',
    //     'Duplicate',
    //     'Copy',
    //     'Paste',
    //     'Cut',
    //     'Delete',
    //   ];
    // }
    // if (this.locked) {
    //   menuList.push('Unlock');
    // } else {
    //   menuList.push('Lock');
    // }
    // return menuList;
  }
}
classRegistry.setClass(XGroup);
