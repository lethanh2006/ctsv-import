import { type EVaiTroBieuMau } from '../TienIch/constant';
import { type ESuKienType, type ETrangThaiDienRa, type ELoaiSuKienSinhVien, type EReceiverType } from './constant';

declare module SuKien {
	export interface ThongTinSukien {
		_id: string;
		tenSuKien: string;
		maSuKien: string;
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
	}
	export interface ThongKeTheoNam {
		suKienChuaDienRa: number;
		suKienDangDienRa: number;
		suKienDaDienRa: number;
		thongKe?: ThongKeTheoSuKien[];
	}
	export interface ThongKeTheoSuKien {
		tenSuKien: string;
		tongNguoiDaThamDu: number;
		tongusers: number;
		danhSach?: SuKien.IUser[];
	}

	export interface IRecord {
		_id: string;
		loaiSuKien: ESuKienType;
		tenSuKien: string;
		maSuKien?: string;
		kinhPhiDuTru: IKinhPhiDuTru[];
		listNguoiDaThamDa?: IUser[];
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
		thoiGianDienRa?: string;
		kinhPhi?: number;
		soLuong?: number;
		diaDiem?: string;
		ghiChu?: string;
		trangThai?: ETrangThaiDienRa;
		kyHoc?: string;
		filter?: {
			roles?: EVaiTroBieuMau[];
			idKhoaSinhVien: string;
			idKhoa: string;
			idNganh: string;
			idLopHanhChinh: string;
			idLopHocPhan: string;
		};
		receiverType: EReceiverType;
		topics?: string[];
		users?: IUser[];
		roles?: EVaiTroBieuMau[];
	}
	export interface IUser {
		code: string;
		firstname: string;
		lastname: string;
		vaiTro?: EVaiTroBieuMau;
		thamGia?: boolean;
		fullname?: string;
	}
	export interface IKinhPhiDuTru {
		noiDung: string;
		dvTinh: string;
		loaiSoLuong: string;
		phong: string;
		soLuong: 0;
		luot: 0;
		dinhMuc: 'string';
		duToan: 0;
		nguonNSNN: 0;
		nguonTuChu: 0;
		nguonTaiTro: 0;
		phanBoNguon: 'Ngân sách nhà nước';
		chungTuYeuCau: 'string';
		hoanThanh: true;
		yKienTCKT: 'string';
		[key: string]: any;
	}
}
