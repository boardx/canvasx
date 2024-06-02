// // const _URL = window.URL || window.webkitURL;

// // toastr.options = {
// //   closeButton: false,
// //   debug: false,
// //   newestOnTop: false,
// //   progressBar: false,
// //   positionClass: "toast-top-center",
// //   preventDuplicates: false,
// //   onclick: null,
// //   showDuration: "2000",
// //   hideDuration: "2000",
// //   timeOut: "3100",
// //   extendedTimeOut: "2000",
// //   showEasing: "swing",
// //   hideEasing: "linear",
// //   showMethod: "fadeIn",
// //   hideMethod: "fadeOut",
// // };

// // Util.diffTwoObjects = diffTwoObjects;

// /**
//  *
//  * @param {*} objType
//  * @returns
//  */
// // Util['getType'] = function (objType) {
// //   let text = '';
// //   if (objType === 'WBRectNotes') text = '便利贴';
// //   else if (objType === 'XCircleNotes') text = '便利贴';
// //   else if (objType === 'WBText') text = '文本';
// //   else if (objType === 'WBImage') text = '图片';
// //   else if (objType === 'WBUrlImage') text = '网址';
// //   else if (objType === 'XPath') text = '绘画';
// //   else if (objType === 'WBLine') text = '图形';
// //   else if (objType === 'XConnector') text = '图形';
// //   else if (objType === 'WBRect') text = '图形';
// //   else if (objType === 'WBCircle') text = '图形';
// //   else if (objType === 'sticker') text = '图标';
// //   else if (objType === 'WBGroup') text = '群组';
// //   return text;
// // };

// Util.getPointOnCanvasInGroup = function (obj) {
//   // 1. get the matrix for the object.
//   const matrix = obj.calcTransformMatrix();
//   // 2. choose the point you want, fro example top, left.
//   const point = {
//     x: 0,
//     y: 0,
//   };
//   // 3. transform the point
//   const pointOnCanvas = fabric.util.transformPoint(point, matrix);

//   pointOnCanvas.x = Math.round(pointOnCanvas.x);
//   pointOnCanvas.y = Math.round(pointOnCanvas.y);
//   return pointOnCanvas;
// };

// Util.getOnePointOnCanvasInGroupFrame = function (obj, pnt) {
//   // 1. get the matrix for the object.
//   let matrix = null;
//   // add active selection matrix
//   if (obj.group) {
//     const objG = obj.group;
//     matrix = objG.calcTransformMatrix();
//   } else {
//     matrix = obj.calcTransformMatrix();
//   }
//   // 2. choose the point you want, fro example top, left.
//   const point = {
//     x: pnt.x,
//     y: pnt.y,
//   };
//   // 3. transform the point
//   const pointOnCanvas = fabric.util.transformPoint(point, matrix);
//   pointOnCanvas.x = Math.round(pointOnCanvas.x);
//   pointOnCanvas.y = Math.round(pointOnCanvas.y);
//   return pointOnCanvas;
// };

// Util.getOnePointOnCanvasInGroup = function (obj, pnt) {
//   // 1. get the matrix for the object.
//   const matrix = obj.calcTransformMatrix();
//   // 2. choose the point you want, fro example top, left.
//   const point = {
//     x: pnt.x,
//     y: pnt.y,
//   };
//   // 3. transform the point
//   const pointOnCanvas = fabric.util.transformPoint(point, matrix);
//   pointOnCanvas.x = Math.round(pointOnCanvas.x);
//   pointOnCanvas.y = Math.round(pointOnCanvas.y);
//   return pointOnCanvas;
// };

// Util.getLeftObject = function (objects) {
//   objects.sort((a, b) => a.aCoords.tl.x - b.aCoords.tl.x);
//   return objects[0];
// };

// Util.getHSortObjects = function (objects) {
//   objects.sort((a, b) => a.aCoords.tl.x - b.aCoords.tl.x);
//   return objects;
// };

// Util.getVSortObjects = function (objects) {
//   objects.sort((a, b) => a.aCoords.tl.y - b.aCoords.tl.y);
//   return objects;
// };

// Util.getTopObject = function (objects) {
//   objects.sort((a, b) => a.aCoords.tl.y - b.aCoords.tl.y);
//   return objects[0];
// };

