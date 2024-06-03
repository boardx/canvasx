import store from '../redux/store';
// import { WidgetAPI } from "../redux/services/widget.api";
// import server from "../startup/serverConnect";
import { handleSetUpdatingBoard } from '../redux/features/board.slice';

// window.api = api;

export default class WidgetService {
  public _localWidget: any;
  static service: WidgetService;
  static getInstance() {
    if (WidgetService.service == null) {
      WidgetService.service = new WidgetService();
    }

    return WidgetService.service;
  }

  getLocalWidget() {
    return this._localWidget;
  }

  /**
   * Retrieves a list of widgets associated with the current board from the application's state.
   * @returns {array} - An array containing the list of widgets, or an empty array if the data is not cached.
   */
  getWidgetList() {
    // Get the current state of the application using the store.
    const storeState = store.getState();

    // Construct a key to identify the cached data based on the current board's ID.
    const cacheKey = 'getWidgetsByBoardId("' + storeState.board.boardId + '")';

    // Retrieve the cached data associated with the constructed key.
    const cachedData = storeState.splitApi.queries[cacheKey];

    // Check if cached data exists and contains widget information.
    if (!cachedData || !cachedData.data) {
      // Return an empty array if no cached data is found.
      return [];
    }

    // Return the array of widgets from the cached data.
    return cachedData.data;
  }

  /**
   * Retrieves a specific widget from a list of widgets by its unique widget ID.
   * @param {string} widgetId - The ID of the widget to retrieve.
   * @returns {object|null} - The retrieved widget object or null if not found.
   */
  getWidgetFromWidgetList(widgetId: any) {
    // Get the list of widgets from the local cache.
    //const localWidgets = this.getWidgetList();
    const localWidgets: any = this.getWidgetList();
    // Find the widget with the specified widgetId in the list.
    const returnWidget = localWidgets.find(
      (widget: any) => widget.id === widgetId
    );

    // Deep clone the retrieved widget to ensure it's not a reference.
    let deepClone = this.deepClone(returnWidget);

    return deepClone;
  }

