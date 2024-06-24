import { BaseAdapter } from './BaseAdapter';

function generateUUID(length = 8) {
  const characters = '0123456789abcdef'; // Hexadecimal characters
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export class BoardAdapter extends BaseAdapter {
  handleCopy(data: any, canvas: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  handlePaste(data: any, canvas: any): Promise<any> {
    return Promise.resolve(true);
  }
  //   private authorizationManager: IAuthorizationManager;

  constructor() {
    super();
    // this.authorizationManager = authorizationManager;
  }

  canHandle(sourceType: string): boolean {
    return sourceType === 'board';
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
