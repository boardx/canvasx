export function invertColor(inputHex, bw) {
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
  return `#${r.padStart(2, "0")}${g.padStart(2, "0")}${b.padStart(2, "0")}`;
}

export default invertColor;
