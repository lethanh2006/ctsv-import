import type { HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import type { QuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/QuyetDinh/typing';
import type { HocKy } from '@/services/HocKy/HocKy/typing';
import type { SinhVien } from '@/services/SinhVien/typings';
import type { ETrangThaiSinhVienDot } from '@/services/constant';
import type {
	ELoaiHocPhanMinhChung,
	EMinhChungQuyDoiDiem,
	ETrangThaiDotQuyDoiDiem,
	ETrinhDoMinhChungQuyDoiDiem,
} from '@/services/constant';

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

	export interface IQuyDoiDiemSinhVien {
		_id: string;
		create: boolean;
		danhSachMinhChungQuyDoi: IMinhChungQuyDoiDiem[];
		sinhVienSsoId: string;
		sinhVien: SinhVien.IRecord;
		maSinhVien: string;
		hoTen: string;
		maDon: string;
		maHocPhan: string;
		hocPhan: HocPhan.IRecord;
		diemHe10: number;
		diemHe4: number;
		diemChu: string;

		trangThai: ETrangThaiSinhVienDot;

		ghiChu: string;
		nguoiChoYKienSsoId: string;
		hoTenNguoiChoYKien: string;
		thoiGianChoYKien: Date;

		soQuyetDinh: string;
		thoiGianBanHanh: Date;

		dotDangKyQuyDoiDiemId: string;
	}

	export interface IMinhChungQuyDoiDiem {
		_id: string;
		quyDoiDiemSvId: string;

		loai: EMinhChungQuyDoiDiem;
		tenChungChi: string;
		bacChungChi: string;
		donViCap: string;
		thoiGianHieuLuc: Date;
		thoiGianHetHieuLuc: Date;
		urlsChungChi: string[] | null;

		loaiHocPhan: ELoaiHocPhanMinhChung;
		tenHocPhan: string;
		maHocPhan: string;
		trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem;
		tenTruong: string;
		soTinChi: number;
		diemHe10: number;
		diemHe4: number;
		diemChu: string;
		urlsHocPhan: string[] | null;
	}

	export type TSinhVienMinhChung = {
		thongTinQuyDoiDiemSinhVien: IQuyDoiDiemSinhVien;
		danhSachMinhChung: Partial<IMinhChungQuyDoiDiem>[];
	};

	export type TRaQuyetDinhQuyDoiDiem = {
		quyetDinh: QuyetDinh.IRecord;
		danhSachSinhVien: Partial<IQuyDoiDiemSinhVien>[];
	};

	export interface IThongKeSVQuyDoiDiem {
		choXuLy: string;
		// choRaQuyetDinh: string;
		daRaQuyetDinh: string;
		khongCongNhan: string;
	}
}
