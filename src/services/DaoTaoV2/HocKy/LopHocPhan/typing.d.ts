import { type PhieuDangKyTinChi } from '@/services/DangKyTinChi/PhieuDangKyTinChi/typing';
import { type HocPhan } from '@/services/DanhMucHeThong/HocPhan/typings';
import type { ETrangThaiDotThanhToan } from '@/services/HocPhi/constant';
import type { DotQuyDoiDiem } from '@/services/KetQuaHocTap/DotQuyDoiDiem/typing';
import { type ELoaiDiemChu } from '@/services/KetQuaHocTap/constant';
import type { LopHanhChinh } from '@/services/NamHoc/LopHanhChinh/typings';
import type { EDoiTuongLopHanhChinh } from '@/services/NamHoc/constant';
import { type SinhVien } from '@/services/SinhVien/typings';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import { type HocKy } from '../HocKy/typing';
import { type ThoiKhoaBieu } from '../ThoiKhoaBieu/typing';
import type {
	EHinhThucGiangDay,
	ELoaiHinhHocTap,
	ELoaiHocPhanDangKyTinChi,
	ELoaiLogLopHocPhan,
	ELoaiLopHocPhan,
	ELoaiPhanCongGiangDay,
	ELoaiThayDoiHocVien,
	ETrangThaiDiemLop,
	ETrangThaiDuyetDiem,
	ETrangThaiDuyetGiangDay,
	ETrangThaiLopHocPhan,
	ETrangThaiThi,
} from '../constant';

declare module LopHocPhan {
	export interface IRecord {
		_id: string;
		ten: string;
		tenCha?: string;
		// maLop: string;
		// maLopCha?: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;
		siSoToiDa: number;
		siSo?: number; // Sĩ số hiện tại
		loai: ELoaiLopHocPhan;
		soThuTuLop?: number;
		soThuTuNhom?: number;
		moodleShortname?: string | null;
		trangThaiDuyetGiangDay?: ETrangThaiDuyetGiangDay;
		hinhThucGiangDay?: EHinhThucGiangDay;

		// 1 lớp tín chỉ cho n lớp hành chính
		// Lúc thêm mới lớp tín chỉ thì gửi kèm
		lopHpHcList?: Partial<ILopHpLopHc>[];
		// Fake
		maLopHpHcList?: string[];
		doiTuongLopHanhChinh?: EDoiTuongLopHanhChinh;

		/** Danh sách khóa ngành định hướng cho lớp học phần này */
		listLopHpKn?: ILopHpKhoaNganh[];

		dotHuyId?: string;
		trangThaiLop: ETrangThaiLopHocPhan;
		trangThaiDiemLop: ETrangThaiDiemLop;
		thoiGianNhapDiem?: { start: string; end: string };

		parent?: IRecord;
		children?: IRecord[];
		cauHinhTkb?: TCauHinhGiaiDoan[];
		maHoaLichHoc?: TMaHoaLichHoc[];
		thoiKhoaBieuList?: ThoiKhoaBieu.IRecord[];
		/** Lớp ghép thời khóa biểu cùng */
		tenLopGhepTkb?: string;
		lopGhepTkb?: IRecord;

		// Populated
		deCuong?: Partial<HocPhan.IDeCuongHocPhanHocKy>;
		nhanSuList?: IRecordNhanSuLopHP[];

		//Lớp nhu cầu
		lopNhuCau: boolean;
		dotDangKyNhuCauId: string;
		danhSachLhpSv: ISinhVienNhuCau[];
	}

	export type ISinhVienNhuCau = {
		lopHocPhanId?: string;
		sinhVienSsoId: string;
		maKhoaNganh: string;
	};

	export type TMaHoaLichHoc = {
		id?: string; // Fake id
		thu: number;
		tietBatDau: number;
		soTiet: number;
		nhanSuSsoId?: string; //SsoId
		nhanSu?: ToChucNhanSu.INhanSu;
		maNhanSu?: string;
		tenNhanSu?: string;

		loaiHinhHocTap?: ELoaiHinhHocTap;
		maNhomTietHoc?: string;
		danhSachTuan: { tuan: number; tkbId: string }[];
		phongHoc?: string;

		// FAKE IN FRONT END
		lopHocPhanId?: string; // Fake
		tenLop?: string; // Fake
		tenHocPhan?: string;
	};

	export type TCauHinhGiaiDoan = {
		tuan: number;
		soTiet: number;
	};