// Util.getBottomObject = function (objects) {
//   objects.sort((a, b) => b.aCoords.bl.y - a.aCoords.bl.y);

//   return objects[0];
// };

// Util.getRightObject = function (objects) {
//   objects.sort((a, b) => b.aCoords.tr.x - a.aCoords.tr.x);

//   return objects[0];
// };

// Util.loadWebFont = async function (font) {
//   const WebFontConfig = {
//     google: {
//       api: 'https://fonts.googleapis.com/css',
//       families: [font],
//     },
//     timeout: 3000, // Set the timeout to two seconds
//   };

//   await WebFont.load(WebFontConfig);
// };

// // 将dataURI转换为blob
// Util.dataURIToBlob = function (dataURI) {
//   let byteString = '';
//   let mimeString = '';
//   let ia = '';

//   if (dataURI.split(',')[0].indexOf('base64') >= 0) {
//     byteString = atob(dataURI.split(',')[1]);
//   } else {
//     byteString = unescape(dataURI.split(',')[1]);
//   }

//   mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
//   ia = new Uint8Array(byteString.length);

//   for (let i = 0; i < byteString.length; i++) {
//     ia[i] = byteString.charCodeAt(i);
//   }

//   return new Blob([ia], {
//     type: mimeString,
//   });
// };

// Util.sleep = (milliseconds) =>
//   new Promise((resolve) => setTimeout(resolve, milliseconds));

// Util.getAngle = function (x, y) {
//   let angle = 0;
//   if (x === 0) {
//     if (y === 0) {
//       angle = 0;
//     } else if (y > 0) {
//       angle = Math.PI / 2;
//     } else {
//       angle = (Math.PI * 3) / 2;
//     }
//   } else if (y === 0) {
//     if (x > 0) {
//       angle = 0;
//     } else {
//       angle = Math.PI;
//     }
//   } else if (x < 0) {
//     angle = Math.atan(y / x) + Math.PI;
//   } else if (y < 0) {
//     angle = Math.atan(y / x) + 2 * Math.PI;
//   } else {
//     angle = Math.atan(y / x);
//   }
//   angle = (angle * 180) / Math.PI + 90;
//   return angle;
// };

// Util.isURL = (str) => /^(https?:\/\/|data:)/.test(str);

// Util.isEmail = (email) =>
//   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
//     email
//   );

// Util.validateEmails = (emails) => {
//   emails.forEach((email) => {
//     if (!Util.isEmail(email)) return false;
//   });
//   return true;
// };

// // Util.Msg = toastr;

// Util.opacityFromRgbA = function (orig) {
//   let a;
//   let isPercent;
//   let rgb = orig
//     .replace(/\s/g, '')
//     .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
//   return parseInt(rgb[4] * 100);
// };

// Util.hexToRgbA = function (hex, opacity) {
//   let c;
//   let o;

//   if (hex.length === 9) {
//     hex = hex.substr(0, 7);
//   }
//   if (hex.length != 7) {
//     const op = hex.slice(-2);
//     o = parseInt(op, 16) / 100;
//   } else {
//     o = opacity;
//   }
//   if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
//     c = hex.substring(1).split('');
//     if (c.length === 3) {
//       c = [c[0], c[0], c[1], c[1], c[2], c[2]];
//     }
//     c = `0x${c.join('')}`;
//     return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${o})`;
//   }
//   return 'rgba(0, 0, 0, 0)';
// };

// Util.rgbaToHex = function (orig) {
//   let a;
//   let isPercent;
//   const rgb = orig
//     .replace(/\s/g, '')
//     .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
//   var alpha = ((rgb && rgb[4]) || '').trim();
//   const hex = rgb
//     ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
//       (rgb[2] | (1 << 8)).toString(16).slice(1) +
//       (rgb[3] | (1 << 8)).toString(16).slice(1)
//     : orig;
//   if (alpha !== '') {
//     a = alpha;
//   } else {
//     a = '01';
//   }

//   a = Math.round(a * 100) / 100;
//   var alpha = Math.round(a * 255);
//   const hexAlpha = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();

//   return `#${hex}`;
// };

// Util.invertHex = function (hex) {
//   return (Number(`0x1${hex}`) ^ 0xffffff).toString(16).substr(1).toUpperCase();
// };

