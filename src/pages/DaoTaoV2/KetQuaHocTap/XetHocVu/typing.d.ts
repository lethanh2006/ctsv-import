import type { HocKy } from '@/services/HocKy/HocKy/typing';
import type { SinhVien } from '@/services/SinhVien/typings';
import type { ELoaiThoiHoc, ETrangThaiDuyetCanhBao, EYKienCoVanHocTap } from '../constant';

declare module XetHocVu {
	export interface IRecord {
		_id: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
		maSinhVien: string;
		hoTen: string;
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: KhoaNganh.IRecord;
		tenLopHanhChinh: string;
		maKhoaNganh: string;
		khoaNganh?: KhoaNganh.IRecord;

		danhSachLyDo: ILyDo[];
		daChot: boolean;
		trangThai: ETrangThaiDuyetCanhBao;

		//ý kiến cố vấn học tập
		yKienCoVanHocTap: string;
		trangThaiYKienCVHT: EYKienCoVanHocTap;
		coVanHocTapSsoId: string;

		//Cảnh báo học tập
		thuTuKy: string;

		//Cảnh báo thôi học
		loaiThoiHoc: ELoaiThoiHoc;
	}

	export interface ILyDo {
		_id: string;
		canhBaoKqhtId?: string;
		// canhBaoKetQuaHocTap?: ICanhBaoHocTap;
		thoiHocId?: string;
		// thoiHoc?: IThoiHoc;

		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
		hoTen?: string;
		maSinhVien: string;
		maKhoaSinhVien: string;
		tenLopHanhChinh: string;

		noiDung?: string;
		isCoVanHocTap?: boolean;
		dongY?: boolean;
		yKien?: string;

		donViXuLy?: string;
	}

	export type TThongKeSV = {
		choDuyet: number;
		daDuyet: number;
		khongDuyet: number;
	};

	export interface IKyLuat {
		_id: string;
		sinhVienSsoId: string;
		sinhVien: SinhVien.IRecord;
		hoTen: string;
		maSinhVien: string;
		maHocKy: string;
		hocKy: HocKy.IRecord;
		biKyLuatThiHo: boolean;
		biThongBaoNoHocPhi: boolean;
		boHoc: boolean;
	}
}
