import { XCanvas } from '../../canvas/canvasx/bx-canvas';
import { XY, Point } from '../../Point';

import * as util from '../../util';

export const getPositionOnCanvas = function (xy: XY, canvas: XCanvas) {
  // If the horizontal or vertical coordinates are not defined, default them to 0
  const point = new Point(xy.x, xy.y);

  // Uses fabric's utility method 'transformPoint' to calculate the point's
  // position on the canvas by applying the inverted viewportTransform on the point
  const originalPoint = point.transform(
    util.invertTransform(canvas.viewportTransform)
  );

  // Returns the transformed coordinates in an object format
  return { left: originalPoint.x, top: originalPoint.y };
};
