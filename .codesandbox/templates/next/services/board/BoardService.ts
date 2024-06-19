//* Store  */
// import { api } from "../../redux/services/api";
import store from '../../redux/store';
import {
  handleSetConnectorMode,
  handleSetConnectorModifyMode,
  handleSetArrowMode,
  handleSetDrawingEraseMode,
  handleSetBoardMenuEvents,
  handleSetBoardId,
  handleSetCaptureThumbnail,
} from '../../redux/features/board.slice';

// import { handleSetAIChatRows } from "../store/AIAssist";

// import { handleSetOnlineUsers } from "../store/user";

//* Services  */

import EventService from '../EventService';
import FileService from '../FileService';
import UtilityService from '../UtilityService';

//* Utils  */
// import update from "../board/render";
// import SyncService from "../SyncService";
import { XCanvas } from '../../../../../fabric';

export default class BoardService {
  public canvas: XCanvas;

  static service: BoardService;

  public boardId: string;

  public chatSessionId = null;

  public chatLimit = 25;

  public timerSubscription = null;

  public chatSubscription = null;

  public onlineUsersSubscription = null;

  public whiteBoardSubscription = null;

  // public instanceOfConnector: XConnector | null = null;
  // public startPointOfConnector: any = null;
  // public endPointOfConnector: any = null;
  // public dockingWidget: any = null;

  static getInstance(): BoardService {
    if (BoardService.service == null) {
      BoardService.service = new BoardService();

      // Boardx.Instance.BoardService = BoardService.service;

      // window.requestAnimationFrame(update);
    }

    return BoardService.service;
  }

  // saveStoreOfTimer(boardId:string) {
  //   const timers = server.collection("boardTimer").fetch();
  //   const timer = timers.find((t) => t.boardId === boardId);

  //   if (timer) {
  //     // Assuming you have configured store to be accessible
  //     store.dispatch(handleSetTimer(timer));
  //   }
  // }

  getBoard() {
    return this.canvas;
  }

  setBoard(board: any) {
    this.canvas = board;
  }

  // /**
  //  * Asynchronously captures a thumbnail image of the canvas.
  //  * @returns {Promise<null|string>} A Promise that resolves with the captured thumbnail image data (base64 string) or null if the canvas is empty or unavailable.
  //  */
  // async captureThumbnail() {
  //   return new Promise(async (resolve, reject) => {
  //     // Check if a canvas element is available.
  //     if (canvas) {
  //       // Get a list of objects on the canvas.
  //       let objs = canvas.getObjects();

  //       // If there are no objects on the canvas, resolve with null.
  //       if (!objs || objs.length === 0) {
  //         resolve(null);
  //       } else {
  //         // Mark all objects as not dirty to ensure thumbnail consistency.
  //         objs.forEach((obj:any) => {
  //           obj.dirty = false;
  //         });

  //         // Capture the thumbnail image data.
  //         const imageData = canvas.captureThumbnail();

  //         // Resolve with the captured image data.
  //         resolve(imageData);
  //       }
  //     } else {
  //       // Resolve with null if the canvas is unavailable.
  //       resolve(null);
  //     }
  //   });
  // }

  /**
   * Asynchronously backs up the content of a canvas, including capturing a thumbnail image and compressing it.
   * @returns {Promise<null|string>} A Promise that resolves with the compressed backup data (base64 string) or null if the canvas is empty or unavailable.
   */
  async backupBoard() {
    return new Promise(async (resolve, reject) => {
      // Check if a canvas element is available.
      if (this.canvas) {
        // Get a list of objects on the canvas.
        let objs = this.canvas.getObjects();

        // If there are no objects on the this.canvas, resolve with null.
        if (!objs || objs.length === 0) {
          resolve(null);
        } else {
          // Capture a thumbnail image of the this.canvas.
          let imageData = await this.canvas.toDataURLContent(6);

          // Dispatch an action to store the captured thumbnail image.
          store.dispatch(handleSetCaptureThumbnail(imageData));

          // Compress the captured image data.
          let result: any = await this.compressImage(imageData);

          // Resolve with the compressed backup data.
          resolve(result);
        }
      } else {
        // Resolve with null if the this.canvas is unavailable.
        resolve(null);
      }
    });
  }