  /**
   * Creates a deep clone of an object.
   * @param {object} obj - The object to be cloned.
   * @returns {object} - A deep clone of the input object.
   */
  deepClone(obj: any) {
    // Check if the input object is falsy (null, undefined, etc.), and return it as is.
    if (!obj) return obj;

    // Convert the object to a JSON string and then parse it back into an object.
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Removes a widget with the specified ID from the local widget cache in the application's state.
   * @param {string} id - The ID of the widget to remove.
   */
  removeWidgetFromLocalWidget(id: any) {
    // Dispatch an action to update the query data associated with 'getWidgetsByBoardId'.
    // store.dispatch(
    //   api.util.updateQueryData(
    //     "getWidgetsByBoardId", // The name of the query to update.
    //     store.getState().board.board.id, // The board ID used as a query parameter.
    //     (draft) => {
    //       // Iterate through the cached widgets in the draft.
    //       for (let i = 0; i < draft.length; i++) {
    //         if (draft[i].id === id) {
    //           // If a widget with the specified ID is found, remove it from the draft.
    //           draft.splice(i, 1);
    //           break; // Exit the loop since the widget has been removed.
    //         }
    //       }
    //     }
    //   )
    // );
  }

  /**
   * Inserts a new widget into the local widget cache in the application's state.
   * @param {object} widget - The widget object to insert.
   */
  insertWidgetToLocalWidget(widget: any) {
    // // Dispatch an action to update the query data associated with 'getWidgetsByBoardId'.
    // store.dispatch(
    //   api.util.updateQueryData(
    //     "getWidgetsByBoardId",
    //     store.getState().board.board.id,
    //     (draft) => {
    //       // Push the new widget into the draft, effectively adding it to the cache.
    //       draft?.push(widget);
    //     }
    //   )
    // );
  }

  /**
   * Updates a widget with the specified ID in the local widget cache in the application's state.
   * @param {string} id - The ID of the widget to update.
   * @param {object} data - The updated data to apply to the widget.
   */
  updateWidgetFromLocalWidget(id: any, data: any) {
    // // Dispatch an action to update the query data associated with 'getWidgetsByBoardId'.
    // store.dispatch(
    //   api.util.updateQueryData(
    //     "getWidgetsByBoardId",
    //     store.getState().board.board.id,
    //     (draft) => {
    //       // Find the index of the widget with the specified ID in the draft.
    //       const index = draft.findIndex((widget) => widget.id === id);
    //       // Check if the widget with the specified ID was found.
    //       if (index > -1) {
    //         // Merge the existing widget data with the updated data.
    //         Object.assign(draft[index], {
    //           ...draft[index],
    //           ...this.deepClone(data),
    //         });
    //       }
    //     }
    //   )
    // );
  }

  /**
   * Updates a widget with the specified ID and new data.
   * @param {string} id - The ID of the widget to update.
   * @param {object} data - The new data to apply to the widget.
   */
  async updateWidget(id: any, data: any) {
    // Check if the ID is undefined or if the data is empty or falsy.
    if (id === undefined || JSON.stringify(data) === '{}' || !data) {
      return;
    }
    store.dispatch(handleSetUpdatingBoard(1));
    // Get the user's session ID and append it to the userNo field in the data.
    const userno = store.getState().user.userInfo.userNo;
    data.userNo = userno;

    // Append the boardId field to the data.
    data.boardId = store.getState().board.board.id;

    // If the data contains an image source with ';base64', remove it to avoid unnecessary updates.
    if (data.imageSrc && data.imageSrc.indexOf(';base64') > -1)
      delete data.imageSrc;

    // Dispatch an action to update the widget with the specified ID and data.
    // await store.dispatch(
    //   WidgetAPI.endpoints.updateWidget.initiate({ id: id, data: data })
    // );
    store.dispatch(handleSetUpdatingBoard(-1));
  }

  /**
   * Updates an array of widgets with new data.
   * @param {Array} dataArr - An array of objects containing the new data for each widget.
   * @returns {Promise} - A promise that resolves when the update operation is complete.
   */
  updateWidgetArr(dataArr: any) {
    // store.dispatch(handleSetUpdatingBoard(1));
    // // Iterate through the dataArr and update each widget.
    // dataArr.forEach((data:any) => {
    //   const id = data;
    //   if (id == undefined || JSON.stringify(data) === "{}" || !data) {
    //     return;
    //   }
    //   // Get the user's session ID and append it to the userNo field in the data.
    //   const userno = store.getState().user.userInfo.userNo;
    //   data.userNo = userno;
    //   // Append the boardId field to the data.
    //   data.boardId = store.getState().board.board.id;
    //   // If the data contains an image source with ';base64', remove it to avoid unnecessary updates.
    //   if (data.imageSrc && data.imageSrc.indexOf(";base64") > -1)
    //     delete data.imageSrc;
    // });
    // // Return a Promise that dispatches an action to update the widgets with the specified dataArr.
    // return new Promise((resolve, reject) => {
    //   store
    //     .dispatch(
    //       WidgetAPI.endpoints.updateWidgetArr.initiate({ dataArr: dataArr })
    //     )
    //     .then((res:any) => {
    //       store.dispatch(handleSetUpdatingBoard(-1));
    //       resolve(res);
    //     })
    //     .catch((err:any) => {
    //       store.dispatch(handleSetUpdatingBoard(-1));
    //       reject(err);
    //     });
    // });
  }

  /**
   * Inserts a new widget with the provided data.
   * @param {object} data - The data for the new widget.
   * @returns {Promise} - A promise that resolves when the insertion is complete.
   */
  insertWidget(data: any) {
    // store.dispatch(handleSetUpdatingBoard(1));
    // // Get the user's session ID and append it to the userNo field in the data.
    // const userno = store.getState().user.userInfo.userNo;
    // data.userNo = userno;
    // // Check if the data contains an 'src' field with '?x-oss-process' and remove it if present.
    // if (data.src && data.src.indexOf("?x-oss-process") > -1) {
    //   data.src = data.src.split("?x-oss")[0];
    // }
    // // Return a Promise that dispatches an action to insert the widget with the specified data.
    // return new Promise((resolve, reject) => {
    //   store
    //     .dispatch(WidgetAPI.endpoints.insertWidget.initiate({ data: data }))
    //     .then((res:any) => {
    //       store.dispatch(handleSetUpdatingBoard(-1));
    //       resolve(res);
    //     })
    //     .catch((err:any) => {
    //       store.dispatch(handleSetUpdatingBoard(-1));
    //       reject(err);
    //     });
    // });
  }

  /**
   * Inserts an array of widgets with the provided data.
   * @param {Array} data - An array of objects containing data for each widget.
   */
  insertWidgetArr(data: any) {
    // store.dispatch(handleSetUpdatingBoard(1));
    // // Iterate through the data array and modify each widget's 'src' field if it contains '?x-oss-process', removing it if present.
    // data.forEach((d) => {
    //   if (d.src && d.src.indexOf("?x-oss-process") > -1) {
    //     d.src = d.src.split("?x-oss")[0];
    //   }
    // });
    // // Use a DDP method named 'insertWidgetArr' to insert the array of widgets on the server-side.
    // server
    //   .call("insertWidgetArr", data)
    //   .then((res:any) => {
    //     store.dispatch(handleSetUpdatingBoard(-1));
    //     return res;
    //   })
    //   .catch((err:any) => {
    //     store.dispatch(handleSetUpdatingBoard(-1));
    //     console.log(err);
    //   });
  }

  /**
   * Removes a widget with the specified 'id'.
   * @param {string} id - The unique identifier of the widget to be removed.
   */
  removeWidget(id: any) {
    // Dispatch a Redux action to initiate the removal of the widget.
    // store.dispatch(WidgetAPI.endpoints.removeWidget.initiate({ id: id }));
  }

  /**
   * Removes multiple widgets specified in the 'widgetArr' array.
   * @param {Array} widgetArr - An array of widget IDs or objects to be removed.
   */
  async removeWidgetArr(widgetArr: any) {
    // store.dispatch(handleSetUpdatingBoard(1));
    // // Dispatch a Redux action to initiate the removal of the widgets specified in the 'widgetArr'.
    // await store.dispatch(
    //   WidgetAPI.endpoints.removeWidgetArr.initiate({ widgetArr: widgetArr })
    // );
    // store.dispatch(handleSetUpdatingBoard(-1));
  }
}
