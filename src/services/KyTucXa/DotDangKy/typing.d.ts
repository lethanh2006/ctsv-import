import type { ETrangThaiPhatHanh } from '../constant';

declare module DotDangKyKTX {
    export interface IRecord {
        _id: string;
        tenDot: string;
        maHocKy: string;
        thoiGianBatDau: string;
        thoiGianKetThuc: string;
        ngayChuyenVao: string;
        ngayChuyenRa: string;
        loaiDot?: 'Theo khoa' | 'Theo danh sách';
        cauHinhKhoaToa?: ICauHinhKhoaToa[];
        hanDuyetMien?: string | null;
        maKhoaNganh: string[];
        danhSachToaNha?: string[];
        danhSachPhong?: string[];
        ghiChu: string;
        soLuongDon: number;
        trangThaiPhatHanh: ETrangThaiPhatHanh;
    }

    export interface IThongKeDotTongQuan {
        tongSoDot: number;
        soLuongDaPhatHanh: number;
        soLuongChuaPhatHanh: number;
        soLuongDangDienRa: number;
        soLuongDaKetThuc: number;
    }

    export interface IThongKeDotChiTiet {
        thongTinPhong: {
            soLuongChoConTrong: number;
            soLuongPhongChoThue: number;
            soLuongPhongConTrong: number;
            tongSucChua: number;
        };
        thongTinSinhVien: {
            soLuongSinhVienChuaDangKy: number;
            soLuongSinhVienDaDangKy: number;
        };
    }
}
