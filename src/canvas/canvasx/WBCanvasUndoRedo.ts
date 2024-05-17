/* eslint-disable no-await-in-loop */

//** Fabric */

//** Services */

//** Redux Store */

import { WBCanvas } from '@/x-canvas/canvas';

WBCanvas.prototype.ActionList = {
  SCALED: 'SCALED',
  GROUP: 'GROUP',
  UNGROUP: 'UNGROUP',
  REMOVED: 'REMOVED',
  ADDED: 'ADDED',
  MOVED: 'MOVED',
  BIND: 'BIND',
  UNBIND: 'UNBIND',
  MODIFIED: 'MODIFIED',
  ROTATED: 'ROTATED',
  PASTE: 'PASTE',
};

WBCanvas.prototype.currentHistoryStateIndex = -1;

WBCanvas.prototype.historyState = []; // list of the state

WBCanvas.prototype.redoundoChange = false;

/**
 * if the same item had more than one action clear the unneccesary item
 * modified and deleted record exists at the same time for one widget, delete modified item
 * @param {arrary} stateList
 * @returns
 */
WBCanvas.prototype.cleanData = function (originalStateList) {
  // let stateList = originalStateList;
  // stateList
  //   .filter((obj) => obj.action === "REMOVED")
  //   .forEach((objRemove) => {
  //     for (let i = 0; i < stateList.length; i++) {
  //       if (
  //         stateList[i] &&
  //         objRemove &&
  //         stateList[i].targetId === objRemove.targetId &&
  //         stateList[i].action !== "REMOVED"
  //       ) {
  //         delete stateList[i];
  //       }
  //     }
  //   });
  // stateList = _.compact(stateList);
  // // remove the duplicate record in stateList
  // let uniquestatelist = [];
  // const statelistId = [];
  // for (let i = 0; i < stateList.length; i++) {
  //   statelistId.push(stateList[i].targetId);
  // }
  // for (let i = 0; i < stateList.length; i++) {
  //   if (statelistId.includes(stateList[i].targetId)) {
  //     const j = statelistId.lastIndexOf(stateList[i].targetId);
  //     if (i === j) uniquestatelist.push(stateList[i]);
  //   }
  // }
  // uniquestatelist = _.compact(uniquestatelist);
  // return uniquestatelist;
};

//sync state to remote
WBCanvas.prototype.syncNewState = function (stateItem) {
  // const self = this;
  // const toInsertWidgetArr = [];
  // const toUpdateWidgetArr = [];
  // const toRemoveWidgetArr = [];
  // for (let i = 0; i < stateItem.length; i += 1) {
  //   const state = stateItem[i];
  //   const { action } = state;
  //   let toUpdate;
  //   switch (action) {
  //     case self.ActionList.PASTE:
  //     case self.ActionList.ADDED:
  //       self.syncNewObjectToRemote(state.newState);
  //       WidgetService.getInstance().insertWidgetToLocalWidget(state.newState);
  //       break;
  //     case self.ActionList.REMOVED:
  //       toRemoveWidgetArr.push(state.targetId);
  //       self.syncRemovedObjectToRemote(state.targetId);
  //       WidgetService.getInstance().removeWidgetFromLocalWidget(state.targetId);
  //       break;
  //     case self.ActionList.SCALED:
  //     case self.ActionList.MOVED:
  //     case self.ActionList.ROTATED:
  //     case self.ActionList.MODIFIED:
  //     case self.ActionList.UNBIND:
  //     case self.ActionList.BIND:
  //       toUpdate = state.newState;
  //       toUpdate._id = state.targetId;
  //       toUpdate.lastEditedBy = store.getState().user.userInfo.userId;
  //       toUpdateWidgetArr.push(toUpdate);
  //       self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //       WidgetService.getInstance().updateWidgetFromLocalWidget(
  //         toUpdate._id,
  //         toUpdate
  //       );
  //       break;
  //     default:
  //       break;
  //   }
  // }
  // if (toInsertWidgetArr.length > 0) {
  //   WidgetService.getInstance().insertWidgetArr(toInsertWidgetArr);
  //   const sel = canvas.getActiveSelection();
  //   sel.add(...toInsertWidgetArr);
  //   canvas.setActiveObject(sel);
  //   const currentWidget = canvas.getActiveObject();
  //   if (currentWidget.isActiveSelection()) {
  //     currentWidget._objects.forEach((obj) => {
  //       if (obj.obj_type === "WBArrow") {
  //         let startObj = obj.connectorStart;
  //         let endObj = obj.connectorEnd;
  //         if (startObj) {
  //           startObj = canvas.findById(startObj._id);
  //           if (startObj.lines.indexOf(obj._id) === -1) {
  //             startObj.lines.push({ _id: obj._id });
  //             startObj.dirty = true;
  //           }
  //         }
  //         if (endObj) {
  //           endObj = canvas.findById(endObj._id);
  //           if (endObj.lines.indexOf(obj._id) === -1) {
  //             endObj.lines.push({ _id: obj._id });
  //             endObj.dirty = true;
  //           }
  //         }
  //       }
  //     });
  //     canvas.requestRenderAll();
  //   }
  // }
  // if (toRemoveWidgetArr.length > 0) {
  //   WidgetService.getInstance().removeWidgetArr(toRemoveWidgetArr);
  // }
  // if (toUpdateWidgetArr.length > 0) {
  //   if (toUpdateWidgetArr[0]._id) {
  //     WidgetService.getInstance().updateWidgetArr(toUpdateWidgetArr);
  //   }
  // }
};

