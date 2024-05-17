import * as fabric from '../../../fabric';

import { WidgetType } from '../../../definition/widget/widgetType';

//Redux Store

import { Arrow } from '../../shapes/canvasx/';

//Services
// import { WidgetService, UtilityService } from '../../../services/index';
import { CircleNotes } from '../../shapes/canvasx/X_CircleNotes';
import { ShapeNotes } from '../../shapes/canvasx/X_ShapeNotes';
import { RectNotes } from '../../shapes/canvasx/X_RectNotes';
import { WBFile } from '@/x-canvas/shapes/file/File';
import { Textbox } from '../../shapes/canvasx/X_Textbox';
import { UrlImage } from '@/x-canvas/shapes/url/Urlimage';
import { WBCanvas } from '../../canvas/canvasx/bx-canvas';

/**
 *
 * @param {*} position count of all the charactors before the cursor location
 * @param {*} textLines fabric's wrapped text lines
 * @param {*} text fabric's unwrapped input text array(include '\n')
 * @returns
 */

const getImageResizedURL = function (imgOptions, zoom) {
  let currentSrc = imgOptions.src; // set the current image source equal to the source in the imgOptions object

  let targetSrc = ''; // Initializing targetSrc string

  // checking if the source of the imgOptions includes base64
  // if "base64" is present, the function immediately returns the original source without changing it
  if (imgOptions.src && imgOptions.src.indexOf('base64') !== -1) {
    return imgOptions.src;
  }

  // checking if the source of the imgOptions includes amazonaws.com
  // if "amazonaws.com" is present, the function immediately returns the original source without changing it
  if (imgOptions.src.indexOf('amazonaws.com') > -1) {
    return imgOptions.src;
  }

  // if the source includes "?x-oss", it removes it and sets the source up to that point as the currentSrc
  if (currentSrc.indexOf('?x-oss') > -1) {
    currentSrc = currentSrc.split('?x-oss')[0];
  }

  // Checking if image is from mini canvas and its source includes "aliyuncs.com"
  if (imgOptions.isMiniCanvas && imgOptions.src.indexOf('aliyuncs.com') > -1) {
    targetSrc = `${currentSrc}?x-oss-process=image/resize,w_${20}`;

    imgOptions.compressSize = 20;
  } else {
    targetSrc = currentSrc;

    imgOptions.compressSize = 100;
  }

  imgOptions.src = targetSrc; // setting the source of imgOptions as the targetSrc

  return targetSrc; // finally returns the targetSrc string

  // Hence this function is primarily used to resize image while keeping certain cases to be intact.
};

