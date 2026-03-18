import type { ELoaiDiemDanh, ETrangThaiUserDiemDanh } from './constant';

declare module DiemDanh {
	export interface IRecordNhom {
		_id: string;
		ten: string;
		ma: string;
		diaDiem: string;
		loai: ELoaiDiemDanh;
		kichHoat: boolean;
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
		khoaDiemDanh: string;
		maNhomQr: string;
		maNhomUrl: string;
		maDoiTuong: string;
		chuKy: number;
		tongDiemDanh: number;
		tongDiemDanhCoMat: number;
		tongDiemDanhVangCoPhep: number;
		tongDiemDanhVangKhongPhep: number;
	}

	export interface IUserDiemDanh {
		_id: string;
		idUser: string;
		maUser: string;
		hoTenUser: string;
		maNhomDiemDanh: string;
		nhomDiemDanh?: IRecordNhom;
		maDoiTuong: string;
		thoiGian: string;
		trangThai: ETrangThaiUserDiemDanh;
	}
}