  /**
   * Retrieves an array of text from widgets currently within the viewport of the this.canvas.
   * @returns {string[]} An array containing the text from widgets within the viewport.
   */
  getCurrentViewportTextArr() {
    let viewportWidgets: any[] = [];

    // Retrieve all objects on the this.canvas.
    const objects = this.canvas.getObjects();

    // Iterate through each object on the this.canvas.
    objects.forEach((obj: any) => {
      // Check if the object is currently within the viewport.
      if (obj.isOnScreen()) {
        // Check if the object contains text and the text is not empty.
        if (obj.text && obj.text.length > 0) {
          // Add the text of the object to the array with a prefix.
          viewportWidgets.push(' - ' + obj.text);
        }
      }
    });

    // Return an array of text from widgets within the viewport.
    return viewportWidgets;
  }

  getCurrentOptionTextArr() {
    let optionWidgets: any[] = [];

    // Retrieve all objects on the this.canvas.
    const objects = this.canvas.getActiveObjects();

    // Iterate through each object on the this.canvas.
    objects.forEach((obj: any) => {
      // Check if the object is currently within the viewport.
      if (obj.isOnScreen()) {
        // Check if the object contains text and the text is not empty.
        if (obj.text && obj.text.length > 0) {
          // Add the text of the object to the array with a prefix.
          optionWidgets.push(' - ' + obj.text);
        }
      }
    });

    // Return an array of text from widgets within the viewport.
    return optionWidgets;
  }

  /**
   * Retrieves the concatenated text content of widgets currently within the viewport of the this.canvas.
   * @returns {string} The concatenated text content of widgets within the viewport.
   */
  getCurrentViewportTextContent() {
    let viewportWidgets: any[] = [];

    // Retrieve all objects on the this.canvas.
    const objects = this.canvas.getObjects();

    // Iterate through each object on the this.canvas.
    objects.forEach((obj: any) => {
      // Check if the object is currently within the viewport.
      if (obj.isOnScreen()) {
        // Check if the object contains text and the text is not empty.
        if (obj.text && obj.text.length > 0) {
          // Add the text of the object to the array.
          viewportWidgets.push(obj.text);
        }
      }
    });

    // Concatenate the text content of widgets within the viewport.
    let viewportTextContent = viewportWidgets.join(' ');

    // Remove trailing whitespace from the concatenated text content.
    viewportTextContent = viewportTextContent.replace(/(\s*$)/g, '');

    // Return the concatenated text content.
    return viewportTextContent;
  }

  /**
   * Calculate the bounding rectangle that encloses a set of objects on the this.canvas and returns its properties.
   * @param {fabric.Object[]} objs - An array of fabric.js objects for which to calculate the bounding rectangle.
   * @returns {object} An object containing the properties of the bounding rectangle, including its position, dimensions, and viewport transform.
   */
  getRect(objs: any[]) {
    // Create a copy of the input objects array.
    let objects = objs;

    // Initialize variables to store minimum and maximum coordinates.
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    // Iterate through the objects to calculate the bounding rectangle.
    for (let i = 0; i < objects.length; i++) {
      let obj = objects[i];
      let objX =
        obj.left * this.canvas.getZoom() + this.canvas.viewportTransform[4];
      let objY =
        obj.top * this.canvas.getZoom() + this.canvas.viewportTransform[5];
      let objWidth = obj.width * this.canvas.getZoom();
      let objHeight = obj.height * this.canvas.getZoom();
      let objMinX = objX - objWidth / 2;
      let objMinY = objY - objHeight / 2;
      let objMaxX = objX + objWidth / 2;
      let objMaxY = objY + objHeight / 2;

      // Update the minimum and maximum coordinates as needed.
      if (objMinX < minX) {
        minX = objMinX;
      }
      if (objMinY < minY) {
        minY = objMinY;
      }
      if (objMaxX > maxX) {
        maxX = objMaxX;
      }
      if (objMaxY > maxY) {
        maxY = objMaxY;
      }
    }

    // Calculate padding size.
    var padding = 10;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    // Calculate the width and height of the bounding rectangle.
    var width = maxX - minX;
    var height = maxY - minY;

    // Apply the coordinates of the minimal bounding rectangle to the offset to get the position relative to the window.
    var windowX = minX;
    var windowY = minY;
    var windowWidth = width;
    var windowHeight = height;

    // Return the properties of the bounding rectangle.
    return {
      windowX,
      windowY,
      windowWidth,
      windowHeight,
      vpt: this.canvas.viewportTransform,
    };
  }

