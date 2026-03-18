import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import type { DiemDanh } from '../DiemDanh/typing';
import type { LopHocPhan } from '../LopHocPhan/typing';
import type { ELoaiHinhHocTap, ETrangThaiGiamSat, ETrangThaiLopDiemDanh } from '@/services/constant';

declare module ThoiKhoaBieu {
	export interface IRecord {
		_id: string;
		tenLopHocPhan: string;
		lopHocPhan?: LopHocPhan.IRecord;
		nhanSuSsoId?: string; // 'string';
		nhanSu?: ToChucNhanSu.INhanSu;
		maNhanSu?: string;
		tenNhanSu?: string;

		ngay: string; //'2023-05-20T08:34:26.620Z';
		maNhomTietHoc: string; // 'string';
		nhomTietHoc: NhomTietHoc.IRecordCoSo;
		tietBatDau: number;
		tietKetThuc: number;
		phongHoc?: string;
		loaiHinhHocTap: ELoaiHinhHocTap;
		tieuDeBaiHoc?: string;
		noiDungBaiHoc?: string;
		urlBaiHoc?: string | null;
		thoiGianBatDau: string; //'2023-05-20T08:34:26.620Z';
		thoiGianKetThuc: string; // '2023-05-20T08:34:26.620Z';

		trangThaiGiamSat?: ETrangThaiGiamSat;
		ghiChuGiamSat?: string;
		chuyenVienGiamSatSsoId?: string;
		maChuyenVienGiamSat?: string;
		hoTenNguoiGiamSat?: string;

		// Điểm danh
		trangThaiDiemDanh: ETrangThaiLopDiemDanh;
		maNhomDiemDanh?: string;
		nhomDiemDanh?: DiemDanh.IRecordNhom;
	}

	export type TThoiKhoaBieuData = {
		lopHocPhan: LopHocPhan.IRecord;
		thoiKhoaBieuList: { chiTiet: TChiTietTKB[]; tuan: number }[];
		children?: TThoiKhoaBieuData[];
	};

	export type TChiTietTKB = {
		thu: number;
		tietBatDau: number;
		soTiet: number;
		nhanSuSsoId?: string; // 'string';
		nhanSu?: ToChucNhanSu.INhanSu;
	};

	export interface IImportResponse {
		res: 'VERIFY_FAILED' | 'SUCCEEDED' | 'ERRORED';
		errorList?: any[];
		nImported?: number;
		reason?: string;
	}

	export interface ILichHocTuan extends Omit<LopHocPhan.TMaHoaLichHoc, 'danhSachTuan' | 'thu'> {
		thu: string; // '1', '2',..., '7'
		danhSachTuanHoc: number[];
	}

	export type TUpdatePhanCongGiangDay = {
		nhanSuSsoId?: string;
		tkbIds: string[];
	};

	export type TUpdateGiamSat = Pick<IRecord, 'trangThaiGiamSat' | 'ghiChuGiamSat'>;
}