/** *
 * Push the new State to the undo redo stack
 * newState, _id, action, originalState, newState
 *
 */
WBCanvas.prototype.pushNewState = function (newStatet) {
  // const self = this;
  // // 清理新的状态数据
  // const newState = self.cleanData(newStatet);
  // // 同步新的状态
  // self.syncNewState(newState);
  // // 设置有更改标识
  // self.anyChanges = true;
  // // 如果当前历史状态的index小于历史状态列表的长度减一
  // if (self.currentHistoryStateIndex < self.historyState.length - 1) {
  //   const len = self.historyState.length;
  //   // 从历史状态列表的尾部开始，删除和当前历史状态的index的差数值的个数
  //   for (let i = 0; i < len - 1 - self.currentHistoryStateIndex; ++i) {
  //     self.historyState.pop();
  //   }
  // }
  // // 将新的状态添加到历史状态列表
  // self.historyState.push(newState);
  // // 设置当前历史状态的index为历史状态列表长度减一
  // self.currentHistoryStateIndex = self.historyState.length - 1;
  // // 如果历史状态列表的长度大于1000，从历史状态列表头部开始，循环删除状态，直到历史状态列表的长度等于1000
  // while (self.historyState.length > 1000) {
  //   self.historyState.shift();
  //   --self.currentHistoryStateIndex;
  // }
  // // 更新撤销和重做的状态
  // self.updateUndoRedoStatus();
};