WBCanvas.prototype.createWidgetAsync = async function (options) {
  const self = this;

  let widget = null;

  if (!options) return;

  if (options.selectable === undefined) {
    options.selectable = true;
  }

  if (options.type) {
    delete options.type;
  }

  if (!options.obj_type && options.objects && options.objects.length > 1) {
    options.obj_type = 'WBGroup';

    options.objectArr = options.objects;
  }

  options.objectCaching = true;

  options.hasControls = true;

  switch (options.obj_type) {
    case 'WBTriangle':
      widget = new fabric.Triangle(options);

      return widget;

    case 'WBUrlImage':
      var url = '/fileIcons/weblink.png';

      if (options.src) {
        if (
          options.src !== '/fileIcons/weblink.png' &&
          options.src.indexOf('.svg') === -1 &&
          options.src.indexOf('.gif') === -1
        ) {
          url = `${options.src.split('?')[0]}`;
        }
      } else {
        url = options.src.split('?')[0];
      }

      options.lockUniScaling = true;

      const pugImg = new Image();

      let instance = new UrlImage(pugImg, options);

      return new Promise((resolve, reject) => {
        instance.fromURL(url, options).then((urlImage) => {
          if (urlImage) {
            urlImage.set({
              rx: 40,
              ry: 40,
              clipTo(ctx) {
                ctx.arc(0, 0, 200, 200, Math.PI * 2, true);
              },
            });

            resolve(urlImage);
          } else {
            instance
              .fromURL('/fileIcons/weblink.png', options)
              .then((urlImage) => {
                urlImage.set({
                  rx: 40,
                  ry: 40,
                  clipTo(ctx) {
                    ctx.arc(0, 0, 200, 200, Math.PI * 2, true);
                  },
                });

                resolve(urlImage);
              });
          }
        });
      });

    case WidgetType.WBPath:
      // Render the drawing path
      options.lockUniScaling = true;

      // Create a new fabric Path with given options
      widget = new fabric.Path(options.path, options);

      // Return the widget for further usage
      return widget;

    case WidgetType.WBRectNotes:
      // Lock all scaling to the same proportion for rectangle notes
      options.lockUniScaling = true;
      options._forceClearCache = true;
      // Create a new rectangle notes using fabric.js library
      widget = new RectNotes(options.text, options);

      // Check if the last edit was made by Artificial Intelligence (AI)
      if (widget.lastEditedBy === 'AI') {
        // Set widget's author to 'AI'
        widget.author = 'AI';
      }

      // Return the configured widget
      return widget;

    case WidgetType.WBCircleNotes:
      // Lock all scaling to the same proportion for circle notes
      options.lockUniScaling = true;

      // Enable splitting of text by graphemes
      options.splitByGrapheme = true;

      // Create a new circle notes using fabric.js library
      widget = new CircleNotes(options.text, options);

      // Return the newly created widget
      return widget;

    case WidgetType.WBShapeNotes:
      // Lock all scaling to the same proportion for shape notes
      options.lockUniScaling = true;

      // Set text alignment in the center
      options.textAlign = 'center';

      // Enable splitting of text by graphemes
      options.splitByGrapheme = true;

      // Create a new Shape Notes widget using fabric.js library
      widget = new ShapeNotes(options.text, options);

      // Return the newly created widget
      return widget;

    case WidgetType.WBImage:
      // If source for image is empty, exit function
      if (options.src === '' || !options.src) return;

      // Replace 'smallPic/' with 'bigPic/' in source URL
      options.src = options.src.replace('smallPic/', 'bigPic/');

      // Set original width, height and apply lock to uniform scaling
      options.oWidth = options.width;
      options.oHeight = options.height;
      options.lockUniScaling = true;

      // Return a new promise
      return new Promise((resolve, reject) => {
        // Create a new Image object
        const pugImg = new Image();
        pugImg.crossOrigin = 'anonymous';

        pugImg.onload = function (img) {
          // Create a '@/x-canvas/fabric' Image object and set its coords
          const pug = new fabric.Image(pugImg, options);
          pug.setCoords();

          // Resolve the promise with the created image
          resolve(pug);
        };

        // Set the source of the image to be the URL from the function getImageResizedURL
        pugImg.src = getImageResizedURL(
          options,
          store.getState().board.zoomFactor
        );
      });

    case WidgetType.WBGroup:
      // Lock the uniform scaling option to maintain proportional resizing
      options.lockUniScaling = true;

      // Allow rotation of the widget
      options.lockRotation = false;

      // Return a new promise that binds a group
      return new Promise((resolve, reject) => {
        // Bind a group with the specified objects
        self.bindGroup(options.objectArr, (widget) => {
          // Delete the original x-position of the widget
          delete options.originX;

          // Delete the original y-position of the widget
          delete options.originY;

          // Loop through the options
          for (const item in options) {
            // If the widget property is not the same as the corresponding option
            if (widget && widget[item] !== options[item]) {
              // Set the widget property to match the option
              widget.set(item, options[item]);
            }
          }

          // Unlock the rotation of the result widget, in case it has been modified by previous operations
          widget.lockRotation = false;

          // Set the control for rotate and scale at the middle top of object as invisible
          widget.setControlVisible('mtr', false);

          // Complete the promise and return the resulting widget
          resolve(widget);
        });
      });

    case 'WBLine':
      // Lock the uniform scaling option to maintain proportional resizing
      options.lockUniScaling = true;

      // Create a new line widget with the specified coordinates and options
      widget = new fabric.Line(
        [options.x1, options.y1, options.x2, options.y2],
        options
      );

      // Return the newly created line widget
      return widget;

    // Case when the widget type is WBArrow
    case WidgetType.WBArrow:
      // Lock the uniform scaling option to maintain proportional resizing
      options.lockUniScaling = true;

      // Create a new arrow widget with the specified coordinates and options
      widget = new Arrow(
        [options.x1, options.y1, options.x2, options.y2],
        options
      );

      // Return the newly created arrow widget
      return widget;

    // Case when the widget type is WBRect
    case 'WBRect':
      // Create a new rectangle widget with the specified options
      widget = new fabric.Rect(options);

      // Return the newly created rectangle widget
      return widget;

    // Case when the widget type is WBCircle
    case 'WBCircle':
      // Create a new circle widget with the specified options
      widget = new fabric.Circle(options);

      // Return the newly created circle widget
      return widget;

    case 'sticker':
      // Lock the uniform scaling option to maintain proportional resizing
      options.lockUniScaling = true;

      // Return a new promise that creates a sticker
      return new Promise((resolve, reject) => {
        fabric.Image.fromURL(
          // Details of the source of the image
          options.src,
          (img) => {
            HTMLFormControlsCollection.l;
            // Extend the details of the image with the options passed
            _.extend(img, options);

            // Complete the promise and return the image
            resolve(img);
          },
          options
        );
      });

    // Case when the widget type is WBTextbox
    case 'WBTextbox':
      // Split string where the grapheme cluster break is allowed
      options.splitByGrapheme = true;

      // Set the origin of the Textbox widget to its center
      options.originX = 'center';
      options.originY = 'center';

      // Allow user modification on the Textbox widget
      options.locked = false;
      options.editable = true;

      // Allow multiline Textbox widget
      options.oneLine = false;

      // Create a new Textbox widget with the specified text and options
      widget = new Textbox(options.text, options);

      // Return the newly created widget
      return widget;

    // Case when the widget type is WBText
    case 'WBText':
      // Set the origin of the Text widget to its center
      options.originX = 'center';
      options.originY = 'center';

      // Split string where the grapheme cluster break is allowed
      options.splitByGrapheme = true;

      // Allow user modification on the Text widget
      options.editable = true;

      // Allow multiline widget
      options.oneLine = false;

      // Create a new Text widget with the specified text and options
      widget = new Textbox(options.text, options);
      widget.resetResizeControls();
      // Return the newly created widget
      return widget;

    // Case when the widget type is WBFile
    case WidgetType.WBFile:
      // Lock the uniform scaling option to maintain proportional resizing
      options.lockUniScaling = true;

      // Allows images from third-party sites that allow cross-origin access to be used with canvas
      options.crossOrigin = 'anonymous';

      const preImg = new Image();

      // Return a new promise that creates a WBFile
      return new Promise((resolve, reject) => {
        let instance = new WBFile(preImg, options);

        // Create a new file widget from the URL specified in options
        instance.fromURL(options).then((file) => {
          // Complete the promise and return the file
          resolve(file);
        });
      });

    default:
      break;
  }
};