  /**
   * Asynchronously compresses a base64 image and returns the compressed image as a base64 string.
   * @param {string} base64Image - The base64 image data to be compressed.
   * @returns {Promise<string>} A Promise that resolves with the compressed image as a base64 string.
   */
  async compressImage(base64Image: string) {
    const img = new Image();

    img.src = base64Image;

    // Wait for the image to finish loading.
    await new Promise<void>((resolve) => {
      img.onload = () => {
        resolve();
      };
    });

    // Create a new canvas element.
    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d');

    // Determine the new width for the compressed image (maximum width of 860 pixels).
    let newWidth = img.width;

    if (newWidth > 860) {
      newWidth = 860;
    }

    // Calculate the new height while maintaining the image's aspect ratio.
    const newHeight = img.height * (newWidth / img.width);

    // Set the canvas dimensions to match the new width and height.
    canvas.width = newWidth;

    canvas.height = newHeight;

    // Compress the image by drawing it onto the canvas.
    ctx?.drawImage(img, 0, 0, newWidth, newHeight);

    // Return the compressed image as a new base64 string with JPEG format and quality level 3.
    return canvas.toDataURL('image/jpeg', 3);
  }

  /**
   * Asynchronously updates the whiteboard's thumbnail image from captured data.
   */
  async updateWhiteboardThumbnailOutSide() {
    try {
      // Get the captured data URL from the store.
      const dataUrl = store.getState().board.captureThumbnail;

      // Convert the data URL to a Blob object.
      // @ts-ignore
      const originalFile = await Util.dataURIToBlob(dataUrl);

      // Define compression options for the image.
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      };

      // Compress the image.
      // @ts-ignore
      const file = await Util.compressImage(originalFile, options);

      // Set the name of the compressed file.
      file.name = store.getState().board.captureThumbnailBoardName + '.png';

      // Get the upload path for R2.
      const r2UploadPath = UtilityService.getInstance().getr2UploadPath(
        store.getState().board.board
      );

      // Upload the compressed thumbnail image to R2.
      const key: any = await FileService.getInstance().uploadThumbnailToR2Async(
        r2UploadPath,
        file
      );

      // Set the thumbnail source (URL) to the uploaded key.
      const src = key;

      // Update the current board with the new thumbnail information.
      BoardService.getInstance().updateCurrentBoard({
        thumbnail: src,
        lastUpdateTime: Date.now(),
        lastUpdateBy: store.getState().user.userInfo.userId,
        lastUpdateThum: Date.now(),
        lastUpdateByName: store.getState().user.userInfo.userName,
      });
    } catch (e) {
      // Handle and log any errors that occur during the update process.
      console.error('update whiteboard thumbnail err', e);
    }
  }

  /**
   * Clears resources and events associated with the canvas and resets the canvas instance.
   */
  clearResourceAndEvents() {
    // Check if the this.canvas exists; if not, return early.
    if (!this.canvas) return;

    // Reset board menu events using BoardService.
    BoardService.getInstance().resetBoardMenuEvents();

    // Unmount this.canvas DOM events using EventService.
    EventService.getInstance().unMountCanvasDomEvents();

    // Unregister all canvas events using EventService.
    EventService.getInstance().unregisterAllEvents();

    // Clear any backgroundDotVisualizeInterval if it exists.
    if (this.canvas.backgroundDotVisualizeInterval) {
      clearInterval(this.canvas.backgroundDotVisualizeInterval);
    }

    // Clear the alignment guideline.
    this.canvas.alignmentGuideline = null;

    // Clear and dispose of the canvas instance to release memory.
    //this.canvas.clear(); // Clear the canvas elements.
    this.canvas.off();
    this.canvas.dispose(); // Dispose of the canvas instance.

    // Dispatch an action to reset the board ID in the store.
    store.dispatch(handleSetBoardId(''));

    // Clear the boardId property in BoardService.
    // this.boardId = "";

    // Set the canvas variable to null and clear the board instance.
    this.canvas = null;

    //@ts-ignore
    // Boardx.Instance.board = null;
  }

  // /**
  //  * Exits the "Follow Me" mode for a given board if the conditions are met.
  //  * @param {object} board - The board object to check for "Follow Me" conditions.
  //  */
  // exitFollowMe(board) {
  //   // Check if the board exists and if it is in "Follow Me" mode.
  //   if (
  //     board &&
  //     board.follow &&
  //     board.follow.followMode &&
  //     board.follow.followUserId &&
  //     board.follow.followUserId === store.getState().user.userInfo.userId
  //   ) {
  //     // Dispatch an action to update the board's follow settings, disabling "Follow Me" mode.
  //     store.dispatch(
  //       boardApi.endpoints.updateBoardById.initiate({
  //         id: store.getState().board.board.id,
  //         data: {
  //           follow: {
  //             followMode: false,
  //             followUserName: null,
  //             followUserId: null,
  //           },
  //         },
  //       })
  //     );
  //   }
  // }

  // /**
  //  * Exits the "Follow" mode for a given board if the conditions are met.
  //  * @param {object} board - The board object to check for "Follow" conditions.
  //  */
  // exitFollow(board) {
  //   // Check if the board exists, is in "Follow" mode, and has a follow user ID.
  //   if (
  //     board &&
  //     board.follow &&
  //     board.follow.followMode &&
  //     board.follow.followUserId
  //   ) {
  //     // Dispatch an action to update the board's follow settings, disabling "Follow" mode.
  //     store.dispatch(
  //       BoardApi.endpoints.updateBoardById.initiate({
  //         id: store.getState().board.board.id,
  //         data: {
  //           follow: {
  //             followMode: false,
  //             followUserName: null,
  //             followUserId: null,
  //           },
  //         },
  //       })
  //     );
  //   }
  // }

  /**
   * Resets board menu events and related states.
   */
  resetBoardMenuEvents() {
    // Iterate through each board menu event object.
    store.getState().board.boardMenuEvents.forEach((obj: any) => {
      // Unregister the event using EventService.
      EventService.getInstance().unregister(obj.eventName, obj.eventHandler);
    });

    // Dispatch an action to clear the board menu events.
    store.dispatch(handleSetBoardMenuEvents([]));

    // Reset various drawing and connector modes.
    store.dispatch(handleSetDrawingEraseMode(false));

    store.dispatch(handleSetConnectorMode(false));

    store.dispatch(handleSetConnectorModifyMode(false));

    store.dispatch(handleSetArrowMode(false));
  }

  /**
   * Updates the current board with the provided data.
   * @param {object} data - The data to update the current board with.
   */
  updateCurrentBoard(data: any) {
    // Check if the data is empty or undefined.
    if (JSON.stringify(data) === '{}' || !data) {
      return;
    }

    // Dispatch an action to initiate an update to the current board using the API.
    // store.dispatch(
    //   // @ts-ignore
    //   api.endpoints.updateBoardById.initiate({
    //     id: store.getState().board.board.id,
    //     data,
    //   })
    // );
  }

  /**
   * Updates the current board's timer with the provided data.
   * @param {object} data - The data to update the current board's timer with.
   */
  updateCurrentBoardTimer(data: any) {
    // Check if the data is empty or undefined.
    if (JSON.stringify(data) === '{}' || !data) {
      return;
    }

    // Dispatch an action to initiate an update to the current board's timer using the API.
    // @ts-ignore
    store.dispatch(api.endpoints.updateBoardTimer.initiate(data));
  }

  /**
   * Asynchronously changes the active board and executes a callback upon success.
   * @param {string} boardId - The ID of the new board to activate.
   * @param {function} cbSuccess - A callback function to execute upon successful board change.
   */
  async changeBoard(boardId: string, cbSuccess: any) {
    // Check if the new board ID is different from the current board ID.
    if (boardId !== this.boardId) {
      // Set the new board ID.
      this.boardId = boardId;
    }

    // Execute the success callback.
    cbSuccess();
  }

  /**
   * Asynchronously closes the current board and resets the board ID.
   */
  async closeBoard() {
    // Get the ID of the current board from the store.
    const currBoardId = store.getState().board.boardId;

    // Check if a current board ID exists.
    if (currBoardId) {
      // Dispatch an action to reset the board ID in the store.
      store.dispatch(handleSetBoardId(''));
    }
  }

  async followMyViewPort(data: any) {
    //@ts-ignore
    const myBoard = Boardx.ydoc.getMap('myBoard');
    //@ts-ignore
    Boardx.ydoc.transact(() => {
      myBoard.set('followMyViewport', data);
    });
  }

  async restoreBackup(data: any) {
    //@ts-ignore
    const myBoard = Boardx.ydoc.getMap('myBoard');
    //@ts-ignore
    Boardx.ydoc.transact(() => {
      myBoard.set('restoreBackup', data);
    }, 'backup');
  }

  // async updateWidgets(widgets: any) {
  //   //@ts-ignore
  //   const myShapes = Boardx.ydoc.getMap("myShapes");
  //   const awareness = SyncService.getInstance().awareness;

  //   // Use transaction to batch operations for performance and consistency
  //   //@ts-ignore
  //   Boardx.ydoc.transact(() => {
  //     //loop widgets
  //     // widgets.forEach(widget => {

  //     //   // Find the widget by id
  //     //   const widgetItem = myShapes.get(widget.id);
  //     //   if (widgetItem) {
  //     //     // Iterate over widget properties to update, except 'id'
  //     //     widget.d.userNo = Boardx.awareness.clientID;
  //     //     widget.d.id = widget.id;
  //     //     Object.entries(widget.d).forEach(([key, value]) => {
  //     //       if (key === 'id') return; // Skip updating 'id'
  //     //       widgetItem.set(key, value);
  //     //     });
  //     //   }
  //     // });

  //     myShapes.forEach((item: any, key: any) => {
  //       // Assuming item is a Y.Map and has a 'id' field
  //       const itemId = item.get("id");
  //       // Find widget by id
  //       const widget = widgets.find((obj: any) => obj.id === itemId);

  //       console.log("###widget", widget, awareness.clientID, itemId);
  //       if (widget) {
  //         widget.d.userNo = awareness.clientID;
  //         widget.d.id = itemId;
  //         // Iterate over widget properties to update, except 'id'
  //         Object.entries(widget.d).forEach(([key, value]) => {
  //           // if(key === 'id') return; // Skip updating 'id'
  //           console.log("###key", key, value);
  //           item.set(key, value);
  //         });
  //       }
  //     });
  //   }, "updateWidgets");
  // }

  async removeWidgets(toDeleteWidgets: any) {
    // const ydoc = SyncService.getInstance().ydoc;
    // const myShapes = ydoc.getMap("myShapes");
    // const removedObjectIds = new Set(
    //   toDeleteWidgets.map((obj: any) => obj.id)
    // );
    // // Find keys of items to delete
    // const keysToDelete: any = [];
    // myShapes.forEach((item: any, key: any) => {
    //   if (removedObjectIds.has(item.get("id"))) {
    //     keysToDelete.push(key);
    //   }
    // });
    // // Delete items by their keys
    // keysToDelete.forEach((key: any) => {
    //   ydoc.transact(() => {
    //     myShapes.delete(key); // Delete item with the specified key
    //   });
    // });
  }

  // Function to add a new shape to the array
  async addShape(shapeAttributes2: Record<string, any>) {
    // const ydoc = SyncService.getInstance().ydoc;
    // const shapeAttributes = { ...shapeAttributes2 };
    // const shape = new Y.Map();
    // //todo: this should be removed, and refactor the xcanvas to return pathoffset object as standard object not Point so the ymap will not throw error
    // if (shapeAttributes.pathOffset) {
    //   shapeAttributes.pathOffset = {
    //     x: shapeAttributes.pathOffset.x,
    //     y: shapeAttributes.pathOffset.y,
    //   };
    // }
    // Object.entries(shapeAttributes).forEach(([key, value]) => {
    //   shape.set(key, value);
    // });
    // const myShapes = ydoc.getMap("myShapes");
    // let existingShape = null;
    // myShapes.forEach((item: any, key: any) => {
    //   if (item.get("id") === shapeAttributes.id) {
    //     existingShape = item;
    //   }
    // });
    // if (existingShape) {
    //   // Shape with the same id already exists in myShapes
    //   return;
    // }
    // myShapes.set(shapeAttributes.id, shape);
    // Add the shape map to the shapes array
  }

  /**
   * Asynchronously loads widgets onto the canvas based on widget data for a specific board.
   * @param {object[]} widgetData - An array of widget data to load onto the this.canvas.
   */
  async loadWidgetByBoardId(widgetData: any) {
    // const localWidgetObjList = this.canvas.getObjects() || [];
    // Clear the canvas
    // let { streamData, ydoc } = SyncService.getInstance();
    // // Clear the canvas to prepare for loading new widgets.
    // this.canvas.clear();
    // // Reset the stream data.
    // streamData = [];
    // // Iterate through the widgets and render them on the canvas.
    // const widgets = widgetData;
    // widgets.sort((a: any, b: any) => a.zIndex > b.zIndex);
    // ydoc.transact(async () => {
    //   // Iterate through the widgets and render them on the this.canvas.
    //   for (const widget of widgets) {
    //     await this.canvas.renderWidgetAsync({ ...widget });
    //     this.addShape(widget);
    //   }
    // });
    // // Iterate through the canvas objects for additional adjustments.
    // this.canvas.getObjects().forEach((obj: any) => {
    //   // Correct arrow coordinates if applicable.
    //   if (obj.lines && obj.lines.length > 0) {
    //     this.canvas.onObjectModifyUpdateArrows(obj);
    //   }
    //   // Set mobile-specific rendering properties for certain object types.
    //   if (
    //     store.getState().system.currentUIType === "mobile" &&
    //     (obj.objType !== "XFile" || obj.objType !== "WBImage")
    //   ) {
    //     obj.selectable = false;
    //     obj.lockUniScaling = true;
    //     obj.locked = true;
    //   }
    // });
    // // Set a timeout to indicate that there have been changes to the this.canvas.
    // setTimeout(() => {
    //   this.canvas.anyChanges = true;
    // }, 1000);
  }
}
