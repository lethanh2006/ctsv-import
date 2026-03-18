import { type EVaiTroBieuMau } from '../TienIch/constant';
import { type EReceiverType, type ESuKienType, type ETrangThaiDienRa } from './constant';

declare module SuKienV2 {
	export interface ThongTinSukien {
		_id: string;
		tenSuKien: string;
		maSuKien: string;
		diaDiem: string;
		thoiGianBatDau?: string;
		anhBia?: string;
		thoiGianKetThuc?: string;
		thoiGianBatDauDangKy?: string;
		thoiGianKetThucDangKy?: string;
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
		cauHinhMinhChungId: string;
		_id: string;
		loaiSuKien: ESuKienType;
		tenSuKien: string;
		maSuKien?: string;
		kinhPhiDuTru: IKinhPhiDuTru[];
		listNguoiDaThamDa?: IUser[];
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
		thoiGianDienRa?: string;
		idKhaoSatDangKy?: string;
		idKhaoSatCheckIn?: string;
		idKhaoSatCheckOut?: string;
		anhBia?: string | null | undefined;
		isQRDangKy?: boolean;
		batBuocKhaoSatDangKy?: boolean;
		isQRThamGia?: boolean;
		batBuocKhaoSatThamGia?: boolean;
		isThongBao?: boolean;
		kinhPhi?: number;
		soCheckIn?: number;
		soCheckOut?: number;
		soDangKy?: number;
		soLuong?: number;
		diaDiem?: string;
		ghiChu?: string;
		isHieuLuc: boolean;
		thoiGianBatDauDangKy?: string | null;
		thoiGianKetThucDangKy?: string | null;
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
		dinhMuc: string;
		duToan: 0;
		nguonNSNN: 0;
		nguonTuChu: 0;
		nguonTaiTro: 0;
		phanBoNguon: string;
		chungTuYeuCau: string;
		hoanThanh: true;
		yKienTCKT: string;
		[key: string]: any;
	}
	export interface IRecordMaQR {
		maSuKien: string;
		hash: string;
		loaiQR: string;
	}

	export interface IRecordSinhVienSuKien {
		_id: string;
		idSuKien: string;
		tenSv: string;
		maSv: string;
		trangThaiThamGia: string;
		ssoId: string;
		thoiGian: string;
		thoiGianCheckIn: string;
		thoiGianCheckOut: string;
		loaiQR: string;
		isLamKhaoSatDangKy: boolean;
		isLamKhaoSatCheckOut: boolean;
		isLamKhaoSatCheckIn: boolean;
		__v: 0;
	}

	export interface IDataThongKe {
		tongDangKyThamGia: number;
		tongXacNhanThamGia: number;
		tongTuChoiThamGia: number;
		tongChuaXacNhanThamGia: number;
		tongLamKhaoSatDangKy: number;
		tongChuaLamKhaoSatDangKy: number;
		tongLamKhaoSatCheckIn: number;
		tongChuaLamKhaoCheckIn: number;
		tongLamKhaoSatCheckOut: number;
		tongChuaLamKhaoCheckOut: number;
		tongCheckin: number;
		tongCheckOut: number;
	}

	export interface IDataTraLoi {
		idCauHoi: string;
		listLuaChon: string[];
		listLuaChonBang: {
			idCot: string;
			textCot: string;
			idHang: string;
			textHang: string;
			_id: string;
		}[];
		listUrlFile: any[];
		_id: string;
	}

	export interface IDataTraLoiSinhVien {
		_id: string;
		idKhaoSat: string;
		userId: string;
		__v: 0;
		createdAt: string;
		danToc: string;
		danhSachTraLoi: IDataTraLoi[];
		gioiTinh: string;
		hoTen: string;
		idSuKien: string;
		loaiKhaoSatSuKien: string;
		saved: false;
		startedAt: string;
		trangThaiNopCoVan: string;
		trangThaiNopSV: string;
		trangThaiPhongCTSV: string;
		trangThaiSinhVien: string;
		updatedAt: string;
		userCode: string;
		userSsoId: string;
		vaiTro: string;
	}
}
