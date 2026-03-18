import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import type { NamHoc } from '../NamHoc/typings';
import type { ETrangThaiYKienKeHoachNamHoc } from '@/services/constant';

declare module KeHoachNamHoc {
	export interface IRecord {
		_id: string;
		hoatDongTuan?: LoaiHoatDongTuan.IRecord;
		hoatDongTuanId: string;
		khoaNganh: KhoaNganh.IRecord;
		maKhoaNganh: string;
		lopHanhChinhId: string;
		namHocId: string;
		thuTuTuan: number;
		active: boolean;
		phienBanId: string;

		createdAt?: string;
		updatedAt?: string;
	}

	export interface IKeHoachTheoTuan {
		namHocId?: string;
		maKhoaNganhList: string[];
		tuanBatDau: number;
		tuanKetThuc: number;
		hoatDongTuanId?: string;
		hoatDongTuan?: LoaiHoatDongTuan.IRecord;
	}

	export type THeadGroup = {
		title: string;
		span: number;
		isBreak?: boolean;
	};

	export type TGridHeader = {
		hocKys?: THeadGroup[];
		weeks: number[];
		months: THeadGroup[];
		days: THeadGroup[];
	};

	export type TKeHoachData = {
		maKhoa?: string;
		maNganh?: string;
		maKhoaNganh: string;
		tenKhoaNganh: string;
		keHoachList: Partial<IRecord>[];
	};

	export interface YKienKeHoachNamHoc {
		_id: string;
		noiDung: string;
		namHocId: string;
		namHoc?: NamHoc.IRecord;
		nhanSuSsoId: string;
		nhanSu?: ToChucNhanSu.INhanSu;
		hoTen: string;
		maDonVi: string;
		donVi?: ToChucNhanSu.IDonVi;
		trangThai: ETrangThaiYKienKeHoachNamHoc;
	}
}
