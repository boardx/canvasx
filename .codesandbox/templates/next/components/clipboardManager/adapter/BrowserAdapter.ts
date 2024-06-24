import { BaseAdapter } from './BaseAdapter';

export class BrowserAdapter extends BaseAdapter {
  canHandle(sourceType: string): boolean {
    return sourceType === 'browser';
  }

  async convert(data: any): Promise<any> {
    // Example conversion logic for browser content
    if (data.type === 'text') {
      return { contentType: 'text', content: data.content };
    } else if (data.type === 'image') {
      return {
        contentType: 'image',
        content: await this.convertImageToBase64(data.content),
      };
    }
    throw new Error('Unsupported data type');
  }

  private async convertImageToBase64(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = imageUrl;
    });
  }
}
