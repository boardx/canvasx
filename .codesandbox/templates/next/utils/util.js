import imageCompression from "browser-image-compression";
// import diffTwoObjects from "./Utility-diffObject";
// import "../lib/toastr.min.css";
// import toastr from "../lib/toastr.min";
// import stc from "string-to-color";
import * as fabric from "../../../../../fabric";
//todo
import store from "../redux/store";
//**Import i18n */
import WebFont from "webfontloader";
import {
  handleSetArrowSelected,
  handleSetFileSelected,
  handleSetNoteSelected,
  handleSetPathSelected,
  handleSetShapeSelected,
  handleSetTextSelected,
} from "@/redux/features/widgets.slice";
//@ts-ignore
import $ from "jquery";

const Util = {};
const _URL = window.URL || window.webkitURL;

// toastr.options = {
//   closeButton: false,
//   debug: false,
//   newestOnTop: false,
//   progressBar: false,
//   positionClass: "toast-top-center",
//   preventDuplicates: false,
//   onclick: null,
//   showDuration: "2000",
//   hideDuration: "2000",
//   timeOut: "3100",
//   extendedTimeOut: "2000",
//   showEasing: "swing",
//   hideEasing: "linear",
//   showMethod: "fadeIn",
//   hideMethod: "fadeOut",
// };

// Util.diffTwoObjects = diffTwoObjects;

/**
 *
 * @param {*} objType
 * @returns
 */
Util["getType"] = function (objType) {
  let text = "";
  if (objType === "XRectNotes") text = "便利贴";
  else if (objType === "XCircleNotes") text = "便利贴";
  else if (objType === "XText") text = "文本";
  else if (objType === "WBImage") text = "图片";
  else if (objType === "WBUrlImage") text = "网址";
  else if (objType === "WBPath") text = "绘画";
  else if (objType === "WBLine") text = "图形";
  else if (objType === "XConnector") text = "图形";
  else if (objType === "WBRect") text = "图形";
  else if (objType === "WBCircle") text = "图形";
  else if (objType === "sticker") text = "图标";
  else if (objType === "WBGroup") text = "群组";
  return text;
};

Util.isMobile = function () {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
      userAgent
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      userAgent.substr(0, 4)
    )
  );
};

Util.getPointOnCanvasInGroup = function (obj) {
  // 1. get the matrix for the object.
  const matrix = obj.calcTransformMatrix();
  // 2. choose the point you want, fro example top, left.
  const point = {
    x: 0,
    y: 0,
  };
  // 3. transform the point
  const pointOnCanvas = fabric.util.transformPoint(point, matrix);

  pointOnCanvas.x = Math.round(pointOnCanvas.x);
  pointOnCanvas.y = Math.round(pointOnCanvas.y);
  return pointOnCanvas;
};

Util.getOnePointOnCanvasInGroupFrame = function (obj, pnt) {
  // 1. get the matrix for the object.
  let matrix = null;
  // add active selection matrix
  if (obj.group) {
    const objG = obj.group;
    matrix = objG.calcTransformMatrix();
  } else {
    matrix = obj.calcTransformMatrix();
  }
  // 2. choose the point you want, fro example top, left.
  const point = {
    x: pnt.x,
    y: pnt.y,
  };
  // 3. transform the point
  const pointOnCanvas = fabric.util.transformPoint(point, matrix);
  pointOnCanvas.x = Math.round(pointOnCanvas.x);
  pointOnCanvas.y = Math.round(pointOnCanvas.y);
  return pointOnCanvas;
};

Util.getOnePointOnCanvasInGroup = function (obj, pnt) {
  // 1. get the matrix for the object.
  const matrix = obj.calcTransformMatrix();
  // 2. choose the point you want, fro example top, left.
  const point = {
    x: pnt.x,
    y: pnt.y,
  };
  // 3. transform the point
  const pointOnCanvas = fabric.util.transformPoint(point, matrix);
  pointOnCanvas.x = Math.round(pointOnCanvas.x);
  pointOnCanvas.y = Math.round(pointOnCanvas.y);
  return pointOnCanvas;
};

Util.getLeftObject = function (objects) {
  objects.sort((a, b) => a.aCoords.tl.x - b.aCoords.tl.x);
  return objects[0];
};

Util.getHSortObjects = function (objects) {
  objects.sort((a, b) => a.aCoords.tl.x - b.aCoords.tl.x);
  return objects;
};

Util.getVSortObjects = function (objects) {
  objects.sort((a, b) => a.aCoords.tl.y - b.aCoords.tl.y);
  return objects;
};

Util.getTopObject = function (objects) {
  objects.sort((a, b) => a.aCoords.tl.y - b.aCoords.tl.y);
  return objects[0];
};

Util.getBottomObject = function (objects) {
  objects.sort((a, b) => b.aCoords.bl.y - a.aCoords.bl.y);

  return objects[0];
};

Util.getRightObject = function (objects) {
  objects.sort((a, b) => b.aCoords.tr.x - a.aCoords.tr.x);

  return objects[0];
};