WBCanvas.prototype.undo = async function () {
  //   const self = this;
  //   const asObjArr = [];
  //   // undo stack is empty, exit
  //   if (self.currentHistoryStateIndex < 0) return;
  //   if (self.historyState.length === 0) {
  //     self.currentHistoryStateIndex = -1;
  //     self.updateUndoRedoStatus();
  //     return;
  //   }
  //   const undoIndex = self.currentHistoryStateIndex;
  //   const stateItem = self.historyState[undoIndex];
  //   const toInsertWidgetArr = [];
  //   const toUpdateWidgetArr = [];
  //   const toRemoveWidgetArr = [];
  //   for (let i = 0; i < stateItem.length; i++) {
  //     const state = stateItem[i];
  //     const { action } = state;
  //     if (action === self.ActionList.SCALED) {
  //       self.discardActiveObject();
  //       const toUpdate = state.originalState;
  //       toUpdate._id = state.targetId;
  //       if (state.activeselection) {
  //         asObjArr.push(canvas.findById(toUpdate._id));
  //       }
  //       self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //       toUpdateWidgetArr.push(toUpdate);
  //       self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //       if (self.getObjectByID(state.targetId)) {
  //         self.getObjectByID(state.targetId).set(state.originalState).setCoords();
  //       }
  //       self.requestRenderAll();
  //     }
  //     if (action === self.ActionList.UNBIND) {
  //       self.discardActiveObject();
  //       const toUpdate = state.originalState;
  //       const bindFrameId = state.originalState.panelObj;
  //       toUpdate._id = state.targetId;
  //       const subObj = canvas.findById(toUpdate._id);
  //       const panelObj = canvas.findById(bindFrameId);
  //       self.syncPanelSubobjstoDBnRemoteUndoRedo(bindFrameId, subObj, true);
  //       panelObj.subObjs[state.targetId] = true;
  //       toUpdateWidgetArr.push(toUpdate);
  //       if (state.activeselection) {
  //         asObjArr.push(canvas.findById(toUpdate._id));
  //       }
  //       self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //       if (self.getObjectByID(state.targetId)) {
  //         self.getObjectByID(state.targetId).set(state.originalState).setCoords();
  //         self.getObjectByID(state.targetId).set("dirty", true);
  //       }
  //       if (state.originalState.zIndex) {
  //         self.sortByZIndex();
  //       }
  //       WidgetService.getInstance().updateWidgetFromLocalWidget(
  //         toUpdate._id,
  //         toUpdate
  //       );
  //       self.requestRenderAll();
  //     }
  //     if (action === self.ActionList.BIND) {
  //       self.discardActiveObject();
  //       const toUpdate = state.originalState;
  //       const unbindFrameId = state.newState.panelObj;
  //       const bindFrameId = state.originalState.panelObj;
  //       toUpdate._id = state.targetId;
  //       const subObj = canvas.findById(toUpdate._id);
  //       if (unbindFrameId) {
  //         self.syncPanelSubobjstoDBnRemoteUndoRedo(unbindFrameId, subObj, false);
  //         const unpanelObj = canvas.findById(unbindFrameId);
  //         unpanelObj.subObjs[state.targetId] = false;
  //       }
  //       if (bindFrameId) {
  //         self.syncPanelSubobjstoDBnRemoteUndoRedo(bindFrameId, subObj, true);
  //         const panelObj = canvas.findById(bindFrameId);
  //         panelObj.subObjs[state.targetId] = true;
  //       }
  //       toUpdateWidgetArr.push(toUpdate);
  //       if (state.activeselection) {
  //         asObjArr.push(canvas.findById(toUpdate._id));
  //       }
  //       self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //       if (self.getObjectByID(state.targetId)) {
  //         self.getObjectByID(state.targetId).set(state.originalState).setCoords();
  //         self.getObjectByID(state.targetId).set("dirty", true);
  //       }
  //       if (state.originalState.zIndex) {
  //         self.sortByZIndex();
  //       }
  //       WidgetService.getInstance().updateWidgetFromLocalWidget(
  //         toUpdate._id,
  //         toUpdate
  //       );
  //       self.requestRenderAll();
  //     }
  //     if (action === self.ActionList.REMOVED) {
  //       toInsertWidgetArr.push(state.originalState);
  //       WidgetService.getInstance().insertWidgetToLocalWidget(
  //         state.originalState
  //       );
  //       self.syncNewObjectToRemote(state.originalState);
  //       const newwidget = await self.renderWidgetAsync(state.originalState);
  //       if (newwidget && state.activeselection) {
  //         asObjArr.push(canvas.findById(newwidget._id));
  //       }
  //       if (self.getObjectByID(state.targetId)) {
  //         self.getObjectByID(state.targetId).setCoords();
  //       }
  //       self.requestRenderAll();
  //     }
  //     if (action === self.ActionList.ADDED) {
  //       toRemoveWidgetArr.push(state.targetId);
  //       self.remove(self.getObjectByID(state.targetId));
  //       self.discardActiveObject();
  //       self.syncRemovedObjectToRemote(state.targetId);
  //     }
  //     if (action === self.ActionList.PASTE) {
  //       toRemoveWidgetArr.push(state.targetId);
  //       self.remove(self.getObjectByID(state.targetId));
  //       self.discardActiveObject();
  //       self.syncRemovedObjectToRemote(state.targetId);
  //     }
  //     if (action === self.ActionList.MOVED) {
  //       self.discardActiveObject();
  //       const toUpdate = state.originalState;
  //       toUpdate._id = state.targetId;
  //       if (state.activeselection) {
  //         asObjArr.push(canvas.findById(toUpdate._id));
  //       }
  //       toUpdateWidgetArr.push(toUpdate);
  //       self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //       if (self.getObjectByID(state.targetId)) {
  //         self.getObjectByID(state.targetId).set(state.originalState).setCoords();
  //         self.getObjectByID(state.targetId).set("dirty", true);
  //       }
  //       WidgetService.getInstance().updateWidgetFromLocalWidget(
  //         toUpdate._id,
  //         toUpdate
  //       );
  //       self.requestRenderAll();
  //     }
  //     if (action === self.ActionList.ROTATED) {
  //       self.discardActiveObject();
  //       const toUpdate = state.originalState;
  //       toUpdate._id = state.targetId;
  //       if (state.activeselection) {
  //         asObjArr.push(canvas.findById(toUpdate._id));
  //       }
  //       toUpdateWidgetArr.push(toUpdate);
  //       self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //       if (self.getObjectByID(state.targetId)) {
  //         self.getObjectByID(state.targetId).set(state.originalState).setCoords();
  //         self.getObjectByID(state.targetId).set("dirty", true);
  //       }
  //       WidgetService.getInstance().updateWidgetFromLocalWidget(
  //         toUpdate._id,
  //         toUpdate
  //       );
  //       self.requestRenderAll();
  //     }
  //     if (action === self.ActionList.MODIFIED) {
  //       self.discardActiveObject();
  //       const toUpdate = state.originalState;
  //       toUpdate._id = state.targetId;
  //       toUpdateWidgetArr.push(toUpdate);
  //       if (state.activeselection) {
  //         asObjArr.push(canvas.findById(toUpdate._id));
  //       }
  //       self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //       if (self.getObjectByID(state.targetId)) {
  //         self.getObjectByID(state.targetId).set(state.originalState).setCoords();
  //         self.getObjectByID(state.targetId).set("dirty", true);
  //       }
  //       if (state.originalState.zIndex) {
  //         self.sortByZIndex();
  //       }
  //       WidgetService.getInstance().updateWidgetFromLocalWidget(
  //         toUpdate._id,
  //         toUpdate
  //       );
  //       const tempObject = canvas.findById(state.targetId);
  //       if (toUpdate.obj_type !== undefined) {
  //         const type = getNoteType(toUpdate.obj_type, tempObject.width);
  //         canvas.switchNoteType([tempObject], type, true);
  //       }
  //       self.requestRenderAll();
  //     }
  //   }
  //   if (toInsertWidgetArr.length > 0) {
  //     const insertDataList = [];
  //     toInsertWidgetArr.forEach((data) => {
  //       if (data.isGroup()) {
  //         insertDataList.push(data.getObject());
  //       } else {
  //         insertDataList.push(data.toObject());
  //       }
  //     });
  //     WidgetService.getInstance().insertWidgetArr(insertDataList);
  //     const sel = canvas.getActiveSelection();
  //     sel.add(...toInsertWidgetArr);
  //     canvas.setActiveObject(sel);
  //     const currentWidget = canvas.getActiveObject();
  //     if (currentWidget.isActiveSelection()) {
  //       currentWidget._objects.forEach((obj) => {
  //         if (obj.obj_type === "WBArrow") {
  //           let startObj = obj.connectorStart;
  //           let endObj = obj.connectorEnd;
  //           if (startObj) {
  //             startObj = canvas.findById(startObj._id);
  //             if (startObj.lines.indexOf(obj._id) === -1) {
  //               startObj.lines.push({ _id: obj._id });
  //               startObj.dirty = true;
  //             }
  //           }
  //           if (endObj) {
  //             endObj = canvas.findById(endObj._id);
  //             if (endObj.lines.indexOf(obj._id) === -1) {
  //               endObj.lines.push({ _id: obj._id });
  //               endObj.dirty = true;
  //             }
  //           }
  //         }
  //       });
  //       canvas.requestRenderAll();
  //     }
  //   }
  //   if (toRemoveWidgetArr.length > 0) {
  //     WidgetService.getInstance().removeWidgetArr(toRemoveWidgetArr);
  //   }
  //   if (toUpdateWidgetArr.length > 0) {
  //     WidgetService.getInstance().updateWidgetArr(toUpdateWidgetArr);
  //   }
  //   if (asObjArr.length === 1) {
  //     self.discardActiveObject();
  //     if (asObjArr[0]) canvas.setActiveObject(asObjArr[0]);
  //   } else if (asObjArr.length > 1) {
  //     self.discardActiveObject();
  //     const activeSelection = asObjArr;
  //     const sel = canvas.getActiveSelection();
  //     sel.add(...activeSelection);
  //     if (sel) {
  //       canvas.setActiveObject(sel);
  //     }
  //   }
  //   --self.currentHistoryStateIndex;
  //   self.anyChanges = true;
  //   self.updateUndoRedoStatus();
  //   this.requestRenderAll();
};

