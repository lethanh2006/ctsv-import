import type { EReceiverType } from '@/services/ThongBao/constant';
import { type BieuMau } from '../BieuMau/typings';
import { type ELoaiDoiTuong, type ELoaiDot, type EVaiTroBieuMau } from '../constant';

declare module DotKhaoSat {
	export interface IRecord {
		_id: string;
		ten: string;
		moTa: string;
		danhSachVaiTro: EVaiTroBieuMau;
		// chucNangSuDung: EChucNangSuDung[];
		loai: ELoaiDot;
		maHocKy: string;
		tenHocKy: string;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		kichHoat: boolean;
		idKhaoSat: string;
		khaoSat?: BieuMau.Record;
		danhSachLopTinChi: BieuMau.GeneralInfo[];
		danhSachLopHanhChinh: BieuMau.GeneralInfo[];
		danhSachNguoiDung: BieuMau.GeneralInfo[];
		danhSachKhoaHoc: BieuMau.GeneralInfo[];
		danhSachNganhHoc: BieuMau.GeneralInfo[];
		danhSachDonVi: BieuMau.GeneralInfo[];
		loaiDoiTuongSuDung: ELoaiDoiTuong[];
		// phamVi: EPhamViChuDe;
		// hinhThucDaoTaoId: string;
		daLam: boolean;
		public: boolean;
		receiverType: EReceiverType;
		daGuiThongBao: boolean;
		maDonVi: string;
		tenDonVi: string;
		idDonVi: string;
		thongTinNguoiTao: {
			nhanSuSsoId: string;
			ten: string;
			maCanBo: string;
			maDonVi: string;
			tenDonVi: string;
			idDonVi: string;
			_id: string;
		};

		//fake interface
		doiTuong: any[];
	}
	export interface IThongKe {
		daDong: number;
		dangChay: number;
	}
	export interface IDanhSachChiTiet {
		nguoiTraLoi: string;
		maDinhDanh: string;
		khoaHoc: string;
		nganh: string;
		loaiNguoidung: string;
		khoa: string;
		lopHanhChinh: string;
		thoiGianTraLoi: string;
		khaoSat: BieuMau.Record;
		dapAn: {
			[key: string]: any;
		};

		[key: string]: any;
	}

	export interface IThongKeGiangVien {
		maGiangVien: string;
		ssoId: string;
		tenGiangVien: string;
		thongKe: BieuMau.ThongKeKhoi[];
	}
}
