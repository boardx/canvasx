import FileService from './FileService';
import UtilityService from './UtilityService';
import store from '../redux/store';
import { handleSetSlideCapture } from '../redux/features/board.slice';
import * as fabric from '../../../../fabric';
import BoardService from './board/BoardService';
// import $ from 'jquery';

export default class SlideService {
  static service: SlideService;
  public _screenShotRect: any;
  static getInstance(): SlideService {
    if (SlideService.service == null) {
      SlideService.service = new SlideService();
    }
    return SlideService.service;
  }

  constructor() {
    this._screenShotRect = null;
  }

  getScreenShotRect() {
    return this._screenShotRect;
  }

  setScreenShotRect(rect: any) {
    this._screenShotRect = rect;
  }

  /**
   * Updates the coordinates of a screenshot rectangle object and sets its coordinates.
   * This method is typically used to ensure the rectangle's coordinates are up-to-date
   * and reflected in the UI.
   */
  setScreenShotRectCoords() {
    // Get the current state of the screenshot rectangle
    let rect = this._screenShotRect;

    // Update the coordinates of the rectangle
    rect.setCoords();

    // Set the updated rectangle back to its original variable or object
    this._screenShotRect = rect;
  }

  /**
   * Sets the opacity (transparency) of a screenshot rectangle to the specified value.
   *
   * @param {number} opacity - The opacity value to set (0 for fully transparent, 1 for fully opaque).
   */
  setScreenShotRectOpacity(opacity: any) {
    // Get the current state of the screenshot rectangle
    let rect = this._screenShotRect;

    // Set the opacity of the rectangle to the specified value
    rect.opacity = opacity;

    // Update the rectangle with the new opacity value
    this._screenShotRect = rect;
  }

  /**
   * Initiates the process of capturing a screenshot within a slide when a mouse click event occurs.
   *
   * @param {number} x - The x-coordinate of the mouse click event.
   * @param {number} y - The y-coordinate of the mouse click event.
   * @param {object} canvas - The canvas or slide element where the screenshot is to be captured.
   */
  slidesMouseDownEnableScreenShot(x: any, y: any, canvas: any) {
    // Dispatch an action to handle the initiation of slide capture with the provided coordinates.
    store.dispatch(handleSetSlideCapture({ startPointX: x, startPointY: y }));
  }

  /**
   * Handles the mouse-up event when enabling screenshot capture on a canvas.
   * This method creates a rectangular area on the canvas based on the mouse drag,
   * sets its properties, and adds it to the canvas.
   *
   * @param {number} x - The x-coordinate of the mouse-up event.
   * @param {number} y - The y-coordinate of the mouse-up event.
   */
  slidesMouseUpEnableScreenShot(x: any, y: any) {
    // Retrieve the starting coordinates of the screenshot capture.
    const startPointX = store.getState().board.slideCapture.startPointX;
    const startPointY = store.getState().board.slideCapture.startPointY;
    const canvas: any = BoardService.getInstance().getBoard();
    // Calculate the dimensions and position of the screenshot rectangle based on the mouse drag.
    let newWidth, newHeight, newLeft, newTop;

    if (startPointX < x && startPointY < y) {
      newWidth = x - startPointX;
      newHeight = y - startPointY;
      newLeft = startPointX;
      newTop = startPointY;
    } else if (startPointX > x && startPointY > y) {
      newWidth = startPointX - x;
      newHeight = startPointY - y;
      newLeft = x;
      newTop = y;
    } else if (startPointX > x && startPointY <= y) {
      newWidth = startPointX - x;
      newHeight = y - startPointY;
      newLeft = x;
      newTop = startPointY;
    } else if (startPointX <= x && startPointY > y) {
      newWidth = x - startPointX;
      newHeight = startPointY - y;
      newLeft = startPointX;
      newTop = y;
    }

    // Create a new fabric.js rectangle with the calculated properties.
    let rect = new fabric.Rect({
      angle: 0,
      height: newHeight,
      left: newLeft,
      objType: 'common',
      scaleX: 1,
      scaleY: 1,
      originX: 'left',
      originY: 'top',
      stroke: '#1a95e9',
      lockUniScaling: true,
      strokeWidth: 0,
      fill: 'rgba(0,0,255,0.3)',
      top: newTop,
      whiteboardId: store.getState().board.boardId,
      width: newWidth,
      zIndex: Date.now() * 100,
    });

    // Set the controls visibility for the rectangle.
    rect.setControlsVisibility({
      tr: true,
      br: true,
      bl: true,
      ml: false,
      mr: false,
      mt: false,
      mb: false,
      mla: false,
      mra: false,
      mta: false,
      mba: false,
      tl: true,
      mtr: false,
    });

    // Define event listeners for 'moving' and 'scaling' the rectangle.
    rect.on('moving', (e: any) => {
      const point = canvas.getPositionOnScreenFromCanvas(
        canvas.getActiveObject().aCoords.br.x,
        canvas.getActiveObject().aCoords.br.y
      );
      // $('#screenShotMenu')
      //   .show()
      //   .css({
      //     left: point.x - 100,
      //     top: point.y + 10
      //   });
    });

    rect.on('scaling', (e: any) => {
      const point = canvas.getPositionOnScreenFromCanvas(
        canvas.getActiveObject().aCoords.br.x,
        canvas.getActiveObject().aCoords.br.y
      );
      // $('#screenShotMenu')
      //   .show()
      //   .css({
      //     left: point.x - 100,
      //     top: point.y + 10
      //   });
    });

    // Set the created rectangle as the screenShotRect and add it to the canvas.
    this._screenShotRect = rect;
    canvas.add(rect);
    canvas.requestRenderAll();
  }

  /**
   * Asynchronously uploads a file to the R2 service.
   *
   * @param {File} file - The file to be uploaded.
   * @returns {Promise} A promise that resolves when the upload is completed.
   */
  async uploadFileToR2Async(file: any) {
    // Obtain the R2 upload path based on the current board in the store.
    const r2UploadPath = UtilityService.getInstance().getr2UploadPath(
      store.getState().board.board
    );

    // Use the FileService to upload the file to the specified R2 path.
    return await FileService.getInstance().uploadFileToR2Async(
      r2UploadPath,
      file
    );
  }
}