WBCanvas.prototype.updateUndoRedoStatus = function () {
  // const self = this;
  // const index = self.currentHistoryStateIndex;
  // const { length } = self.historyState;
  // if (index === -1) {
  //   store.dispatch(handleSetUndoAvailable(false));
  // } else {
  //   store.dispatch(handleSetUndoAvailable(true));
  // }
  // if (index === length - 1) {
  //   store.dispatch(handleSetRedoAvailable(false));
  // } else {
  //   store.dispatch(handleSetRedoAvailable(true));
  // }
};

WBCanvas.prototype.resetUndoRedoStatus = function () {
  //   // const self = this;
  //   // self.historyState.length = 0;
  //   // self.updateUndoRedoStatus();
  // };
  // WBCanvas.prototype.updateUndoRedoStackAccordingtoRemoteChange = function (
  //   id
  // ) {
  //   // if the id is in redo/undo stack,
  //   // remove it from the stack,remove the count from the current stateIndex
  //   let countOfState = 0;
  //   const self = this;
  //   for (let index = 0; index <= self.currentHistoryStateIndex; index++) {
  //     const objects = self.historyState[index];
  //     for (let objIndex = 0; objIndex < objects.length; objIndex += 1) {
  //       if (objects[objIndex].targetId === id) {
  //         countOfState++;
  //       }
  //     }
  //   }
  //   self.historyState = self.historyState.filter((o) => {
  //     let count = 0;
  //     o.forEach((obj) => {
  //       if (obj.targetId === id) {
  //         ++count;
  //       }
  //     });
  //     return count === 0;
  //   });
  //   self.currentHistoryStateIndex -= countOfState;
  //   self.updateUndoRedoStatus();
};

