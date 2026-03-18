import type { HocKy } from '@/services/HocKy/HocKy/typing';
import type { ELoaiThanhPhanHoiDong } from '@/services/constant';

declare module DotXetHocVu {
	export interface IRecord {
		_id: string;
	}

	export interface IThanhVienHoiDong {
		_id: string;
		maHocKy: string;
		nhanSuSsoId: string;
		hoTen: string;
		thanhPhan: ELoaiThanhPhanHoiDong;
		chucVu?: string;
		soDienThoai?: string;
		email?: string;
	}
	export interface ITaiLieu {
		_id: string;
		ten: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		urls: string[];
	}
}
