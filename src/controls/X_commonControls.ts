//@ts-nocheck
import { changeWidth } from './changeWidth';
import { Control } from './Control';
import { scaleCursorStyleHandler, scalingEqually } from './scale';
import {
  scaleOrSkewActionName,
  scaleSkewCursorStyleHandler,
  scalingYOrSkewingX,
} from './scaleSkew';
import { renderCircleControl } from './controlRendering';

// use this function if you want to generate new controls for every instance
export const createObjectDefaultControls = () => ({
  tl: new Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  tr: new Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  bl: new Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  br: new Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  // mtr: new Control({
  //   x: 0,
  //   y: -0.5,
  //   actionHandler: rotationWithSnapping,
  //   cursorStyleHandler: rotationStyleHandler,
  //   offsetY: -40,
  //   withConnection: true,
  //   actionName: 'rotate',
  // }),
});

export const createObjectDefaultNoRotateControls = () => ({
  tl: new Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  tr: new Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  bl: new Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  br: new Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),
});

export const createObjectImageControls = () => ({
  tl: new Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  tr: new Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  bl: new Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  br: new Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),
});
export const createObjectFileControls = () => ({
  tl: new Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),
  br: new Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),
});
export const createObjectArrowControls = () => ({
  tl: new Control({
    x: -0.5,
    y: -0.5,
    cursorStyle: 'crosshair',
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),
  br: new Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),
});

export const createObjectConnectorControls = () => {
  function renderCustomControl(ctx, left, top, fabricObject) {
    const styleOverride1 = {
      cornerSize: 10,

      lineWidth: 2,
    };
    renderCircleControl.call(
      fabricObject,
      ctx,
      left,
      top,
      styleOverride1,
      fabricObject
    );
  }
  return {
    mtaStart: new Control({
      x: 0,
      y: -0.5,
      offsetX: 0,
      offsetY: -20,
      render: renderCustomControl,
      mouseDownHandler: (eventData, transformData) => {
        // this.controlMousedownProcess(transformData, 0.0, -0.5);
        return true;
      },
      name: 'mtaStart',
    }),
    mbaStart: new Control({
      x: 0,
      y: 0.5,
      offsetX: 0,
      offsetY: 20,
      render: renderCustomControl,
      mouseDownHandler: (eventData, transformData) => {
        // this.controlMousedownProcess(transformData, 0.0, 0.5);
        return true;
      },
      name: 'mbaStart',
    }),
    mlaStart: new Control({
      x: -0.5,
      y: 0,
      offsetX: -20,
      offsetY: 0,
      render: renderCustomControl,
      mouseDownHandler: (eventData, transformData) => {
        // this.controlMousedownProcess(transformData, -0.5, 0.0);
        return true;
      },
      name: 'mlaStart',
    }),
    mraStart: new Control({
      x: 0.5,
      y: 0,
      offsetX: 20,
      offsetY: 0,
      render: renderCustomControl,
      mouseDownHandler: (eventData, transformData) => {
        // this.controlMousedownProcess(transformData, 0.5, 0.0);
        return true;
      },
      name: 'mraStart',
    }),
  };
};

export const createResizeControls = () => ({
  mr: new Control({
    x: 0.5,
    y: 0,
    offsetX: 20,
    offsetY: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: 'resizing',
  }),
  ml: new Control({
    x: -0.5,
    y: 0,
    offsetX: -20,
    offsetY: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: 'resizing',
  }),
  mb: new Control({
    x: 0,
    y: 0.5,
    offsetX: 0,
    offsetY: 20,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingYOrSkewingX,
    getActionName: scaleOrSkewActionName,
  }),

  mt: new Control({
    x: 0,
    y: -0.5,
    offsetX: 0,
    offsetY: -20,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingYOrSkewingX,
    getActionName: scaleOrSkewActionName,
  }),
});

export const createResizeControlsForText = () => ({
  mr: new Control({
    x: 0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: 'resizing',
  }),
  ml: new Control({
    x: -0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: 'resizing',
  }),
});

export const createTextboxDefaultControls = () => ({
  //...createObjectDefaultControls(),
  ...createResizeControlsForText(),
});
export const createRectNotesDefaultControls = () => ({
  ...createObjectDefaultNoRotateControls(),
  ...createObjectConnectorControls(),
});
export const createShapeNotesDefaultControls = () => ({
  ...createObjectDefaultNoRotateControls(),
  ...createResizeControls(),
  ...createObjectConnectorControls,
});
export const createPathDefaultControls = () => ({
  ...createObjectDefaultNoRotateControls(),
});
export const createImageDefaultControls = () => ({
  ...createObjectImageControls(),
});
export const createFileDefaultControls = () => ({
  ...createObjectFileControls(),
});
