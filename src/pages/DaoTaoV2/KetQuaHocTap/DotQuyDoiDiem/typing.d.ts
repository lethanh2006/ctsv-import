import type { HocPhan } from '@/services/DanhMucHeThong/HocPhan/typings';
import type { QuyetDinh } from '@/services/DanhMucHeThong/QuyetDinh/typing';
import type { HocKy } from '@/services/HocKy/HocKy/typing';
import type { SinhVien } from '@/services/SinhVien/typings';
import type { ETrangThaiSinhVienDot } from '@/services/constant';
import type {
	ELoaiHocPhanMinhChung,
	EMinhChungQuyDoiDiem,
	ETrangThaiDotQuyDoiDiem,
	ETrangThaiHocPhanQuyDoi,
	ETrangThaiPhieuQuyDoiDiem,
	ETrinhDoMinhChungQuyDoiDiem,
} from '../constant';

declare module DotQuyDoiDiem {
	export interface IRecord {
		_id: string;
		tenDot: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		thoiGianBatDauLayYKien: string;
		thoiGianKetThucLayYKien: string;

		trangThai: ETrangThaiDotQuyDoiDiem;
		ghiChu: string;
	}

	export interface IPhieuDangKyQuyDoiDiem {
		_id: string;
		sinhVienSsoId: string;
		sinhVien: SinhVien.IRecord;
		maSinhVien: string;
		hoTen: string;
		maDon: string;
		trangThai: ETrangThaiPhieuQuyDoiDiem;
		soQuyetDinhId: string;
		quyetDinh: QuyetDinh.IRecord;
		thoiGianBanHanh: Date;
		dotDangKyQuyDoiDiemId: string;
		danhSachHocPhan: IQuyDoiDiemSinhVien[];
		urlsMinhChung: string[] | null;
		ghiChu: string;

		soTinChiDaCongNhan: number;
		soTinChiChuongTrinhDaoTao: number;
		soTinChiCongNhanDot: number;

		maKhoaNganh: string;
		khoaNganh?: KhoaNganh.IRecord;
	}

	export interface IQuyDoiDiemSinhVien {
		_id: string;
		phieuDangKyQuyDoiDiemId: string;
		phieuDangKyQuyDoiDiem: string;
		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;

		// Kết quả
		diemHe10: number;
		diemHe4: number;
		diemChu: string;
		trangThai: ETrangThaiHocPhanQuyDoi;
		ghiChu: string;
		khuyenNghi: string[];

		// Người cho ý kiến?
		nguoiChoYKienSsoId: string;
		hoTenNguoiChoYKien: string;
		thoiGianChoYKien: Date;

		//Minh chứng
		loai: EMinhChungQuyDoiDiem;
		tenChungChi: string;
		urlsChungChi: string;
		diemChungChi: string;
		bacChungChi: string;
		donViCap: string;
		thoiGianHieuLuc: Date;
		thoiGianHetHieuLuc: Date;

		// Minh chứng học phần
		tenHocPhan: string;
		trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem;
		tenTruong: string;
		maHocPhanMinhChung: string;
		soDVHT: number;
		soTinChi: number;
		diemHe10MinhChung: number;
		diemHe4MinhChung: number;
		diemChuMinhChung: string;
		urlsHocPhan: string;
		loaiHocPhan: ELoaiHocPhanMinhChung;
		namTotNghiep: number;
		nganh: number;
	}

	export type TSinhVienMinhChung = {
		danhSachHocPhanDangKyQuyDoiDiem: IQuyDoiDiemSinhVien[];
		hoTen: string;
		maDon: string;
		maSinhVien: string;
		sinhVienSsoId: string;
		urlsMinhChung: string[] | null;
		maKhoaNganh: string;
	};

	export type TRaQuyetDinhQuyDoiDiem = {
		quyetDinh: QuyetDinh.IRecord;
		danhSachPhieuDangKyId: string[];
		url?: string | null;
	};

	export interface IThongKeSVQuyDoiDiem {
		choXuLy: number;
		daCoKetQua: number;
		daRaQuyetDinh: number;
	}
}
