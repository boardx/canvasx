import { FabricObject } from '../Object/FabricObject';
import { Textbox } from '../Textbox';
import { Rect } from '../Rect';
import { Group } from '../Group';
import { LayoutManager } from '../../LayoutManager';
import { FitContentLayout } from '../../LayoutManager/LayoutStrategies/FitContentLayout';
import { classRegistry } from '../../ClassRegistry';
import { EntityKeys, WidgetFrameInterface } from './type/widget.entity.frame';
import { WidgetType } from './type/widget.type';

class XFrame extends FabricObject implements WidgetFrameInterface {
  title: Textbox;
  titleText: string;
  body: Rect;
  objects: Group;
  layoutManager: LayoutManager;
  static type: WidgetType = 'XFrame';
  static objType: WidgetType = 'XFrame';

  constructor(options: Partial<WidgetFrameInterface> = {}) {

    super(options);
    Object.assign(this, options);
    this.titleText = 'Frame Title',
      this.left = 100,
      this.top = 100,
      this.width = 400,
      this.height = 300
    this.title = new Textbox(this.titleText, {
      left: this.left,
      top: this.top,
      fontSize: 18,
      fontWeight: 'bold',
      selectable: true,
      editable: true,
    });
    this.titleText = this.titleText;
    this.objType = 'XFrame';
    this.body = new Rect({
      left: this.left,
      top: this.top + 30,
      width: this.width,
      height: this.height,
      fill: 'rgba(0,0,0,0.1)',
      selectable: false,
      evented: false,
    });

    this.objects = new Group([this.body, this.title], {
      left: this.left,
      top: this.top,
      selectable: true,
    });

    // Create a layout manager for the frame
    this.layoutManager = new LayoutManager(new FitContentLayout());

    this.canvas!.add(this.objects);

    this.title.on('mousedblclick', () => {
      this.title.enterEditing();
    });

    this.objects.on('scaling', (event) => {
      const scaleX = this.objects.scaleX;
      const scaleY = this.objects.scaleY;

      this.objects.getObjects().forEach((obj) => {
        if (obj !== this.title) {
          obj.scaleX = scaleX;
          obj.scaleY = scaleY;
          obj.setCoords();
        }
      });

      this.objects.scaleX = 1;
      this.objects.scaleY = 1;
      this.objects.setCoords();

      this.canvas!.renderAll();
    });

    this.objects.on('mousedown', (event) => {
      if (event.target === this.title) {
        this.objects.set('selectable', true);
        this.canvas!.setActiveObject(this.objects);
      }
    });

    this.objects.on('moving', (event) => {
      //@ts-ignore
      const deltaX = event.movementX;
      //@ts-ignore
      const deltaY = event.movementY;

      this.objects.getObjects().forEach((obj) => {
        if (obj !== this.body && obj !== this.title) {
          obj.set('left', obj.left + deltaX);
          obj.set('top', obj.top + deltaY);
        }
      });

      this.canvas!.renderAll();
    });

    this.canvas!.on('object:moving', (e) => {
      if (e.target !== this.objects && !this.objects.contains(e.target)) {
        this.checkObjectInFrame(e.target);
      }
    });

    this.canvas!.on('mouse:up', (e) => {
      if (e.target && this.objects.contains(e.target)) {
        this.addObject(e.target);
      } else if (e.target && !this.objects.contains(e.target)) {
        this.removeObject(e.target);
      }
    });

    this.canvas!.renderAll();
  }
  updatedBy: string;
  updatedByName: string;

  createdByName: string;
  boardId: string;
  objType: WidgetType;
  userId: string;
  zIndex: number;
  version: string;
  updatedAt: number;

  createdAt: number;
  createdBy: string;

  checkObjectInFrame(obj: any) {
    const objBound = obj.getBoundingRect();
    const frameBound = this.body.getBoundingRect();

    if (
      objBound.left >= frameBound.left &&
      objBound.top >= frameBound.top &&
      objBound.left + objBound.width <= frameBound.left + frameBound.width &&
      objBound.top + objBound.height <= frameBound.top + frameBound.height
    ) {
      this.addObject(obj);
    } else {
      this.removeObject(obj);
    }
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
  addObject(obj: any) {
    if (!this.objects.contains(obj)) {
      this.objects.add(obj);
      obj.set({
        left: obj.left - this.objects.left,
        top: obj.top - this.objects.top,
        selectable: true,
      });
      this.canvas!.remove(obj);
      this.canvas!.renderAll();
    }
  }

  removeObject(obj: any) {
    if (this.objects.contains(obj)) {
      this.objects.remove(obj);
      obj.set({
        left: obj.left + this.objects.left,
        top: obj.top + this.objects.top,
        selectable: true,
      });
      this.canvas!.add(obj);
      this.canvas!.renderAll();
    }
  }
}

classRegistry.setClass(XFrame);

export { XFrame };
