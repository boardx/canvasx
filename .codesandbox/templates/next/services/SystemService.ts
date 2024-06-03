//** Store */
import store from "../redux/store";
import { handleSetSettings } from "../redux/features/system.slice";

//** Services */
import UserService from "./UserService";

export default class SystemService {
  public _isFirefox: any;

  public _isSafari: any;

  public _isEdge: any;

  public _isChrome: any;

  public _isMac: any;

  static _service = null;

  static service: SystemService;

  static getInstance(): SystemService {
    if (SystemService.service == null) {
      SystemService.service = new SystemService();

      // Boardx.Instance.SystemService = SystemService.service;
    }

    return SystemService.service;
  }

  constructor() {
    this.initializeTutorial();

    const isIE = /* @cc_on!@ */ false || !!(document as any).documentMode;

    //判断是firefox浏览器
    // this._isFirefox = typeof InstallTrigger !== 'undefined';
    //TODO: check if this is firefox
    this._isFirefox = false;

    //判断当前浏览器是safari
    this._isSafari =
      /constructor/i.test((window as any).HTMLElement) ||
      (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
      })(
        !(window as any).safari ||
          //TODO: check if this is safari    (typeof safari !== 'undefined' &&
          (false && (window as any).safari.pushNotification)
      );

    this._isEdge = !isIE && !!(window as any).StyleMedia;

    this._isChrome = (window as any).chrome != undefined;

    this._isMac = window.navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;
  }

  initializeTutorial() {
    if (localStorage.getItem("is_onboard") !== "false") {
      localStorage.setItem("is_onboard", "true");
    }

    setTimeout(() => {
      localStorage.setItem("is_onboard", "false");
    }, 5000);
  }

  checkRoutingRules(user: any) {
    let path = location.pathname + location.search;
    //if user is not logged in
    if (!user) {
      if (
        path.indexOf("recent") > -1 &&
        path.indexOf("teamId") <= -1 &&
        path.indexOf("callback") <= -1 &&
        path.indexOf("join?invite") <= -1 &&
        path.indexOf("/reset-password") === -1
      ) {
        location.href = "/signin";
      }

      if (path === "/" || !path) {
        location.href = "/signin";
      }

      if (path.indexOf("/room/") > -1) {
        location.href = "/signin";
      }

      return;
    }

    const isAnonymous =
      store.getState().user.userInfo.userName.indexOf("vistor_") > -1;

    //user logged in with anonymous account
    if (isAnonymous) {
      if (
        path.indexOf("/signin") > -1 ||
        path.indexOf("/join") > -1 ||
        path.indexOf("/invite") > -1
      ) {
        UserService.getInstance().logout();
      } else if (path.indexOf("/board/") < 0) {
        UserService.getInstance().logout();

        window.location.href = "/signin";
      }

      return;
    }

    //logged in with non-anonymous account
    if (user) {
      if (path.indexOf("/signin") > -1) {
        location.href = "/recent";
      }
    }
  }

  async loadSettings() {
    // const response = await server.call("getSettings", "all");
    // await store.dispatch(handleSetSettings(response));
    // return response;
  }

  getIsFirefox() {
    return this._isFirefox;
  }

  getIsChrome() {
    return this._isChrome;
  }

  getIsEdge() {
    return this._isEdge;
  }

  getIsSafari() {
    return this._isSafari;
  }

  getIsMac() {
    return this._isMac;
  }
}