Util.loadWebFont = async function (font) {
  const WebFontConfig = {
    google: {
      api: "https://fonts.googleapis.com/css",
      families: [font],
    },
    timeout: 3000, // Set the timeout to two seconds
  };

  await WebFont.load(WebFontConfig);
};

// 将dataURI转换为blob
Util.dataURIToBlob = function (dataURI) {
  let byteString = "";
  let mimeString = "";
  let ia = "";

  if (dataURI.split(",")[0].indexOf("base64") >= 0) {
    byteString = atob(dataURI.split(",")[1]);
  } else {
    byteString = unescape(dataURI.split(",")[1]);
  }

  mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  ia = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {
    type: mimeString,
  });
};

Util.sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

Util.getAngle = function (x, y) {
  let angle = 0;
  if (x === 0) {
    if (y === 0) {
      angle = 0;
    } else if (y > 0) {
      angle = Math.PI / 2;
    } else {
      angle = (Math.PI * 3) / 2;
    }
  } else if (y === 0) {
    if (x > 0) {
      angle = 0;
    } else {
      angle = Math.PI;
    }
  } else if (x < 0) {
    angle = Math.atan(y / x) + Math.PI;
  } else if (y < 0) {
    angle = Math.atan(y / x) + 2 * Math.PI;
  } else {
    angle = Math.atan(y / x);
  }
  angle = (angle * 180) / Math.PI + 90;
  return angle;
};

Util.isURL = (str) => /^(https?:\/\/|data:)/.test(str);

Util.isEmail = (email) =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

Util.validateEmails = (emails) => {
  emails.forEach((email) => {
    if (!Util.isEmail(email)) return false;
  });
  return true;
};

// Util.Msg = toastr;

Util.opacityFromRgbA = function (orig) {
  let a;
  let isPercent;
  let rgb = orig
    .replace(/\s/g, "")
    .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
  return parseInt(rgb[4] * 100);
};

Util.hexToRgbA = function (hex, opacity) {
  let c;
  let o;

  if (hex.length === 9) {
    hex = hex.substr(0, 7);
  }
  if (hex.length != 7) {
    const op = hex.slice(-2);
    o = parseInt(op, 16) / 100;
  } else {
    o = opacity;
  }
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join("")}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",")},${o})`;
  }
  return "rgba(0, 0, 0, 0)";
};

Util.rgbaToHex = function (orig) {
  let a;
  let isPercent;
  const rgb = orig
    .replace(/\s/g, "")
    .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
  var alpha = ((rgb && rgb[4]) || "").trim();
  const hex = rgb
    ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
    (rgb[2] | (1 << 8)).toString(16).slice(1) +
    (rgb[3] | (1 << 8)).toString(16).slice(1)
    : orig;
  if (alpha !== "") {
    a = alpha;
  } else {
    a = "01";
  }

  a = Math.round(a * 100) / 100;
  var alpha = Math.round(a * 255);
  const hexAlpha = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();

  return `#${hex}`;
};

Util.getMobileOperatingSystem = function () {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "windows";
  }

  if (/android/i.test(userAgent)) {
    return "android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios";
  }

  return "unknown";
};

Util.invertHex = function (hex) {
  return (Number(`0x1${hex}`) ^ 0xffffff).toString(16).substr(1).toUpperCase();
};

Util.compressImage = imageCompression;

Util.generateHashcode = function (obj) {
  let hc = 0;
  const chars = JSON.stringify(obj).replace(/\{|\"|\}|\:|,/g, "");
  const len = chars.length;
  for (let i = 0; i < len; i++) {
    // Bump 7 to larger prime number to increase uniqueness
    hc += chars.charCodeAt(i) * 7;
  }
  return hc;
};

Util.invertColor = function (inputHex, bw) {
  let hex;
  if (inputHex === "#HHHHHH") {
    return "#000";
  }
  if (inputHex.indexOf("rgba") > -1) {
    hex = Util.rgbaToHex(inputHex);
  } else {
    hex = inputHex;
  }
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6 && hex.length !== 8) {
    throw new Error("Invalid HEX color.");
  }
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? "#000000" : "#FFFFFF";
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return `#${padZero(r)}${padZero(g)}${padZero(b)}`;
};

const colors = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#9E9E9E",
  "#607D8B",
];
// Util.getAvatarColor = (name) => stc(name);

Util.getEnvironmentInfo = () => {
  // const [env, setEnv] = useState<envProps>()
  const ua = window.navigator.userAgent;
  const isWindowsPhone = /(?:Windows Phone)/.test(ua);
  const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone;
  const isFireFox = /(?:Firefox)/.test(ua);
  const isIpad =
    (/macintosh|mac os x/i.test(navigator.userAgent) &&
      window.screen.height > window.screen.width &&
      !navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/)) ||
    navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/);
  // const isChrome = /(?:Chrome|CriOS)/.test(ua)

  const isAndroid = /(?:Android)/.test(ua);
  const isTablet =
    /(?:iPad|PlayBook)/.test(ua) ||
    (isAndroid && !/(?:Mobile)/.test(ua)) ||
    (isFireFox && /(?:Tablet)/.test(ua));
  const isPhone = /(?:iPhone)/.test(ua) && !isTablet;
  const isPc = !isPhone && !isAndroid && !isSymbian;

  return {
    isIpad,
    isAndroid,
    isTablet,
    isPhone,
    isPc,
  };
};

