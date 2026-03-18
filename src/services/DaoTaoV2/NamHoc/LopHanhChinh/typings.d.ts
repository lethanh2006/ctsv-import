import { type SinhVien } from '@/services/SinhVien/typings';
import type { EDoiTuongLopHanhChinh } from '@/services/constant';
import type { HocKy } from '../../HocKy/HocKy/typing';

declare module LopHanhChinh {
	export interface IRecord {
		_id: string;
		ten: string;
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: NganhDaoTao.IRecordCoSo;
		siSo: number;
		nhanSuSsoId?: string;
		nhanSu?: ToChucNhanSu.INhanSu;
		doiTuong?: EDoiTuongLopHanhChinh;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IRecordSinhVien {
		_id: string;
		lopHanhChinhId: string;
		lopHanhChinh?: IRecord;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
	}

	export interface INhanSuHocKy {
		_id: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		nhanSuSsoId: string;
		hoTenNhanSu: string;
		maNhanSu: string;
		nhanSu?: ToChucNhanSu.INhanSu;

		tenLopHc: string;
		lopHc?: IRecord;
	}
}
