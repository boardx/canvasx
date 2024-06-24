import { ClipboardData } from './ClipboardData';
import { IClipboardManager } from './IClipboardManager';
import { AdapterRegistry } from './adapter/AdapterRegistry';

class ClipboardManager implements IClipboardManager {
  private adapterRegistry: AdapterRegistry;

  constructor(adapterRegistry: AdapterRegistry) {
    this.adapterRegistry = adapterRegistry;
  }

  async copy(data: ClipboardData, canvas: any): Promise<void> {
    // Find the appropriate adapter for the data type
    const adapter = this.adapterRegistry.findAdapter(data.type);
    if (adapter) {
      adapter.handleCopy(data, canvas);
    }
  }

  async paste(data: any, canvas: any): Promise<any> {
    if (data) {
      // Find the adapter for the stored data type
      const adapter = this.adapterRegistry.findAdapter(data.type);
      if (adapter) {
        // Use the adapter to convert data during paste
        return await adapter.handlePaste(data, canvas);
      }
    }
    return false;
  }

  clear(): void {
    localStorage.removeItem('clipboarddata');
  }
}

export { ClipboardManager };
