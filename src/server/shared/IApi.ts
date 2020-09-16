import { IData } from './IData';

export interface IApi {
  getInfo(): Promise<IData>;
  getBlogList(): Promise<IData>;
  getBlogCategories():Promise<IData>;
  getBlogArchives():Promise<IData>;
  getBlogCurrentInfoAndTypeAndTag():Promise<IData>;
}