Util.mobileAndTabletCheck = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

Util.loadImageFromFile = (file) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = function () {
      resolve(image);
    };

    image.src = _URL.createObjectURL(file);
  });

Util.sanitizeText = function (value) {
  let sanitizedText = value
    .trim()
    .replace(/'''/g, "\u2034") // triple prime
    .replace(/(\W|^)"(\S)/g, "$1\u201c$2") // beginning "
    .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, "$1\u201d$2") // ending "
    .replace(/([^0-9])"/g, "$1\u201d") // remaining " at end of word
    .replace(/''/g, "\u2033") // double prime
    .replace(/(\W|^)'(\S)/g, "$1\u2018$2") // beginning '
    .replace(/([a-z])'([a-z])/gi, "$1\u2019$2") // conjunction's possession
    .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/gi, "$1\u2019$3") // ending '
    .replace(
      /(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/gi,
      "\u2019$2$3"
    ) // abbrev. years like '93
    .replace(
      /(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/gi,
      "$1\u2019"
    ) // backwards apostrophe
    .replace(/'/g, "\u2032");

  // default text
  if (sanitizedText.length === 0) {
    sanitizedText = "Your text here";
  }

  return sanitizedText;
};

const generateUUID = () => {
  var d = new Date().getTime();

  var uuid = "xxxxxxxxxxxx4xxxyxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

  return uuid;
};

Util.getId = generateUUID;

Util.animateMouseToPosition = async function (userNo, left, top) {
  const currentLeft = parseInt($(`#${userNo}`).css("left"), 10);
  const currentTop = parseInt($(`#${userNo}`).css("top"), 10);

  await fabric.util.animate({
    startValue: 1,
    endValue: 5,
    duration: 200,
    onChange(value) {
      const newLeft = currentLeft + ((left - currentLeft) * value) / 5;
      const newTop = currentTop + ((top - currentTop) * value) / 5;
      $(`#${userNo}`).css("left", newLeft);
      $(`#${userNo}`).css("top", newTop);
    },
    easing: fabric.util.ease.easeInOutQuad,
    onComplete() { },
  });
};

Util.isiOSDevice = function () {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
};

function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }

  return color;
}

Util.stringAvatar = function (name) {
  return {
    sx: {
      bgcolor: Util.getAvatarColor(name || ""),
    },
  };
};

Util.encode = function (str) {
  const utf8 = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(
        0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    }
    // surrogate pair
    else {
      i++;
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode =
        0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    }
  }
  return utf8;
};

Util.resizeCanvasAccordingtoWindowSize = function (offset = 0) {
  const windowEl = $(window);
  if (!_.isNumber(offset)) offset = 0;
  const winWidth = windowEl.width() - offset;
  const winHeight = windowEl.height();

  if (canvas) {
    canvas.setWidth(winWidth).setHeight(winHeight);
  }
  $(".canvas-container").css("width", winWidth);
  $(".canvas-container").css("height", winHeight);
  $(".canvas-top-info").css("width", winWidth);
  $(".remote-viewport").height($(window).height());
  $(".remote-viewport").width($(window).width());
};

Util.replaceAll = function (inStr, search, replace) {
  return inStr.split(search).join(replace);
};

Util.changeMenuBarSelected = (objType) => {
  store.dispatch(handleSetNoteSelected(false));
  store.dispatch(handleSetTextSelected(true));
  store.dispatch(handleSetShapeSelected(true));
  store.dispatch(handleSetPathSelected(true));
  store.dispatch(handleSetArrowSelected(true));
  store.dispatch(handleSetFileSelected(true));
  if (!objType) return;
  switch (objType) {
    case "XRectNotes":
      store.dispatch(handleSetNoteSelected(true));
      break;
    case "XText":
      store.dispatch(handleSetTextSelected(true));
      break;
    case "WBPath":
      store.dispatch(handleSetPathSelected(true));
      break;
    case "XConnector":
      store.dispatch(handleSetArrowSelected(true));
      break;
    case "XShapeNotes":
      store.dispatch(handleSetShapeSelected(true));
      break;
    case "WBImage":
      store.dispatch(handleSetFileSelected(true));
      break;
  }
};

Util.getMenuBarSelected = (objType) => {
  switch (objType) {
    case "XRectNotes":
      return store.getState().widgets.noteSelected;
    case "XText":
      return store.getState().widgets.textSelected;
    case "WBPath":
      return store.getState().widgets.pathSelected;
    case "XConnector":
      return store.getState().widgets.arrowSelected;
    case "XShapeNotes":
      return store.getState().widgets.shapeSelected;
    case "WBImage":
      return store.getState().widgets.fileSelected;
  }
};

Util.mapToObject = (map) => Object.fromEntries(map.entries());

Util.getCurrentYMapData = () => {
  return Boardx.ydoc.get("myShapes").map((item) => {
    return Util.mapToObject(item);
  });
};

export default Util;
export { Util };