WBCanvas.prototype.renderWidgetAsync = async function (data2, lockByDefault) {
  // Get the id from the data
  const id = data2._id;

  // Reference to the current Canvas Instance
  const self = this;

  // Finds an object with a corresponding id on the canvas
  const existObject = await self.findById(id);

  // Deep clones the data using WidgetService
  const data = WidgetService.getInstance().deepClone(data2);

  // Checks if the object doesn't already exist or if there is no id
  if (!existObject || !id) {
    // Creates a Widget from the data
    const widget = await self.createWidgetAsync(data);

    // If a widget is not created, return
    if (!widget) return;

    // If lockByDefault is set, lock all movements and scaling for the widget
    if (lockByDefault) {
      widget.lockMovementX = true;

      widget.lockMovementY = true;

      widget.lockRotation = true;

      widget.lockScalingX = true;

      widget.lockScalingY = true;

      widget.locked = true;

      widget.dirty = true;
    }

    // If the data has an id, set the widget id with it
    if (data2._id) {
      widget._id = data2._id;
    }

    // Set widget's index as the length of the canvas objects
    widget.index = self._objects.length;

    // Add the widget to the canvas
    self.add(widget);

    // Set anyChanges to true, indicating there has been changes on the canvas
    self.anyChanges = true;

    // Request the canvas to re-render all objects
    self.requestRenderAll();

    // Return the newly created widget
    return widget;
  }

  // If the object already exists, update its properties with new data
  existObject.set(data);

  // Set dirty to true, indicating that the object needs to be re-rendered
  existObject.dirty = true;

  // Set anyChanges to true, indicating there has been changes on the canvas
  self.anyChanges = true;

  // Request the canvas to re-render all objects
  self.requestRenderAll();

  // Return the updated object
  return existObject;
};

