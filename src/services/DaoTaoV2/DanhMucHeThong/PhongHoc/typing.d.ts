import type { ThoiKhoaBieu } from '@/services/HocKy/ThoiKhoaBieu/typing';
import type { ELoaiPhongHoc, ETrangThaiPhong } from '@/services/constant';

declare module PhongHoc {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		diaChi: string;
		maToaNha: string;
		toaNha?: ToaNha.IRecord;
		soTang: number;
		soPhong: string;
		sucChua: number;
		sucChuaHoc: number;
		sucChuaThi: number;
		trangThai: ETrangThaiPhong;
		loaiPhong: ELoaiPhongHoc;
		thoiKhoaBieuList?: ThoiKhoaBieu.IRecord;
	}
}
