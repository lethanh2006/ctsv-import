declare module HinhThucKhenThuong {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		soThuTu: number;
		moTa: string;
		suDung: boolean;
		loaiKhenThuongId: string;
		loaiKhenThuong?: LoaiKhenThuong.IRecord;
	}
}
