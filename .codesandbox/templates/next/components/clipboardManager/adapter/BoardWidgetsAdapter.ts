import { BaseAdapter } from './BaseAdapter';
import * as fabric from '../../../../../../fabric';

function generateUUID(length = 8) {
  const characters = '0123456789abcdef'; // Hexadecimal characters
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
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

async function setClipboard(text: String) {
  console.log('setClipboard', text);
  const type = 'text/plain';
  //@ts-ignore
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  await navigator.clipboard.write(data);
  console.log('Text copied to clipboard', navigator.clipboard);
}

function handleCanvasCopy(e: any, canvas: any) {
  const activeObj = canvas.getActiveObject();

  const cloneData = [];

  let data = null;

  let group;

  if (
    activeObj &&
    activeObj._objects &&
    activeObj._objects.length > 0 &&
    !activeObj.id
  ) {
    group = canvas.getActiveObject()._objects;
  }

  if (group) {
    for (let i = 0; i < group.length; i++) {
      const obj = group[i];

      if (!obj.id) {
        return;
      }

      data = canvas.findById(obj.id).toObject(['objType', 'text', 'id']);

      data.left += 10;

      data.top += 10;

      cloneData.push(data);
    }
  } else {
    data = canvas.getActiveObject().toObject(['objType', 'text', 'id']);
    data.left = 0;
    data.top = 0;
    cloneData.push(data);
  }

  if (cloneData.length === 0) return;

  const copyJson = JSON.stringify({
    data: cloneData,
    type: 'whiteboard',
  });

  const copyText = cloneData.map((item) => item.text).join('\n');
  const hashId = generateHashId(copyText);

  localStorage.setItem(
    'clipboarddata',
    JSON.stringify({ hashId, data: copyJson })
  );

  setClipboard(copyText);
}

export class BoardWidgetsAdapter extends BaseAdapter {
  handleCopy(data: any, canvas: any): Promise<any> {
    handleCanvasCopy(data, canvas);
    return Promise.resolve(true);
  }
  handlePaste(data: any, canvas: any): Promise<any> {
    const { content: jsonObject, type } = data;
    const parsedData = jsonObject.data;
    const center = canvas.getVpCenter();
    const offset = 10;
    const addedWidgets: any = [];
    parsedData.forEach(async (item: any) => {
      item.left += center.x + offset;
      item.top += center.y + offset;
      item.id = generateUUID();
      const newWidget = await canvas.createWidgetAsync(item);
      canvas.add(newWidget);
      addedWidgets.push(newWidget);
    });

    setTimeout(() => {
      const newSelection = new fabric.ActiveSelection(addedWidgets, {
        canvas: canvas,
      });
      canvas.setActiveObject(newSelection);
      newSelection.setCoords();
      canvas.renderAll();
    }, 50);

    return Promise.resolve(true);
  }
  //   private authorizationManager: IAuthorizationManager;

  constructor() {
    super();
    // this.authorizationManager = authorizationManager;
  }

  canHandle(sourceType: string): boolean {
    return sourceType === 'boardWidgets';
  }

  async convert(boardData: BoardData): Promise<any> {
    // // Check permissions before proceeding
    // if (
    //   !this.authorizationManager.checkPermission(
    //     boardData.user,
    //     boardData,
    //     'copy'
    //   )
    // ) {
    //   throw new Error('Permission denied.');
    // }

    // Process and serialize each element on the board
    const serializedContent = boardData.elements.map((element) =>
      this.serializeElement(element)
    );
    return { contentType: 'boardContent', content: serializedContent };
  }

  private serializeElement(element: any): any {
    // Here we would have logic specific to each type of element.
    // For simplicity, let's assume a generic serialization for now.
    return JSON.stringify(element); // Simplified serialization logic
  }
}

// BoardData and Element might be defined as follows:
interface BoardData {
  user: User;
  elements: any[];
}

interface User {
  id: string;
  permissions: string[];
}