	export interface IRecordSinhVienLopHP extends IHocPhi {
		_id: string;
		lopHocPhanId: string;
		lopHocPhan?: IRecord;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
		maKhoaNganh?: string;

		maSvHk?: string; // {ssoId}|{maHocKy}
		idPhieuDktc?: string;
		// phieuDktc: ;
		loai?: ELoaiHocPhanDangKyTinChi;

		diemHpSvHk?: IDiemHpSvHk;
		createdAt?: string;

		// temp for đăng ký tín chỉ
		// lopChuyenToi?: IRecord; // Temp
		// trangThaiChuyenLop?: { success: boolean; reason: string };
	}

	export interface IDiemHpSvHk extends IDiemThanhPhan, IDiemThi, IDiemTongKet {
		_id: string;
		sinhVienSsoId: string;
		maSinhVien: string;
		sinhVien?: SinhVien.IRecord;
		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		// Điểm có từ lớp học phần?
		tenLopHocPhan?: string;
		lopHocPhan?: IRecord;

		// Điểm có từ quy đổi điểm?
		dotDangKyQuyDoiDiemId: string;
		dotDangKyQuyDoiDiem?: DotQuyDoiDiem.IRecord;
		isCongNhanQuyDoiDiem?: boolean;

		trangThaiDuyetDiemThanhPhan?: ETrangThaiDuyetDiem;
		trangThaiDuyet?: ETrangThaiDuyetDiem;

		khoa: boolean; // Khóa điểm thành phần
		khoaDiemThi: boolean; // Khóa điểm thi
		public: boolean;

		maKhoaNganh: string;
		khoaNganh: KhoaNganh.IRecord;
	}

	export interface IDiemThanhPhan {
		diemThanhPhan1?: number;
		diemThanhPhan2?: number;
		diemThanhPhan3?: number;
		diemThanhPhan4?: number;
		diemThanhPhan5?: number;
		diemThanhPhan6?: number;
		diemThanhPhan7?: number;
		diemThanhPhan8?: number;
		diemThanhPhan9?: number;
		diemThanhPhan10?: number;
		trangThaiThi?: ETrangThaiThi;
	}

	export interface IDiemThi {
		diemThi1?: number;
		diemThamDinh?: number;
		diemPhucKhao?: number;
		diemThi2?: number;
	}

	export interface IDiemTongKet {
		diemKthp?: number;
		diemTongKet?: number;
		diemThang4?: number;
		diemChu?: ELoaiDiemChu;
	}

	interface IHocPhi {
		billItemId?: string;
		trangThaiThanhToan?: ETrangThaiDotThanhToan;
	}

	export interface IRecordNhanSuLopHP {
		_id: string;
		lopHocPhanId: string;
		lopHocPhan: IRecord;
		nhanSuSsoId: string;
		nhanSu?: ToChucNhanSu.INhanSu;
		maNhanSu?: string;
		tenNhanSu?: string;

		loai?: ELoaiPhanCongGiangDay;
		ghiChuThinhGiang?: string;
	}

	export type TInitConfig = {
		maMonHoc: string;
		tongDangKy: number;
		capChiaLop: 1 | 2;
		sySoToiDa: number[];
	};

	export interface ILopDuKien {
		_id: string;
		ten: string;
		hocKyFk: string;
		hocKy?: HocKy.IRecord;
		hocPhanFk: string;
		hocPhan: HocPhan.IRecord;
		tongSoNhuCau: number;
		siSoToiDa: number;
		siSoNhomToiDa: number;
		siSoToiThieu: number;
		thongTinLop?: Partial<IRecord>[];
	}

	export interface ILogLopHocPhan {
		_id: string;
		loai: ELoaiLogLopHocPhan;
		loaiThayDoiHocVien?: ELoaiThayDoiHocVien;
		idLopGoc: string;
		idLopChuyen?: string;
		hocVienSsoId: string;
		maHocVien: string;
		tenHocVien: string;
		hocVien?: SinhVien.IRecord;
		lopGoc?: IRecord;
		lopChuyen?: IRecord;
		idPhieuDangKyTinChi: string;
		phieuDangKyTinChi: PhieuDangKyTinChi.IRecord;
	}

	export interface ILopHpLopHc {
		_id?: string;
		maLopHp: string;
		lopHocPhan?: IRecord;
		maLopHc: string;
		lopHanhChinh?: LopHanhChinh.IRecord;
	}

	export interface IThongKeTyLeNhapDiem {
		chuaNhap: number;
		daNhap: number;
	}
}