WBCanvas.prototype.createWidgetArr = async function (
  idArr,
  widgetArr,
  callback
) {
  // Reference to the current Canvas Instance
  const self = this;

  // If the second parameter is actually the callback function, reset the parameters correctly
  if (typeof widgetArr === 'function') {
    callback = widgetArr;
    widgetArr = [];
  }

  // If the widgetArr is not provided, initialize it as an empty array
  if (!widgetArr) {
    widgetArr = [];
  }

  // If the id array is not provided or is empty, execute the callback with the widget array and end function execution
  if (!idArr || idArr.length === 0) {
    return callback && callback(widgetArr);
  }

  // Remove the first id from the array
  const id = idArr.splice(0, 1)[0];

  // Use the id to find the corresponding widget data
  const data = WidgetService.getInstance().getWidgetFromWidgetList(id);

  // If the widget data exists
  if (data) {
    // If the data type is a 'WBLine' or a 'WBArrow', set initial coordinates
    if (data.obj_type === 'WBLine' || data.obj_type === 'WBArrow') {
      data.initX1 = data.x1;
      data.initX2 = data.x2;
      data.initY1 = data.y1;
      data.initY2 = data.y2;
    } else {
      // Else set initial position
      data.initLeft = data.left;
      data.initTop = data.top;
    }

    // If the data is not locked, explicitly set 'locked' to false
    if (!data.locked) {
      data.locked = false;
    }

    // Lock or unlock movements, rotation and scaling based on 'locked' property
    data.lockMovementX = data.locked;
    data.lockMovementY = data.locked;
    data.lockRotation = data.locked;
    data.lockScalingX = data.locked;
    data.lockScalingY = data.locked;

    // Set controls and borders based on 'locked' property
    data.hasControls = !data.locked;
    data.hasBorders = !data.locked;

    // Set origin to center
    data.originX = 'center';
    data.originY = 'center';

    // Create a widget with the provided data asynchronously
    const widget = await self.createWidgetAsync(data);

    // Add the newly created widget to the widget array
    widgetArr.push(widget);

    // Recursively call the function with updated idArr and widgetArr
    self.createWidgetArr(idArr, widgetArr, callback);
  } else {
    // If no data is found for the id, call the function again recursively (skip this id)
    self.createWidgetArr(idArr, widgetArr, callback);
  }
};

