import { type ELoaiDiemChu } from '@/services/KetQuaHocTap/constant';

declare module QuyDoiDiem {
  export interface IRecord {
    _id: string;
    diemFrom: number;
    diemTo: number;
    diemThang4: number;
    diemChu: ELoaiDiemChu;
  }
}
