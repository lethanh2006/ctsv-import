import type {
	EChucVuThanhVienCauLacBo,
	ELoaiThanhVienCauLacBo,
	ETrangThaiHoatDong,
	ETrangThaiThanhVien,
	EVaiTroThanhVienPhongBan,
} from './constant';

declare module CauLacBo {
	export interface IRecord {
		_id: string;
		ten: string;
		logo: string | null;
		slogan: string;
		mucDich: string;
		yNghia: string;
		donViQuanLy: string;
		noiQuyQuyChe: string | null;
		quyetDinhThanhLap: string | null;
	}

	export interface PhongBan {
		_id: string;
		cauLacBoId: string;
		ten: string;
		moTa: string;
	}

	export interface ThanhVien {
		_id: string;
		sinhVienSsoId: string;
		hoTen: string;
		maSinhVien: string;
		cauLacBoId: string;
		chucVuThanhVienCauLacBo: EChucVuThanhVienCauLacBo;
		namHoc: string;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		danhSachBanBoPhan: { vaiTroThanhVienBanBoPhan: EVaiTroThanhVienPhongBan; banBoPhanId: string }[];
		trangThai: ETrangThaiThanhVien;
		loaiThanhVien: ELoaiThanhVienCauLacBo;
		[x: string]: string;
	}

	export interface HoatDong {
		_id: string;
		idCauLacBo: string;
		ten: string;
		thoiGianDuKien: string;
		noiDung: string;
		ghiChu: string;
		minhChung: string;
		fileDinhKem: string[];
		trangThai: ETrangThaiHoatDong;
	}
}
