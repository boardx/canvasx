export interface IDataSerializer {
  serialize(data: any): string;
  deserialize(data: string): any;
}
