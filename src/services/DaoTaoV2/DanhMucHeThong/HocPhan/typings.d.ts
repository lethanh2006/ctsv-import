import type { DangKyNhuCau } from '@/services/HocKy/DangKyNhuCau/typing';
import type { HocKy } from '@/services/HocKy/HocKy/typing';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import type { ELoaiHocLieu, ELoaiToChucDayHoc, ETrangThaiDeCuongHPHK } from '@/services/constant';

declare module HocPhan {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		tenTiengAnh?: string;
		maLoaiHocPhan: string;
		loaiHocPhan?: ILoaiHocPhan;
		soTinChi: number;
		maTrinhDoDaoTao: string;
		trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		maDonVi: string;
		donVi?: ToChucNhanSu.IDonVi;
		active: boolean;
		deCuongHienTaiId?: string;
		deCuongHienTai?: Partial<IDeCuongHocPhan>;

		createdAt?: string;
		updatedAt?: string;
	}

	export interface ILoaiHocPhan {
		_id: string;
		ma: string;
		ten: string;

		isTinhDiem: boolean;
		isTinhSoTinChiDangKy: boolean;
		isTinhSoTinChiTichLuy: boolean;
		// khoiTuChon?: boolean;
		// khoiTotNghiep?: boolean;
	}

	export interface IDeCuongHocPhan {
		_id: string;
		ma: string;
		maHocPhan: string;
		hocPhan: IRecord;
		nguoiBienSoan: string;
		ngayApDung: string;
		maCanCu: string;
		canCu: VanBanQuyDinh.IRecord;
		// soTinChi: number;
		// isTinhDiem: boolean;
		mucTieuHocPhan: string;
		noiDungTomTat: string;
		noiDungChiTiet: string;
		active: boolean;
		createdAt?: string;
		updatedAt?: string;
		url?: string | null;

		trongSo1?: number;
		trongSo2?: number;
		trongSo3?: number;
		trongSo4?: number;
		trongSo5?: number;
		trongSo6?: number;
		trongSo7?: number;
		trongSo8?: number;
		trongSo9?: number;
		trongSo10?: number;
	}

	export interface IGiangVienDeCuong {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		nhanSuSsoId: string | null;
		hoTen?: string | null;
		chucDanh?: string | null;
		hocHam?: string | null;
		hocVi?: string | null;
		soDienThoai?: string | null;
		diaChi?: string | null;
	}

	export interface ILichTrinhChung {
		_id: string;
		ten: string;
		deCuongHpId: string;
		gioLyThuyet: number;
		gioBaiTapTL: number;
		gioThucHanh: number;
		gioTuHoc: number;
	}

	export interface ITienTrinhHocPhan {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		tuan: number;
		noiDung: string;
		noiDungChinh: string;
		yeuCauSinhVien: string;
		ghiChu: string;
		ndTienTrinhList?: INoiDungTienTrinh[];
	}

	export interface INoiDungTienTrinh {
		_id: string;
		tienTrinhHpId: string;
		tienTrinhHp?: ITienTrinhHocPhan;
		loaiToChucDayHoc: ELoaiToChucDayHoc;
		soTiet: number;
	}

	export interface IHocLieuDeCuong {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		loaiHocLieu: ELoaiHocLieu;

		idTaiLieuThuVien?: number; // Tài liệu tinh vân
		loaiTaiLieuThuVien?: 'item' | 'edata';
		maTaiLieuThuVien?: string;
		tacGia?: string;
		tenNhaXuatBan?: string;
		namXuatBan?: number;

		tieuDe?: string;
		moTa?: string;
		url?: string;
		batBuoc: boolean;
	}

	export interface IDeCuongHocPhanHocKy extends DangKyNhuCau.TSoNhuCauHocPhan {
		_id: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		maHocPhan: string;
		tenHocPhan: string;
		soTinChi?: number;
		maDonVi: string;
		donVi?: ToChucNhanSu.IDonVi;
		hocPhan?: IRecord;
		deCuongId?: string;
		deCuong?: IDeCuongHocPhan;

		siSoLopToiThieu?: number;
		siSoLopToiDa?: number;
		siSoNhomToiThieu?: number;
		siSoNhomToiDa?: number;
		soNhuCauDuKien?: number;
		soNhuCauKeHoach?: number;
		soLopDuKien?: number;
		soLopThucTe?: number;

		maHocPhanHocKy: string;
		trangThaiDiem: ETrangThaiDeCuongHPHK;
		active: boolean;
	}

	export interface IThongKeNhuCau {
		soLuongHocPhan: number;
		soLuongLopHocPhan: number;
		tongSoNhuCauDuKien: number;
	}
}
