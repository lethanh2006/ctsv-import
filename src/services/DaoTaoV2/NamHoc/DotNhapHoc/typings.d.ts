declare module DotNhapHoc {
  export interface IRecord {
    _id: string;
    ten: string;
    soThuTu: number;
    khoasinhVienSsoId: string;
    khoaSinhVien?: KhoaSinhVien.IRecord;
    thoiGianBatDau?: string;
    thoiGianKetThuc?: string;
    createdAt?: string;
    updatedAt?: string;
  }
}
