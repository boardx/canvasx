import { IDataSerializer } from './IDataSerializer';

class JSONDataSerializer implements IDataSerializer {
  serialize(data: any): string {
    return JSON.stringify(data);
  }

  deserialize(data: string): any {
    return JSON.parse(data);
  }
}

export default JSONDataSerializer;
