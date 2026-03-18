import type { HocKy } from '@/services/HocKy/HocKy/typing';
import type { ETrangThaiSinhVienBaoLuu } from '@/services/SinhVien/constant';
import type { ETrangThaiSinhVienDot } from '@/services/constant';
import type { ELoaiQuyetDinh } from '@/services/constant';

declare module QuyetDinh {
	export interface IRecord {
		_id: string;
		maHocKy?: string;
		hocKy?: HocKy.IRecord;
		loai: ELoaiQuyetDinh;
		soQuyetDinh: string;
		ngayBanHanh?: Date;
		noiDung: string;
		url?: string | null;

		danhSachSinhVien?: ISinhVienBaoLuuThoiHoc[];
	}

	export interface ISinhVienBaoLuuThoiHoc {
		_id: string;
		maSinhVien: string;
		sinhVienSsoId: string;
		hoTen: string;
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: KhoaNganh.IRecord;

		trangThai: ETrangThaiSinhVienDot; // Trạng thái duyệt
		maDon?: string; // Mã đơn sinh viên gửi
		lyDo?: string; // Lý do không duyệt
		ghiChu?: string;

		//Quyết định thôi học
		thoiGianHieuLuc?: string;

		//Quyết định bao lưu
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
		trangThaiBaoLuu: ETrangThaiSinhVienBaoLuu;

		//Quyết định
		quyetDinhId?: string;
		quyetDinh?: IRecord;
	}

	export type TDuyetQuyetDinh = {
		quyetDinh: IRecord;
		danhSachSinhVien: Partial<ISinhVienBaoLuuThoiHoc>[];
		trangThai: ETrangThaiSinhVienDot;
	};

	export type TThongKeSinhVienBaoLuu = {
		dangBaoLuu: number;
		quayLaiHoc: number;
		buocThoiHoc: number;
	};
}
