// Define a general interface for source adapters
interface ISourceAdapter {
  canHandle(sourceType: string): boolean;
  handleCopy(data: any, canvas: any): Promise<any>;
  handlePaste(data: any, canvas: any): Promise<any>;
  convert(data: any): Promise<any>;
}

// Base class for source adapters implementing the ISourceAdapter interface
abstract class BaseAdapter implements ISourceAdapter {
  abstract handleCopy(data: any, canvas: any): Promise<any>;
  abstract handlePaste(data: any, canvas: any): Promise<any>;
  abstract canHandle(sourceType: string): boolean;
  abstract convert(data: any): Promise<any>;
}

export { BaseAdapter };
export type { ISourceAdapter };
