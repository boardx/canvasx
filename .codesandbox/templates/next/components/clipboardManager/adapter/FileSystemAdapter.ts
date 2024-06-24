import { BaseAdapter } from './BaseAdapter';
import { XImage } from '../../../../../../fabric';

export class FileSystemAdapter extends BaseAdapter {
  canHandle(sourceType: string): boolean {
    return ['docx', 'pdf', 'png'].includes(sourceType.toLowerCase());
  }
  handleCopy(data: any, canvas: any): Promise<any> {
    return Promise.resolve(data);
  }

  async handlePaste(data: any, canvas: any): Promise<any> {
    //create the XImage at t he cener of the viewport
    const center = canvas.getVpCenter();
    const offset = 10;
    const imageBase64 = await this.convertImageToBase64(data.content);
    const newImage = new XImage(imageBase64, {
      left: center.x + offset,
      top: center.y + offset,
      src: imageBase64,
      width: 100,
      height: 100,
    });
    await newImage.setSrc(imageBase64);
    canvas.add(newImage);
    newImage.setCoords();
    canvas.renderAll();

    return Promise.resolve(true);
  }

  async convert(data: File): Promise<any> {
    // Example conversion logic for different file types
    switch (data.type) {
      case 'application/pdf':
        return this.convertPDF(data);
      case 'png':
        return this.convertImageToBase64(data);
      // Additional cases for other file types
      default:
        throw new Error('Unsupported file type');
    }
  }

  private async convertPDF(file: File): Promise<any> {
    // Conversion logic for PDF files
    return { contentType: 'pdf', content: 'PDF data here' }; // Simplified
  }

  private async convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
