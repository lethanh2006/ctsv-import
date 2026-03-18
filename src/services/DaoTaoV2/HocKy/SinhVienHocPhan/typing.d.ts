import type { HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import type { SinhVien } from '@/services/SinhVien/typings';
import type { HocKy } from '../HocKy/typing';
import type { ELoaiHpSv, ETrangThaiThi } from '@/services/constant';

declare module SinhVienHpHk {
	export interface IRecord {
		_id: string;
		sinhVienSsoId: string;
		maSinhVien: string;
		hoTenSinhVien: string;
		sinhVien?: SinhVien.IRecord;
		maKhoaNganh?: string;
		khoaNganh?: KhoaNganh.IRecord;

		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		loai: ELoaiHpSv;
		diemTongKet: number;
		diemTongKetThang4: number;
		diemChu: string;
		trangThaiThi: ETrangThaiThi;
	}
}
