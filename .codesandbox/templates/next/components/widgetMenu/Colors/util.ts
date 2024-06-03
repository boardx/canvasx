export const getCursorBrush = (color: string) => {
  // const cursorBrush = `data:image/svg+xml,%3Csvg width='18' height='20' viewBox='0 0 18 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M18 14.66C18 14.41 17.9 14.15 17.71 13.96L15.88 12.13L12.13 15.88L13.96 17.71C14.35 18.1 14.98 18.1 15.37 17.71L17.71 15.37C17.91 15.17 18 14.92 18 14.66ZM11.98 11.06L11.06 11.98L2 2.92V2H2.92L11.98 11.06ZM3.75 0L14.81 11.06L11.06 14.81L0 3.75V0L3.75 0Z' style='fill:${color}'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11.98 11.06L11.06 11.98L2.00001 2.92V2H2.92001L11.98 11.06Z' style='fill:white'/%3E%3C/svg%3E`;
  // SVG data URL
  const cursorBrush =
    'data:image/svg+xml;base64,' +
    btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
`);
  return cursorBrush;
};
export const getBrushCursorWithColor = (color: any) => {
  //@ts-ignore
  let colorNow = document.cookie['cursor_color_now']
    ? //@ts-ignore
      document.cookie['cursor_color_now']
    : '';
  //@ts-ignore
  let cursorPen = document.cookie['base64_string']
    ? //@ts-ignore
      document.cookie['base64_string']
    : '';

  if (!cursorPen || colorNow != color) {
    cursorPen = getCursorBrush(color);
  }

  return `url("${cursorPen}") 0 24, auto`;
};

export const hexToRgbA = function (hex: any, opacity: any) {
  let c: any;
  let o: any;

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
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${o})`;
  }
  return 'rgba(0, 0, 0, 0)';
};

export const rgbaToHex = function (orig: any) {
  let a: any;
  let isPercent;
  const rgb = orig
    .replace(/\s/g, '')
    .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
  var alpha = ((rgb && rgb[4]) || '').trim();
  const hex = rgb
    ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
      (rgb[2] | (1 << 8)).toString(16).slice(1) +
      (rgb[3] | (1 << 8)).toString(16).slice(1)
    : orig;
  if (alpha !== '') {
    a = alpha;
  } else {
    a = '01';
  }

  a = Math.round(a * 100) / 100;
  var alpha: any = Math.round(a * 255);
  const hexAlpha = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();

  return `#${hex}`;
};

export const invertColor = function (inputHex: any, bw: any) {
  let hex;
  if (inputHex === '#HHHHHH') {
    return '#000';
  }
  if (inputHex.indexOf('rgba') > -1) {
    hex = rgbaToHex(inputHex);
  } else {
    hex = inputHex;
  }
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6 && hex.length !== 8) {
    throw new Error('Invalid HEX color.');
  }
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? '#000000' : '#FFFFFF';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  //@ts-ignore
  return `#${padZero(r)}${padZero(g)}${padZero(b)}`;
};
