import { FabricObject } from '../Object/FabricObject';
import { Textbox } from '../Textbox';
import { Rect } from '../Rect';
import { Group } from '../Group';
import { LayoutManager } from '../../LayoutManager';
import { FitContentLayout } from '../../LayoutManager/LayoutStrategies/FitContentLayout';
import { classRegistry } from '../../ClassRegistry';

class XFrame extends FabricObject {
  title: Textbox;
  body: Rect;
  objects: Group;
  layoutManager: LayoutManager;
  static type = 'XFrame';
  static objType = 'XFrame';

  constructor(
    canvas: any,
    titleText = 'Frame Title',
    left = 100,
    top = 100,
    width = 400,
    height = 300
  ) {
    super();
    this.canvas = canvas;
    this.title = new Textbox(titleText, {
      left: left,
      top: top,
      fontSize: 18,
      fontWeight: 'bold',
      selectable: true,
      editable: true,
    });

    this.body = new Rect({
      left: left,
      top: top + 30,
      width: width,
      height: height,
      fill: 'rgba(0,0,0,0.1)',
      selectable: false,
      evented: false,
    });

    this.objects = new Group([this.body, this.title], {
      left: left,
      top: top,
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