// Util.generateHashcode = function (obj) {
//   let hc = 0;
//   const chars = JSON.stringify(obj).replace(/\{|\"|\}|\:|,/g, '');
//   const len = chars.length;
//   for (let i = 0; i < len; i++) {
//     // Bump 7 to larger prime number to increase uniqueness
//     hc += chars.charCodeAt(i) * 7;
//   }
//   return hc;
// };

// Util.invertColor = function (inputHex, bw) {
//   let hex;
//   if (inputHex === '#HHHHHH') {
//     return '#000';
//   }
//   if (inputHex.indexOf('rgba') > -1) {
//     hex = Util.rgbaToHex(inputHex);
//   } else {
//     hex = inputHex;
//   }
//   if (hex.indexOf('#') === 0) {
//     hex = hex.slice(1);
//   }
//   // convert 3-digit hex to 6-digits.
//   if (hex.length === 3) {
//     hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
//   }
//   if (hex.length !== 6 && hex.length !== 8) {
//     throw new Error('Invalid HEX color.');
//   }
//   let r = parseInt(hex.slice(0, 2), 16);
//   let g = parseInt(hex.slice(2, 4), 16);
//   let b = parseInt(hex.slice(4, 6), 16);
//   if (bw) {
//     // http://stackoverflow.com/a/3943023/112731
//     return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? '#000000' : '#FFFFFF';
//   }
//   // invert color components
//   r = (255 - r).toString(16);
//   g = (255 - g).toString(16);
//   b = (255 - b).toString(16);
//   // pad each with zeros and return
//   return `#${padZero(r)}${padZero(g)}${padZero(b)}`;
// };

// const colors = [
//   '#F44336',
//   '#E91E63',
//   '#9C27B0',
//   '#673AB7',
//   '#3F51B5',
//   '#2196F3',
//   '#03A9F4',
//   '#00BCD4',
//   '#009688',
//   '#4CAF50',
//   '#8BC34A',
//   '#CDDC39',
//   '#FFC107',
//   '#FF9800',
//   '#FF5722',
//   '#795548',
//   '#9E9E9E',
//   '#607D8B',
// ];
// // Util.getAvatarColor = (name) => stc(name);

// Util.loadImageFromFile = (file) =>
//   new Promise((resolve, reject) => {
//     const image = new Image();

//     image.onload = function () {
//       resolve(image);
//     };

//     image.src = URL.createObjectURL(file);
//   });

// Util.sanitizeText = function (value) {
//   let sanitizedText = value
//     .trim()
//     .replace(/'''/g, '\u2034') // triple prime
//     .replace(/(\W|^)"(\S)/g, '$1\u201c$2') // beginning "
//     .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, '$1\u201d$2') // ending "
//     .replace(/([^0-9])"/g, '$1\u201d') // remaining " at end of word
//     .replace(/''/g, '\u2033') // double prime
//     .replace(/(\W|^)'(\S)/g, '$1\u2018$2') // beginning '
//     .replace(/([a-z])'([a-z])/gi, '$1\u2019$2') // conjunction's possession
//     .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/gi, '$1\u2019$3') // ending '
//     .replace(
//       /(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/gi,
//       '\u2019$2$3'
//     ) // abbrev. years like '93
//     .replace(
//       /(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/gi,
//       '$1\u2019'
//     ) // backwards apostrophe
//     .replace(/'/g, '\u2032');

//   // default text
//   if (sanitizedText.length === 0) {
//     sanitizedText = 'Your text here';
//   }

//   return sanitizedText;
// };

// const generateUUID = () => {
//   var d = new Date().getTime();

//   var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//     var r = (d + Math.random() * 16) % 16 | 0;
//     d = Math.floor(d / 16);
//     return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
//   });

//   return uuid;
// };

// Util.getId = generateUUID;

// Util.animateMouseToPosition = async function (userNo, left, top) {
//   const currentLeft = parseInt($(`#${userNo}`).css('left'), 10);
//   const currentTop = parseInt($(`#${userNo}`).css('top'), 10);

