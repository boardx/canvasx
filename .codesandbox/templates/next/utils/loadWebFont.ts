import WebFont from "webfontloader";

const loadWebFont = async function (font: string) {
  const WebFontConfig = {
    google: {
      api: "https://fonts.googleapis.com/css",
      families: [font],
    },
    timeout: 3000, // Set the timeout to two seconds
  };

  await WebFont.load(WebFontConfig);
};

export default loadWebFont;
export { loadWebFont };
