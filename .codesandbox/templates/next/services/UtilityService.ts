//**Redux Store */

//**Services */
// import WidgetService from './WidgetService';
// import { UtilityAPI } from "../redux/services/utility.api.slice";
// import FileService from "./FileService";

export default class UtilityService {
  static service: UtilityService;

  static getInstance(): UtilityService {
    if (UtilityService.service == null) {
      UtilityService.service = new UtilityService();
    }

    return UtilityService.service;
  }

  // async uploadWebsite(whiteboardId, url, left, top) {
  //   const options = {
  //     url,
  //     left,
  //     top,
  //     whiteboardId,
  //     userNo: store.getState().user.userInfo.userNo,
  //     objType: "WBUrlImage",
  //   };

  //   const uploadWebsiteResponse: any = await store.dispatch(
  //     UtilityAPI.endpoints.uploadWebsite.initiate({ options: options })
  //   );

  //   let widget = { ...uploadWebsiteResponse.data };

  //   widget.id = this.generateWidgetID();

  //   WidgetService.getInstance().insertWidget(widget);

  //   if (widget) {
  //     FileService.getInstance().readContentFromFileAsync(widget);
  //   }

  //   const newState = {
  //     newState: widget,
  //     targetId: widget.id,
  //     action: "ADDED",
  //   };

  //   canvas.pushNewState([newState]);

  //   await canvas.renderWidgetAsync(widget);

  //   return widget;
  // }

  generateRandomString(length: any) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  generateUUID() {
    const generatedUUID = Math.random().toString(36).substr(2, 16);
    const randomString = this.generateRandomString(16 - generatedUUID.length);
    const uuidString = randomString + generatedUUID;
    return uuidString;
  }

  generateWidgetID() {
    return this.generateUUID();
  }

  getr2UploadPath(board: any) {
    var path = null;

    if (board.teamId) {
      path = board.teamId + '/';

      if (board.roomId && board.roomId !== 'none') {
        return board.teamId + '/' + board.roomId + '/' + board.id + '/';
      } else {
        return path + 'default/' + board.id + '/';
      }
    } else {
      return 'default/';
    }
  }
  getr2UploadPathByOrg(orgInfo: any) {
    if (orgInfo.teamId) {
      return orgInfo.teamId + '/';
    } else {
      return 'default/';
    }
  }

  // async sendEmail(to, subject, text) {
  //   // return await server.call("sendEmail", to, subject, text);
  // }

  getFileExtension = (fileName: any) => {
    const extension = fileName.match(/\.(.+)$/);

    if (extension) {
      return extension[1].toUpperCase();
    } else {
      return 'File';
    }
  };

  formatFileSize = (bytes: any) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
}