// redo function
WBCanvas.prototype.redo = async function () {
  // const self = this;
  // const asObjArr = [];
  // if (self.historyState.length === 0) {
  //   self.currentHistoryStateIndex = -1;
  //   self.updateUndoRedoStatus();
  //   return;
  // }
  // if (self.currentHistoryStateIndex > self.historyState.length - 2) return;
  // ++self.currentHistoryStateIndex;
  // const redoIndex = self.currentHistoryStateIndex;
  // const stateItem = self.historyState[redoIndex];
  // const toInsertWidgetArr = [];
  // const toUpdateWidgetArr = [];
  // const toRemoveWidgetArr = [];
  // self.discardActiveObject();
  // for (let i = 0; i < stateItem.length; i += 1) {
  //   const state = stateItem[i];
  //   const { action } = state;
  //   if (action === self.ActionList.REMOVED) {
  //     toRemoveWidgetArr.push(state.targetId);
  //     canvas.remove(canvas.findById(state.targetId));
  //     WidgetService.getInstance().removeWidgetFromLocalWidget(state.targetId);
  //     self.syncRemovedObjectToRemote(state.targetId);
  //   }
  //   if (action === self.ActionList.ADDED) {
  //     toInsertWidgetArr.push(state.newState);
  //     const newwidget = await self.renderWidgetAsync(state.newState);
  //     self.syncNewObjectToRemote(state.newState);
  //     if (newwidget && state.activeselection) {
  //       asObjArr.push(canvas.findById(newwidget._id));
  //     }
  //   }
  //   if (action === self.ActionList.PASTE) {
  //     toInsertWidgetArr.push(state.newState);
  //     const newwidget = await self.renderWidgetAsync(state.newState);
  //     self.syncNewObjectToRemote(state.newState);
  //     if (newwidget && state.activeselection) {
  //       asObjArr.push(canvas.findById(newwidget._id));
  //     }
  //   }
  //   if (action === self.ActionList.UNBIND) {
  //     const toUpdate = state.newState;
  //     const unbindFrameId = state.newState.panelObj;
  //     toUpdate._id = state.targetId;
  //     const subObj = canvas.findById(toUpdate._id);
  //     const panelObj = canvas.findById(unbindFrameId);
  //     self.syncPanelSubobjstoDBnRemoteUndoRedo(unbindFrameId, subObj, false);
  //     panelObj.subObjs[state.targetId] = false;
  //     toUpdateWidgetArr.push(toUpdate);
  //     if (state.activeselection) {
  //       asObjArr.push(canvas.findById(toUpdate._id));
  //     }
  //     self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //     if (self.getObjectByID(state.targetId)) {
  //       self.getObjectByID(state.targetId).set(state.newState).setCoords();
  //       self.getObjectByID(state.targetId).set("dirty", true);
  //     }
  //     if (state.newState.zIndex) {
  //       self.sortByZIndex();
  //     }
  //     WidgetService.getInstance().updateWidgetFromLocalWidget(
  //       toUpdate._id,
  //       toUpdate
  //     );
  //     self.requestRenderAll();
  //   }
  //   if (action === self.ActionList.BIND) {
  //     const toUpdate = state.newState;
  //     const unbindFrameId = state.originalState.panelObj;
  //     const bindFrameId = state.newState.panelObj;
  //     toUpdate._id = state.targetId;
  //     const subObj = canvas.findById(toUpdate._id);
  //     if (unbindFrameId) {
  //       self.syncPanelSubobjstoDBnRemoteUndoRedo(unbindFrameId, subObj, false);
  //       const unpanelObj = canvas.findById(unbindFrameId);
  //       unpanelObj.subObjs[state.targetId] = false;
  //     }
  //     if (bindFrameId) {
  //       self.syncPanelSubobjstoDBnRemoteUndoRedo(bindFrameId, subObj, true);
  //       const panelObj = canvas.findById(bindFrameId);
  //       panelObj.subObjs[state.targetId] = true;
  //     }
  //     toUpdateWidgetArr.push(toUpdate);
  //     if (state.activeselection) {
  //       asObjArr.push(canvas.findById(toUpdate._id));
  //     }
  //     self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //     if (self.getObjectByID(state.targetId)) {
  //       self.getObjectByID(state.targetId).set(state.newState).setCoords();
  //       self.getObjectByID(state.targetId).set("dirty", true);
  //     }
  //     if (state.newState.zIndex) {
  //       self.sortByZIndex();
  //     }
  //     WidgetService.getInstance().updateWidgetFromLocalWidget(
  //       toUpdate._id,
  //       toUpdate
  //     );
  //     self.requestRenderAll();
  //   }
  //   if (action === self.ActionList.MODIFIED) {
  //     const toUpdate = state.newState;
  //     toUpdate._id = state.targetId;
  //     toUpdateWidgetArr.push(toUpdate);
  //     if (state.activeselection) {
  //       asObjArr.push(canvas.findById(toUpdate._id));
  //     }
  //     self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //     const targetObject = self.getObjectByID(state.targetId);
  //     if (targetObject) {
  //       targetObject.set(state.newState);
  //       targetObject.set("dirty", true);
  //     }
  //     if (state.newState.zIndex) {
  //       self.sortByZIndex();
  //     }
  //     WidgetService.getInstance().updateWidgetFromLocalWidget(
  //       toUpdate._id,
  //       toUpdate
  //     );
  //     const tempObject = canvas.findById(toUpdate._id);
  //     if (tempObject && toUpdate.obj_type !== undefined) {
  //       const type = getNoteType(toUpdate.obj_type, tempObject.width);
  //       canvas.switchNoteType([tempObject], type, true);
  //     }
  //   }
  //   if (action === self.ActionList.MOVED) {
  //     const toUpdate = state.newState;
  //     toUpdate._id = state.targetId;
  //     toUpdateWidgetArr.push(toUpdate);
  //     if (state.activeselection) {
  //       asObjArr.push(canvas.findById(toUpdate._id));
  //     }
  //     self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //     if (self.getObjectByID(state.targetId)) {
  //       self.getObjectByID(state.targetId).set(state.newState);
  //       self.getObjectByID(state.targetId).set("dirty", true);
  //     }
  //     WidgetService.getInstance().updateWidgetFromLocalWidget(
  //       toUpdate._id,
  //       toUpdate
  //     );
  //   }
  //   if (action === self.ActionList.ROTATED) {
  //     const toUpdate = state.newState;
  //     toUpdate._id = state.targetId;
  //     toUpdateWidgetArr.push(toUpdate);
  //     if (state.activeselection) {
  //       asObjArr.push(canvas.findById(toUpdate._id));
  //     }
  //     self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //     if (self.getObjectByID(state.targetId)) {
  //       self.getObjectByID(state.targetId).set(state.newState);
  //       self.getObjectByID(state.targetId).set("dirty", true);
  //     }
  //     WidgetService.getInstance().updateWidgetFromLocalWidget(
  //       toUpdate._id,
  //       toUpdate
  //     );
  //   }
  //   if (action === self.ActionList.SCALED) {
  //     const toUpdate = state.newState;
  //     toUpdate._id = state.targetId;
  //     toUpdateWidgetArr.push(toUpdate);
  //     if (state.activeselection) {
  //       asObjArr.push(canvas.findById(toUpdate._id));
  //     }
  //     self.syncObjectChangeToRemote(toUpdate._id, toUpdate);
  //     if (self.getObjectByID(state.targetId)) {
  //       self.getObjectByID(state.targetId).set(state.newState);
  //       self.getObjectByID(state.targetId).set("dirty", true);
  //     }
  //     WidgetService.getInstance().updateWidgetFromLocalWidget(
  //       toUpdate._id,
  //       toUpdate
  //     );
  //   }
  // }
  // if (toInsertWidgetArr.length > 0) {
  //   WidgetService.getInstance().insertWidgetArr(toInsertWidgetArr);
  // }
  // if (toRemoveWidgetArr.length > 0) {
  //   WidgetService.getInstance().removeWidgetArr(toRemoveWidgetArr);
  // }
  // if (toUpdateWidgetArr.length > 0) {
  //   WidgetService.getInstance().updateWidgetArr(toUpdateWidgetArr);
  // }
  // if (asObjArr.length === 1) {
  //   self.discardActiveObject();
  //   if (asObjArr[0]) {
  //     canvas.setActiveObject(asObjArr[0]);
  //   }
  // } else if (asObjArr.length > 1) {
  //   self.discardActiveObject();
  //   const activeSelection = asObjArr;
  //   const sel = canvas.getActiveSelection();
  //   sel.add(...activeSelection);
  //   if (sel) {
  //     canvas.setActiveObject(sel);
  //   }
  // }
  // self.anyChanges = true;
  // self.updateUndoRedoStatus();
  // self.requestRenderAll();
};

function getNoteType(type, width) {
  // if (type === "WBText") return "text";
  // if (type === "WBCircleNotes") return "circle";
  // if (type === "WBRectNotes" && width === 230) return "53";
  // if (type === "WBRectNotes" && width === 138) return "33";
}
