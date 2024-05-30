// import { ActiveSelection } from '../ActiveSelection';

// // import { cursorLock as cursorLockSvg } from './svg/cursorLock';

// ActiveSelection.prototype.cornerStyle = 'circle';

// ActiveSelection.prototype.initialize = function (objects, options = {}) {
//   const refinedObjs = [];

//   objects.forEach((obj) => {
//     if (obj.objType !== 'common' && !obj.locked) refinedObjs.push(obj);
//   });

//   this._objects = refinedObjs || [];

//   for (let i = this._objects.length; i--; ) {
//     this._objects[i].group = this;
//   }

//   this.lockUniScaling = this._objects.length > 1;

//   if (options.originX) {
//     this.originX = options.originX;
//   }

//   if (options.originY) {
//     this.originY = options.originY;
//   }

//   this._updateObjectsCoords();

//   fabric.Object.prototype.initialize.call(this, options);

//   this.setCoords();

//   this.on('modified', (e) => {});

//   this.resetBorderAndControls();
// };

// ActiveSelection.prototype.getContextMenuList = function () {
//   let menuList;

//   const activeSelection = this;

//   if (activeSelection.locked) {
//     menuList = ['Group'];
//   } else {
//     menuList = [
//       'Bring to front',
//       'Send to back',
//       'Group',
//       'Duplicate',
//       'Copy',
//       'Paste',
//       'Cut',
//       'Delete',
//     ];
//   }

//   if (activeSelection._objects.length > 1) {
//     if (activeSelection.locked) {
//       menuList.push('Unlock All');
//     } else {
//       menuList.push('Lock All');
//     }
//   } else if (activeSelection.locked) {
//     menuList.push('Unlock');
//   } else {
//     menuList.push('Lock');
//   }

//   return menuList;
// };

// ActiveSelection.prototype.resetGroupLockedStatus = function () {
//   const activeSelection = this;

//   // const cursorLock = cursorLockSvg;
// };

// ActiveSelection.prototype.resetBorderAndControls = function () {
//   const activeSelection = this;

//   if (activeSelection && activeSelection._objects) {
//     activeSelection.setControlVisible('mtr', false);

//     activeSelection.setControlVisible('mtr2', false);

//     if (activeSelection._objects.length > 0) {
//       activeSelection.setControlVisible('tl', true);
//       activeSelection.setControlVisible('tr', true);
//       activeSelection.setControlVisible('br', true);
//       activeSelection.setControlVisible('bl', true);
//       activeSelection.hasBorders = true;
//     } else {
//       activeSelection.setControlVisible('tl', false);
//       activeSelection.setControlVisible('tr', false);
//       activeSelection.setControlVisible('br', false);
//       activeSelection.setControlVisible('bl', false);
//       activeSelection.hasBorders = false;
//     }

//     activeSelection.setControlVisible('ml', false);
//     activeSelection.setControlVisible('mr', false);
//     activeSelection.setControlVisible('mt', false);
//     activeSelection.setControlVisible('mb', false);
//     activeSelection.setControlVisible('mla', false);
//     activeSelection.setControlVisible('mra', false);
//     activeSelection.setControlVisible('mta', false);
//     activeSelection.setControlVisible('mba', false);
//   }
// };

// ActiveSelection.prototype._updateObjectsCoords = function (center) {
//   const _center = center || this.getCenterPoint();

//   for (let i = this._objects.length; i--; ) {
//     this._updateObjectCoords(this._objects[i], _center);
//   }
// };

// /**
//  * @private
//  * @param {Object} object
//  * @param {fabric.Point} center, current center of group.
//  */
// ActiveSelection.prototype._updateObjectCoords = function (object, center) {
//   let objectLeft = object.left - center.x;

//   let objectTop = object.top - center.y;

//   const skipControls = true;

//   if (Math.abs(objectLeft) < 0.1) objectLeft = 0.1;

//   if (Math.abs(objectTop) < 0.1) objectTop = 0.1;

//   object.set({
//     left: objectLeft,
//     top: objectTop,
//   });

//   object.group = this;

//   object.setCoords(skipControls);
// };

// ActiveSelection.prototype.getCloneWidget = function () {
//   return null;
// };

// ActiveSelection.prototype.bringObjToFront = function () {
//   const obj = this;

//   const ASObjects = obj.sortActiveSelectionObjs();

//   const newIndex = canvas.createTopZIndex();

//   const newZindexArr = canvas.zindexArrBetween(
//     newIndex,
//     newIndex + 99,
//     ASObjects.length
//   );

//   obj.saveUpdatedzIndex(ASObjects, newZindexArr, true);
// };

// ActiveSelection.prototype.sendObjToBack = function () {
//   const obj = this;

//   const ASObjects = obj.sortActiveSelectionObjs();

//   const newIndex = canvas._objects[0].zIndex;

//   const newZindexArr = canvas.zindexArrBetween(
//     newIndex - 200,
//     newIndex - 100,
//     ASObjects.length
//   );

//   obj.saveUpdatedzIndex(ASObjects, newZindexArr, false);
// };

// ActiveSelection.prototype.sortActiveSelectionObjs = function () {
//   const obj = this;

//   const ASObjects = [];

//   for (let i = 0; i < obj._objects.length; i++) {
//     if (obj._objects[i].id) ASObjects.push(obj._objects[i]);
//   }

//   ASObjects.sort((a, b) => b.zIndex - a.zIndex);

//   return ASObjects;
// };

// ActiveSelection.prototype.saveUpdatedzIndex = function (
//   ASObjects,
//   newZindexArr,
//   toFront
// ) {
//   const obj = this;

//   for (let i = 0; i < ASObjects.length; i++) {
//     const asobj = ASObjects[i];

//     if (asobj.panelObj) {
//       /* overlap with frame */
//       const parentPanel = canvas.findById(asobj.panelObj);

//       if (parentPanel) {
//         /* bring front on a frame is to the top on the frame */
//         if (toFront) canvas.toFrameTop(parentPanel, asobj);
//         /* send back on a frame is to the bottom on the frame */
//         if (!toFront) canvas.toFrameBottom(parentPanel, asobj);
//       }
//     } else {
//       asobj.zIndex = newZindexArr[i];
//     }

//     asobj.dirty = true;
//   }

//   canvas.requestRenderAll();

//   canvas.sortByZIndex();

//   obj.saveData('MODIFIED', ['zIndex']);
// };

// ActiveSelection.prototype.getText = function () {
//   if (this.getObjects().length > 1) {
//     const textsArray = canvas.getActiveObjects().map((item) => item.getText());
//     return textsArray.join('/n').trim();
//   }
// };
