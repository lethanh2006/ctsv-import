import type { EGioiTinh, ETrangThaiCheckIn, ETrangThaiPhatHanh } from './constant';

declare module KyTucXa {
	export interface IToa {
		_id: string;
		ma: string;
		ten: string;
		diaChi: string;
	}

	export interface IPhong {
		_id: string;
		ma: string;
		ten?: string;

		maLoaiPhongKtx?: string;
		maGioiTinh?: EGioiTinh | string;
		soLuongToiDa?: number;
		soLuongHienTai?: number;
		cachBoTri?: string;
		maKhoanThuPhong?: string;
		maKhoanThuCoc?: string;
		moTa?: string;
		danhSachAnh?: string[];
		danhSachTienIch: ITienIch[];
		maToaNha?: string;
		tangThu?: number;
		soPhongTam?: number;
		loaiPhongKtx?: IDanhMucChung;
		isChoThue?: boolean;

		dangKyKyTucXaRule?: {
			_id?: string;
			phongId?: string;
			gioiTinh?: EGioiTinh | string;
			maxPerKhoa?: number | null;
			quocTichPhong?: string | null;
		};
	}

	export interface INamHoc {
		_id: string;
		ma: string;
		ten: string;
		thoiGianBatDau: string;
	}

	export interface IUnitLabel {
		_id: string;
		ma: string;
		donViTinh: string;
	}

	export interface IMucThu {
		_id: string;
		ma: string;
		name: string;
		unitAmount: number;
	}

	export interface IDanhMucChung {
		_id: string;
		maLoai: string;
		loaiDanhMucChung: ILoaiDanhMucChung;
		ma: string;
		ten: string;
		cauHinh?: {
			tienIchChung?: boolean;
		};
		anh?: string;
		ghiChu?: string;
	}

	export interface ITienIch {
		maDanhMucTienIch: string;
		soLuong: number;
	}

	export interface IDotDangKyKTX {
		_id: string;
		tenDot: string;
		maHocKy: string;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		ngayChuyenVao: string;
		ngayChuyenRa: string;
		loaiDot?: 'Theo khoa' | 'Theo danh sách';
		cauHinhKhoaToa?: ICauHinhKhoaToa[];
		hanDuyetMien?: string | null;
		maKhoaNganh: string[];
		danhSachToaNha?: string[];
		danhSachPhong?: string[];
		ghiChu: string;
		soLuongDon: number;
		trangThaiPhatHanh: ETrangThaiPhatHanh;
	}

	export interface ILoaiDanhMucChung {
		_id: string;
		ma: string;
		maLoai: string;
		ten: string;
		tenEn?: string | null;
		ghiChu: string | null;
		anh: string | null;
		dataPartitionCode: string | null;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface ICheckInSinhVien {
		_id: string;
		ssoId: string;
		maSinhVien: string;
		hoTen: string;
		maKhoaSinhVien?: string;
		khoaSinhVien?: {
			ma?: string;
			ten?: string;
		};
		maNganh?: string;
		tenNganh?: string;
		nganh?: {
			ma?: string;
			ten?: string;
		};
		soDienThoai?: string;
		email?: string;
		thoiGianDangKy?: string;
		ngayDangKy?: string;
		createdAt?: string;
		maPhong: string;
		tenPhong?: string;
		phong?: IPhong;
		maLoaiPhongKtx?: string;
		loaiPhongKtx?: IDanhMucChung;
		tangThu?: number;
		tang?: number;
		maToaNha: string;
		tenToaNha?: string;
		toaNha?: IToa;
		ngayBatDau: string;
		ngayKetThuc: string;
		ngayNhanPhong?: string;
		ngayTraPhong?: string;
		trangThai: ETrangThaiCheckIn;
		trangThaiThanhToan?: 'Unpaid' | 'Underpaid' | 'Paid' | string;
		dangKyId: string;
		ghiChu: string;
		sinhVien?: {
			ma?: string;
			maSinhVien?: string;
			hoTen?: string;
			maKhoaSinhVien?: string;
			khoaSinhVien?: {
				ma?: string;
				ten?: string;
			};
			maNganh?: string;
			tenNganh?: string;
			nganh?: {
				ma?: string;
				ten?: string;
			};
			soDienThoai?: string;
			email?: string;
		};
	}

	export interface IDanhSachMienKTX {
		_id: string;
		maHocKy: string;
		tenHocKy: string;
		hanNopMinhChung: string;
		ghiChu: string;
	}

	export interface IDanhSachMienKTXSinhVien {
		_id: string;
		danhSachId: string;
		maSinhVien: string;
		ssoId: string;
		hoTen: string;
		khoaSinhVien?: string;
		khoaNganh?: string | { ma?: string; ten?: string };
		tenKhoaNganh?: string;
		maKhoaNganh?: string;
		soDienThoai?: string;
		email?: string;
		urlMinhChung: string;
		trangThaiMinhChung?: ETrangThaiMienDangKyKTX | string;
		ngayDuyet: string;
		nguoiDuyet: string;
		ghiChuDuyet: string;
	}

	export interface IThongKePhong {
		maHocKy: string;
		tongQuan: {
			soLuongPhongChoThue: number;
			tongSoPhong: number;
			tongSucChua: number;
			soLuongSinhVienDaDangKy: number;
			soLuongChoConTrong: number;
		};
		bieuDoLapDayToaNha: {
			maToaNha: string;
			tenToaNha: string;
			sinhVienDaDangKy: number;
			tongSucChua: number;
			tiLeLapDay: number;
		}[];
	}
}