WBCanvas.prototype.renderImageAsync = async function (data, callback) {
  // Define 'this' context for later references
  const self = this;

  // Default setup for a new image object
  const widgetData = {
    obj_type: '',
    scaleX: 0,
    left: 0,
    top: 0,
    scaleY: 0,
    strokeWidth: 0,
    stroke: 0,
    _id: '',
    user_id: '',
  };

  // Variable to store an existing image object
  let existedObj = null;

  // Flag to check if the current user is the creator of the image object
  let isCurrentUser = false;

  // Assign object type from the provided data
  widgetData.obj_type = data.obj_type;

  // Add properties from the provided data into widgetData
  _.extend(widgetData, data);

  // If the object type is not 'WBLine' and not 'WBArrow', set its position and scale
  if (widgetData.obj_type !== 'WBLine' && widgetData.obj_type !== 'WBArrow') {
    if (widgetData.scaleX) {
      widgetData.left = data.left;
      widgetData.scaleX = data.scaleX;
    }

    if (widgetData.scaleY) {
      widgetData.top = data.top;
      widgetData.scaleY = data.scaleY;
    }
  } else if (widgetData.obj_type === 'WBArrow') {
    // If it's a 'WBArrow', set its stroke width and color
    widgetData.strokeWidth = widgetData.strokeWidth
      ? widgetData.strokeWidth
      : data.strokeWidth;
    widgetData.stroke = widgetData.stroke ? widgetData.stroke : data.stroke;
  }

  // Loop through all objects in the canvas
  self &&
    self.forEachObject((obj, index) => {
      // If an object's id matches the new image object's id
      if (obj._id === widgetData._id) {
        // Store the existing object
        existedObj = obj;

        // If the user id matches or if both are null, set the flag to true
        if (
          (widgetData.user_id && widgetData.user_id === null) ||
          (!widgetData.user_id && existedObj.user_id === null)
        ) {
          isCurrentUser = true;
          return false;
        }

        return false;
      }
    });

  // If the flag is true, end this function
  if (isCurrentUser) return;

  // Create a new widget with the data
  const widget = await self.createWidgetAsync(widgetData);

  // Set its index
  widget.index = self._objects.length;

  // Add it to the canvas
  self.add(widget);

  // Render all objects in the canvas
  self.requestRenderAll();

  // Re-order all objects by their zIndex
  self.sortByZIndex();

  // Return the new object
  return widget;
};

