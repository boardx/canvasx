//**Fabric */
//@ts-nocheck
// import { FabricObject } from '../Object/FabricObject';
import { XY, Point } from '../../Point';
import {
  invertTransform,
  multiplyTransformMatrices,
} from '../../util/misc/matrix';

//**Utils */
export class FabricObject2 {
  transformPointToCanvas(point: XY): Point {
    const self = this;
    const toTransformPoint = new Point(point);
    const transformedPoint = toTransformPoint.transform(
      self.calcTransformMatrix()
    );
    return transformedPoint;
  }

  transformPointFromCanvas(point: XY): Point {
    const self = this;
    const toTransformPoint = new Point(point);
    const transformedPoint = toTransformPoint.transform(
      invertTransform(self.calcTransformMatrix())
    );
    return transformedPoint;
  }

  transformPointToViewport(point: XY) {
    const self = this;
    const toTransformPoint = new Point(point);

    const mCanvas = self.canvas?.viewportTransform;
    const mObject = self.calcTransformMatrix();
    const matrix = mCanvas
      ? multiplyTransformMatrices(mCanvas, mObject)
      : mObject;

    const transformedPoint = toTransformPoint.transform(matrix);
    return transformedPoint;
  }

  text: string = '';

  getText() {
    if (this.text) return this.text;
    else return '';
  }

  saveData(action: string, fields: string[]) {}
}