//   await fabric.util.animate({
//     startValue: 1,
//     endValue: 5,
//     duration: 200,
//     onChange(value) {
//       const newLeft = currentLeft + ((left - currentLeft) * value) / 5;
//       const newTop = currentTop + ((top - currentTop) * value) / 5;
//       $(`#${userNo}`).css('left', newLeft);
//       $(`#${userNo}`).css('top', newTop);
//     },
//     easing: fabric.util.ease.easeInOutQuad,
//     onComplete() {},
//   });
// };

// Util.isiOSDevice = function () {
//   return (
//     [
//       'iPad Simulator',
//       'iPhone Simulator',
//       'iPod Simulator',
//       'iPad',
//       'iPhone',
//       'iPod',
//     ].includes(navigator.platform) ||
//     (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
//   );
// };

// function stringToColor(string) {
//   let hash = 0;
//   let i;

//   for (i = 0; i < string.length; i += 1) {
//     hash = string.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   let color = '#';

//   for (i = 0; i < 3; i += 1) {
//     const value = (hash >> (i * 8)) & 0xff;
//     color += `00${value.toString(16)}`.substr(-2);
//   }

//   return color;
// }

// Util.stringAvatar = function (name) {
//   return {
//     sx: {
//       bgcolor: Util.getAvatarColor(name || ''),
//     },
//   };
// };

// Util.encode = function (str) {
//   const utf8 = [];
//   for (let i = 0; i < str.length; i++) {
//     let charcode = str.charCodeAt(i);
//     if (charcode < 0x80) utf8.push(charcode);
//     else if (charcode < 0x800) {
//       utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
//     } else if (charcode < 0xd800 || charcode >= 0xe000) {
//       utf8.push(
//         0xe0 | (charcode >> 12),
//         0x80 | ((charcode >> 6) & 0x3f),
//         0x80 | (charcode & 0x3f)
//       );
//     }
//     // surrogate pair
//     else {
//       i++;
//       // UTF-16 encodes 0x10000-0x10FFFF by
//       // subtracting 0x10000 and splitting the
//       // 20 bits of 0x0-0xFFFFF into two halves
//       charcode =
//         0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
//       utf8.push(
//         0xf0 | (charcode >> 18),
//         0x80 | ((charcode >> 12) & 0x3f),
//         0x80 | ((charcode >> 6) & 0x3f),
//         0x80 | (charcode & 0x3f)
//       );
//     }
//   }
//   return utf8;
// };

// Util.replaceAll = function (inStr, search, replace) {
//   return inStr.split(search).join(replace);
// };

// Util.changeMenuBarSelected = (objType) => {
//   store.dispatch(handleSetNoteSelected(false));
//   store.dispatch(handleSetTextSelected(true));
//   store.dispatch(handleSetShapeSelected(true));
//   store.dispatch(handleSetPathSelected(true));
//   store.dispatch(handleSetArrowSelected(true));
//   store.dispatch(handleSetFileSelected(true));
//   if (!objType) return;
//   switch (objType) {
//     case 'WBRectNotes':
//       store.dispatch(handleSetNoteSelected(true));
//       break;
//     case 'WBText':
//       store.dispatch(handleSetTextSelected(true));
//       break;
//     case 'XPath':
//       store.dispatch(handleSetPathSelected(true));
//       break;
//     case 'XConnector':
//       store.dispatch(handleSetArrowSelected(true));
//       break;
//     case 'WBShapeNotes':
//       store.dispatch(handleSetShapeSelected(true));
//       break;
//     case 'WBImage':
//       store.dispatch(handleSetFileSelected(true));
//       break;
//   }
// };

// Util.getMenuBarSelected = (objType) => {
//   switch (objType) {
//     case 'WBRectNotes':
//       return store.getState().widgets.noteSelected;
//     case 'WBText':
//       return store.getState().widgets.textSelected;
//     case 'XPath':
//       return store.getState().widgets.pathSelected;
//     case 'XConnector':
//       return store.getState().widgets.arrowSelected;
//     case 'WBShapeNotes':
//       return store.getState().widgets.shapeSelected;
//     case 'WBImage':
//       return store.getState().widgets.fileSelected;
//   }
// };

// Util.mapToObject = (map) => Object.fromEntries(map.entries());

// Util.getCurrentYMapData = () => {
//   return Boardx.ydoc.get('myShapes').map((item) => {
//     return Util.mapToObject(item);
//   });
// };

// export default Util;
// export { Util };
