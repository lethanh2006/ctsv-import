import { type EPhamViChuDe } from './constant';

declare module TinTuc {
  export interface IRecord {
    _id: string;
    tieuDe: string;
    idTopic: string;
    chuDe?: IChuDe;
    moTa: string;
    urlAnhDaiDien: string;
    noiDung: string;
    ngayDang: string;
    // phamVi: EPhamViChuDe;
    // hinhThucDaoTaoId: number;
    nguoiDang: {
      _id: string;
      fullname: string;
    };
    danhSachVaiTro: string[];
    doiTuong: 'Tất cả' | 'Vai trò';
  }

  export interface IChuDe {
    // phamVi: EPhamViChuDe;
    _id: string;
    name: string;
    type: string;
    order: number;
    // hinhThucDaoTaoId: string;
    // hinhThucDaoTao?: HinhThucDaoTao.IRecordCoSo;
  }
}
