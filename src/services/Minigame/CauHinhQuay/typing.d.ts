export module MCauHinhQuay {
    interface IRecord {
        ten: string;
        soNguoiWin: number;
        tiLe: number;
        soLuotQuayTrongNgay: number;
        soLanTrungToiDaMoiNguoi: number;
        huongDan: string;
        kichHoat: boolean;
        ngayBatDau: string; // ISO date-time format
        ngayKetThuc: string; // ISO date-time format
        danhSachPhanThuong: IVongQuayInfo[];
    }

    interface IVongQuayInfo {
        trangThai: string;
        _id: string | null;
        ten: string;
        moTa: string;
    } 

    interface ICapNhatPhanThuong {
        _id: string,
        ten: string,
        moTa: string
    }
}