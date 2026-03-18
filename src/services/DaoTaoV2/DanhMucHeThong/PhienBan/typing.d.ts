import { type ELoaiPhienBan } from './constant';

declare module PhienBan {
  export interface IRecord {
    _id: string;
    loaiPhienBan: ELoaiPhienBan;
    canCuId: string;
    namHocId: string;
    chinhThuc: boolean;
    ten: string;
  }
}