WBCanvas.prototype.switchNoteType = async function (objects, type, skipSaving) {
  const self: WBCanvas = this;
  const canvas = self;
  const selectedObj = [];

  if (self.getActiveObject() && self.getActiveObject().isEditing) {
    self.getActiveObject().exitEditing();
  }

  await Util.sleep(200);

  for (const object of objects) {
    if (type === '33') {
      const widget = WidgetService.getInstance().getWidgetFromWidgetList(
        object._id
      );

      widget.obj_type = 'WBRectNotes';

      widget.noteType = 'square';

      widget.text = object.text;

      widget.fontSize = object.fontSize;

      widget.width = 138;

      widget.height = 138;

      widget.maxHeight = 138;

      widget.fontFamily = 'Inter';

      widget.originX = 'center';

      widget.originY = 'center';

      if (
        !widget.backgroundColor ||
        widget.backgroundColor === 'transparent' ||
        widget.backgroundColor === 'rgba(0, 0, 0, 0)'
      ) {
        widget.backgroundColor = '#FCEC8A';
      }

      self.discardActiveObject();

      self.remove(object);

      const objWidget = await self.renderWidgetAsync(widget);

      selectedObj.push(objWidget);
    }

    if (type === '53') {
      const widget = WidgetService.getInstance().getWidgetFromWidgetList(
        object._id
      );

      widget.obj_type = 'WBRectNotes';

      widget.noteType = 'rect';

      widget.text = object.text;

      widget.fontSize = object.fontSize;

      widget.fill = object.fill;

      widget.width = 230;

      widget.height = 138;

      widget.maxHeight = 138;

      widget.fontFamily = 'Inter';

      widget.originX = 'center';

      widget.originY = 'center';

      if (
        !widget.backgroundColor ||
        widget.backgroundColor === 'transparent' ||
        widget.backgroundColor === 'rgba(0, 0, 0, 0)'
      ) {
        widget.backgroundColor = '#FCEC8A';
      }

      self.discardActiveObject();

      self.remove(object);

      const objWidget = await self.renderWidgetAsync(widget);

      selectedObj.push(objWidget);
    }

    if (type === 'circle') {
      const widget = WidgetService.getInstance().getWidgetFromWidgetList(
        object._id
      );

      widget.obj_type = 'WBCircleNotes';

      widget.noteType = 'circle';

      widget.text = object.text;

      widget.fontSize = object.fontSize;

      widget.fill = object.fill;

      widget.width = 138;

      widget.height = 138;

      widget.maxHeight = 138;

      widget.fontFamily = 'Inter';

      widget.originX = 'center';

      widget.originY = 'center';

      if (
        !widget.backgroundColor ||
        widget.backgroundColor === 'transparent' ||
        widget.backgroundColor === 'rgba(0, 0, 0, 0)'
      ) {
        widget.backgroundColor = '#FCEC8A';
      }

      self.discardActiveObject();

      self.remove(object);

      const objWidget = await self.renderWidgetAsync(widget);

      selectedObj.push(objWidget);
    }

    if (type === 'textbox') {
      const widget = WidgetService.getInstance().getWidgetFromWidgetList(
        object._id
      );

      widget.obj_type = 'WBTextbox';

      widget.text = object.text;

      widget.fontSize = object.fontSize;

      self.discardActiveObject();

      self.remove(object);

      const objWidget = await self.renderWidgetAsync(widget);

      selectedObj.push(objWidget);
    }

    if (type === 'text') {
      const widget = WidgetService.getInstance().getWidgetFromWidgetList(
        object._id
      );

      widget.obj_type = 'WBText';

      widget.text = object.text;

      widget.originX = 'center';

      widget.originY = 'center';

      widget.textAlign = 'left';

      widget.fontSize = object.fontSize;

      /* special handling for Roboto */
      if (object.fontFamily === 'Inter') {
        widget.width = object.width + 5;
      }

      if (object.text !== '') {
        widget.backgroundColor = 'transparent';
      } else {
        widget.backgroundColor = '#FCEC8A';
      }

      widget.fill = '#555555';

      self.discardActiveObject();

      self.remove(object);

      const objWidget = await self.renderWidgetAsync(widget);

      selectedObj.push(objWidget);

      canvas.requestRenderAll();
    }
  }

  if (!skipSaving) {
    if (selectedObj && selectedObj.length > 2) {
      const sel = canvas.getActiveSelection();

      sel.add(...selectedObj);

      canvas.setActiveObject(sel);

      canvas.requestRenderAll();

      sel.saveData('MODIFIED', [
        'obj_type',
        'width',
        'height',
        'fill',
        'text',
        'fontsize',
        'originX',
        'originY',
        'type',
        'backgroundColor',
        'fontFamily',
      ]);
    } else {
      const obj = selectedObj[0];

      canvas.setActiveObject(obj);

      canvas.requestRenderAll();

      obj.saveData('MODIFIED', [
        'obj_type',
        'width',
        'height',
        'fill',
        'text',
        'fontsize',
        'originX',
        'originY',
        'left',
        'top',
        'noteType',
        'backgroundColor',
        'fontFamily',
      ]);
    }
  }
};

WBCanvas.prototype.removeWidget = function (target) {
  const self = this;

  const toDeleteWidgetArr = [];

  // If no target is provided, end the function
  if (!target) return;

  // Check if the target is an active selection of objects
  if (target.isActiveSelection()) {
    let newState = [];

    let containLockedObj = false;

    // Look at each object in the selection
    for (const obj of target._objects) {
      // If the object is locked, record it
      if (obj.locked) {
        containLockedObj = true;
      }
    }

    // For every object in the selection
    for (const obj of target._objects) {
      // Get their undo/redo state and add it to our array of new States.
      // Assigning a state of 'REMOVED' to each of them
      newState = newState.concat(obj.getUndoRedoState('REMOVED'));

      // Add the id of the object to the array of widgets to be deleted
      toDeleteWidgetArr.push(obj._id);
    }

    // Push this newState into the fabric.js states for handling undo/redo
    canvas.pushNewState(newState);

    // Remove each of the objects in the selection from canvas
    for (const obj of target._objects) {
      self.remove(obj);
    }

    // Deselect the group of objects, since they've just been removed
    self.discardActiveObject();
  } else {
    // If the target is just a single object, get its undo/redo state as well
    const newState = target.getUndoRedoState('REMOVED');

    // Push this new state to the fabric.js states
    canvas.pushNewState(newState);

    // Remove the single object from the canvas
    self.remove(target);
  }

  // Remove the target from the canvas (again, to ensure removal in case it was missed earlier)
  self.remove(target);

  // Request the canvas to re-render itself, now that objects have been removed
  self.requestRenderAll();
};

