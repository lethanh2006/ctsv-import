import { EDKDTCongNo, EDKDTKetQuaHocTap, ETrangThaiThi } from './constant';

declare module LichThi {
	export interface NhanSuLichThi {
		index?: number;
		ssoId: string;
		ten: string;
		ma: string;
	}

	export interface SinhVienLichThi extends NhanSuLichThi {
		tenHocPhan: string;
		maHocPhan: string;
	}

	export interface PhanCongLichThi {
		index: number;
		_id: string;
		tenDonVi: string;
		maDonVi: string;
		giamThi: NhanSuLichThi;
	}

	export interface IRecord {
		_id: string;
		ten: string;
		kyThiId: string;
		kyThi?: KyThi.IRecord | string;
		maPhongThi: string;
		matKhauPhongThi: string;
		tenPhongThi: string;
		tenHinhThucThi: string;

		danhSachHocPhan?: Partial<HocPhanThi.IRecord>[];
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		public: boolean;

		isThiOnline: boolean;
		idBoDe: string;
		boDe: BoDe.IRecord;
		soPhut: number;
		kichHoat: boolean;
		isKetThucCa: boolean;
		trangThaiPhanCong: ETrangThaiPhanCong;

		giamSat: NhanSuLichThi;
		danhSachPhanCongLichThi: PhanCongLichThi[];
		danhSachSinhVien: Partial<SinhVienThi.IRecord>[];
		daLam: false;
		publicCoiThi: true;
		lock: false;
		isDungThi: false;

		tenLopHocPhan?: string;
		nhomThi?: string; // Nhóm học
		toThi?: string;

		listCaThi?: string[];
		soLuongSinhVien?: number;

		soQuotaCan?: number;
		soQuotaCanPhan?: number;
		soQuotaDaPhan?: number;

		maHocKy?: string;

		createdAt: string;
		updatedAt: string;
	}

	export interface IRecordSinhVien {
		lichThiId: string;
		kyThi: string;
		tenHocPhan: string;
		maHocPhan: string;
		soLuong: number;
		ngayThi: string;
		gioThi: string;
		ngayGioThi: Date;
		ngayGioThiKetThuc: Date;
		soPhut: number;
		phong: string;
		dieuKienKetQuaHocTap: EDKDTKetQuaHocTap;
		dieuKienCongNo: EDKDTCongNo;
		trangThai: ETrangThaiThi;
	}

	export interface IDataThongKe {
		_id: string;
		quota: number;
		daHoanThanh: number;
		chuaHoanThanh: number;
	}
}
