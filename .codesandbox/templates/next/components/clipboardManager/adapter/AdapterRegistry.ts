import { ISourceAdapter } from './BaseAdapter';

export class AdapterRegistry {
  private adapters: ISourceAdapter[] = [];

  registerAdapter(adapter: ISourceAdapter): void {
    this.adapters.push(adapter);
  }

  findAdapter(sourceType: string): ISourceAdapter | undefined {
    return this.adapters.find((adapter) => adapter.canHandle(sourceType));
  }

  async convertData(sourceType: string, data: any): Promise<any> {
    for (const adapter of this.adapters) {
      if (adapter.canHandle(sourceType)) {
        return adapter.convert(data);
      }
    }
    throw new Error('No suitable adapter found for this data type');
  }
}

// // Example usage
// const registry = new AdapterRegistry();
// registry.registerAdapter(new BrowserAdapter());
// registry.registerAdapter(new FileSystemAdapter());

// Usage would be wrapped in a try/catch for error handling