WBCanvas.prototype.AddMultipleStickyNoteToBoardByText = async function (text) {
  const newText = text;
  let textArray = newText.split('\n');
  textArray = textArray.filter((item: any) => item !== '');
  let newState = [];
  let newNotes = [];
  const stickyNotes = [];
  let positionOfScreen = canvas.getCenterPointOfScreen();
  let position = canvas.getPositionOnCanvas(
    positionOfScreen.x,
    positionOfScreen.y
  );
  const self = this;
  for (let i = 0; i < textArray.length; i++) {
    const textOfNote = textArray[i];
    let data = {
      _id: UtilityService.getInstance().generateWidgetID(),
      angle: 0,
      backgroundColor: '#d3f4f4',
      width: 230,
      height: 138,
      scaleX: 1,
      scaleY: 1,
      fontSize: 25,
      fontFamily: 'Inter',
      fontWeight: 400,
      originX: 'center',
      originY: 'center',
      left: position.x + i * 245,
      top: position.y,
      selectable: true,
      emoji: [0, 0, 0, 0, 0],
      text: textOfNote,
      textAlign: 'center',
      fill: '#000',
      obj_type: 'WBRectNotes',
      user_id: store.getState().user.userInfo.userId,
      whiteboardId: store.getState().board.board._id,
      timestamp: Date.now(),
      zIndex: Date.now() * 100,
      path: '',
      fixedStrokeWidth: 1,
      icon: 0,
      lineWidth: 0,
      shapeScaleX: 1,
      shapeScaleY: 1,
      lastEditedBy: 'AI',
    };
    const widget = await self.createWidgetAsync(data);
    newState = newState.concat(widget.getUndoRedoState('ADDED'));
    self.add(widget);
    stickyNotes.push(widget);
    newNotes.push(data);
  }
  self.pushNewState(newState);
  await WidgetService.getInstance().insertWidgetArr(newNotes);
  const selectedObject = self.getActiveSelection();
  selectedObject.add(...stickyNotes);
  self.requestRenderAll();
  self.setActiveObject(selectedObject);
};

/**
 * This method is used to modify the properties of the default note on the Fabric.js Canvas.
 *
 * @param {Object} note - An object representing the note with the following properties:
 * - width {Number} - The width of the note
 * - height {Number} - The height of the note
 * - fontSize {Number} - The font size of the note text
 * - fontFamily {String} - The font family of the note text
 * - fontWeight {String} - The weight of the font of the note text
 * - fill {String} - The fill color of the note
 * - textAlign {String} - The alignment of the text in the note
 * - backgroundColor {String} - The background color of the note
 * - scaleX {Number} - The horizontal scaling of the note
 * - scaleY {Number} - The vertical scaling of the note
 * - obj_type {String} - The type of object
 * - isDraw {Boolean} - Whether or not the note is drawn
 * - locked {Boolean} - Whether or not the note's properties are locked and cannot be modified
 */
WBCanvas.prototype.changeDefaulNote = function (note) {
  const self = this;
  const defaultNote = {
    width: note.width,
    height: note.height,
    fontSize: note.fontSize,
    fontFamily: note.fontFamily,
    fontWeight: note.fontWeight,
    fill: note.fill,
    textAlign: note.textAlign,
    backgroundColor: note.backgroundColor,
    scaleX: note.scaleX,
    scaleY: note.scaleY,
    obj_type: note.obj_type,
    isDraw: note.isDraw === undefined ? self.defaultNote.isDraw : note.isDraw,
    locked: note.locked,
    lockMovementX: note.locked,
    lockMovementY: note.locked,
    lockRotation: note.locked,
    lockScalingX: note.locked,
    lockScalingY: note.locked,
  };
  self.defaultNote = defaultNote;
};
