import * as WebFont from 'webfontloader';

export async function initializeFonts() {
  // Load the 'Inter' webfont
  await loadWebFont('Inter');
  // Load the 'Permanent Marker' webfont
  await loadWebFont('Permanent Marker');

  await loadWebFont('Poppins');

  await loadWebFont('Oswald');

  // The lines below are commented out, meaning they won't execute, but are left here for possible future use. They load different webfonts.
  // await Boardx.Util.loadWebFont('Caveat');
  // await Boardx.Util.loadWebFont('Liu Jian Mao Cao');
  // await Boardx.Util.loadWebFont('ZCOOL KuaiLe');
  // await Boardx.Util.loadWebFont('Zhi Mang Xing');
  // await Boardx.Util.loadWebFont('Yellowtail');
  // await Boardx.Util.loadWebFont('Noto+Sans+SC:wght@100;300;400;500;700;900');

  // After the font is loaded, clear the cache of the sticky note
  // If the board instance is defined, proceed to clear the cache.
}

const loadWebFont = async function (font: string) {
  const WebFontConfig = {
    google: {
      api: 'https://fonts.googleapis.com/css',
      families: [font],
    },
    timeout: 3000, // Set the timeout to two seconds
  };

  await WebFont.load(WebFontConfig);
};
