import {
  BrowserAdapter,
  WhiteboardAdapter,
  BoardAdapter,
  FileSystemAdapter,
  SpreadsheetAdapter,
  BoardWidgetsAdapter,
} from './clipboardManager/adapter';
import { ClipboardManager } from './clipboardManager/ClipboardManager';

import { AdapterRegistry } from './clipboardManager/adapter/AdapterRegistry';

// Initialize the adapter registry
const adapterRegistry = new AdapterRegistry();
adapterRegistry.registerAdapter(new BrowserAdapter());
adapterRegistry.registerAdapter(new WhiteboardAdapter());
adapterRegistry.registerAdapter(new BoardAdapter());
adapterRegistry.registerAdapter(new FileSystemAdapter());
adapterRegistry.registerAdapter(new SpreadsheetAdapter());
adapterRegistry.registerAdapter(new BoardWidgetsAdapter());

const clipboardManager = new ClipboardManager(adapterRegistry);

function loadCopyPasteService(canvas: any) {
  document.addEventListener('copy', async function (e) {
    e.preventDefault();
    const target: any = e.srcElement || e.target;
    var activeObject = canvas.getActiveObject();
    if (!activeObject) {
      return;
    }

    if (e) {
      if (target.tagName) {
        if (
          target.isEditing ||
          target.tagName.toUpperCase() === 'INPUT' ||
          target.tagName.toUpperCase() === 'TEXTAREA'
        ) {
          return;
        }
      }
    }

    // handleCanvasCopy(e, activeObject);
    const data = {
      type: 'boardWidgets',
      content: JSON.stringify(
        activeObject._objects
          ? activeObject.getObjects().map((obj: any) => obj.toObject())
          : [activeObject.toObject()]
      ),
      metadata: {},
    };

    clipboardManager.copy(data, canvas);
  });
  function generateHashId(text: string) {
    let hash = 0;
    if (text.length === 0) return hash;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(36); // Convert to base 36 for shorter ID
  }

  async function detectSpreadsheetClipboard(text: string) {
    try {
      if (text.includes('\t')) {
        console.log('Clipboard content contains tab-separated values.');
        return true;
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
    console.log('Clipboard content is not from a spreadsheet.');
    return false;
  }

  function getLocalStorageHashForBoardWidgets(text: string) {
    const hashId = generateHashId(text);
    const storedData = localStorage.getItem('clipboarddata');
    if (storedData) {
      const { hashId: storedHashId, data } = JSON.parse(storedData);
      if (hashId === storedHashId) {
        return data;
      }
    }
    return null;
  }
  document.addEventListener('paste', async function (e: any) {
    const text = (await readClipboardTextData()) || '';
    const isThisSheet = await detectSpreadsheetClipboard(text);
    const localClipboardWidgets = getLocalStorageHashForBoardWidgets(text);

    //check if the clipboard is file
    const items = e.clipboardData.items;
    const imageFile = await readClipboardImageData();

    if (imageFile) {
      const file = imageFile;
      const data = {
        type: 'png',
        content: file,
        metadata: { type: 'image' },
      };
      clipboardManager.paste(data, canvas);
    }

    if (isThisSheet) {
      const data = {
        type: 'spreadsheet',
        content: text,
        metadata: {},
      };
      clipboardManager.paste(data, canvas);
    }

    if (localClipboardWidgets) {
      const data = {
        type: 'boardWidgets',
        content: JSON.parse(localClipboardWidgets),
        metadata: {},
      };
      clipboardManager.paste(data, canvas);
    }
  });

  async function readClipboardTextData() {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const clipboardContent = await item.getType('text/plain');
        if (clipboardContent) {
          const text = await clipboardContent.text();
          return text;
        }
      }
    } catch (error) {
      console.error('Failed to read clipboard text data:', error);
    }
    return '';
  }

  async function readClipboardImageData() {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        if (item.getType) {
          const clipboardContent = await item.getType('image/png');

          return clipboardContent;
        }
      }
    } catch (error) {
      console.error('Failed to read clipboard image data:', error);
    }
    return null;
  }
}

export default loadCopyPasteService;
